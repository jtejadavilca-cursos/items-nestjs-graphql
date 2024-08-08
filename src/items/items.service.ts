import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Args } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, createdBy: User): Promise<Item> {

    const newItem = this.itemsRepository.create(createItemInput);
    newItem.user = createdBy;

    return await this.itemsRepository.save(newItem);;
  }

  async findAll(owner: User, pagination: PaginationArgs, search: SearchArgs): Promise<Item[]> {

    const {limit, offset} = pagination;
    const { term } = search;

    const queryBuilder = this.itemsRepository.createQueryBuilder()
    .take(limit)
    .skip(offset)
    .where(`"userId"=:userId`, {userId: owner.id});

    if(term) {
      queryBuilder.andWhere('LOWER(name) like :name', {name: `%${term.toLowerCase()}%`})
    }

    return queryBuilder.getMany();

//    return await this.itemsRepository.find({where: {user: owner}});
  }

  async findOne(id: string, owner: User): Promise<Item> {
    const item = await this.itemsRepository.findOne({where: {id: id, user: owner}});
    if(!item) {
      throw new NotFoundException(`Item with id=${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, owner: User): Promise<Item> {
    this.findOne(updateItemInput.id, owner);

    const itemToUpdate = await this.itemsRepository.preload(updateItemInput);

    return this.itemsRepository.save(itemToUpdate);
  }

  async remove(id: string, owner: User): Promise<Item> {
    const item = await this.findOne(id, owner);

    await this.itemsRepository.delete(item);

    return item;
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({where: {user}});
  }
}

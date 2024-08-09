import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from 'src/user/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, owner: User): Promise<List> {
    const newList = this.listRepository.create(createListInput);
    newList.user = owner;
    return await this.listRepository.save(newList);
  }

  async findAll(owner: User, pagination: PaginationArgs, search: SearchArgs): Promise<List[]> {

    const {limit, offset} = pagination;
    const {term} = search;

    const queryBuilder = this.listRepository.createQueryBuilder()
    .take(limit)
    .skip(offset)
    .where(`"userId"=:userId`, {userId: owner.id});

    if(term) {
      queryBuilder.andWhere('LOWER(name) like :name', {name: `%${term.toLowerCase()}%`});
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, owner: User) {
    const list = await this.listRepository.findOne({where: {id, user: owner}});

    if(!list) {
      throw new NotFoundException(`List with id=${id} not found`);
    }

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, owner: User): Promise<List> {
    this.findOne(id, owner);

    const listToUpdate = await this.listRepository.preload(updateListInput);

    return await this.listRepository.save(listToUpdate);
  }

  async remove(id: string, owner: User) {
    const list = await this.findOne(id, owner)

    await this.listRepository.delete(list);

    return list;
  }
}

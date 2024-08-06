import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Args } from '@nestjs/graphql';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  private items: Item[] = [
    //{id: 1},{id: 2},{id: 3},{id: 4},{id: 5},{id: 6},
  ]

  async create(createItemInput: CreateItemInput): Promise<Item> {

    const newItem = this.itemsRepository.create(createItemInput);

    return await this.itemsRepository.save(newItem);;
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOne({where: {id: id}});
    if(!item) {
      throw new NotFoundException(`Item with id=${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    this.findOne(updateItemInput.id);

    const itemToUpdate = await this.itemsRepository.preload(updateItemInput);

    return this.itemsRepository.save(itemToUpdate);
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);

    await this.itemsRepository.delete(item);

    return item;
  }
}

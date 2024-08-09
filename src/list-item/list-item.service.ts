import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: {id: itemId},
      list: {id: listId},
    })
    return this.listItemsRepository.save(newListItem);
  }

  
  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {

    const { listId, itemId, ...rest } = updateListItemInput;


    const queryBuilder = this.listItemsRepository.createQueryBuilder()
    .update()
    .set( rest )
    .where('id=:id', {id});

    if(listId) {
      queryBuilder.set( {list: { id: listId }} );
    }

    if(itemId) {
      queryBuilder.set( {item: { id: itemId }} );
    }

    await queryBuilder.execute();

    return this.findOne(id);

    /**
     * Esta parte no funciona debido a las relaciones 
     *
    const listItem = await this.listItemsRepository.preload({
      ...rest,
      list: { id: listId },
      item: { id: itemId },
    });

    if( !listItem ) throw new NotFoundException(`List item with id=${id} not found`);

    return await this.listItemsRepository.save(listItem);
    */
  }

  async findAll(list: List, pagination: PaginationArgs, search: SearchArgs): Promise<ListItem[]> {

    const {limit, offset} = pagination;
    const { term } = search;

    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
    .innerJoin('listItem.item', 'item')
    .take(limit)
    .skip(offset)
    .where(`"listId"=:listId`, {listId: list.id});

    if(term) {
      queryBuilder.andWhere('LOWER(item.name) like :name', {name: `%${term.toLowerCase()}%`})
    }

    return queryBuilder.getMany();
  }

  async countByList(list: List): Promise<number> {
    return await this.listItemsRepository.count({where: {list}});
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = this.listItemsRepository.findOne({where: { id }})
    if( !listItem ) throw new NotFoundException(`List item with id=${id} not found.`);

    return listItem;
  }
}

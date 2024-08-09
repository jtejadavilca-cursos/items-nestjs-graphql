import { Resolver, Query, Mutation, Args, Int, Parent } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => ListItem)
@UseGuards( JwtAuthGuard )
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  async createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  @Mutation(()=> ListItem)
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput
  ) {
    return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // async findAll(
  //   @Args() pagination: PaginationArgs,
  //   @Args() search: SearchArgs,
  //   @Parent() list: List
  // ): Promise<ListItem[]> {
  //   return this.listItemService.findAll(list, pagination, search);
  // }

  @Query( () => ListItem, { name: 'listItem' } )
  async findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }
}

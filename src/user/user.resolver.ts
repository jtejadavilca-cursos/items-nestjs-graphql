import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

import { ValidRolesArgs } from 'src/auth/dto/args/roles.args';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  /*@Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }*/

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() pagination: PaginationArgs,
    @Args() search: SearchArgs,
    @Args() validRoles: ValidRolesArgs,
    @GetCurrentUser([ValidRoles.admin]) user: User
  ): Promise<User[]> {

    return this.userService.findAll(validRoles.roles, pagination, search);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @GetCurrentUser([ValidRoles.admin, ValidRoles.superUser]) user:User
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }) id: string,
    @GetCurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.userService.block(id, user);
  }
  
  
  @Mutation(() => User, {name: 'updateUser'})
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetCurrentUser([ValidRoles.superUser, ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.userService.update(updateUserInput.id, updateUserInput, user);
  }

  @ResolveField(() => Int)
  async itemCount(
    @Parent() user: User
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item])
  async items(
    @GetCurrentUser() adminUser: User,
    @Parent() user: User,
    @Args() pagination: PaginationArgs,
    @Args() search: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, pagination, search);
  }

  @ResolveField(() => [List])
  async lists(
    @GetCurrentUser() adminUser: User,
    @Parent() user: User,
    @Args() pagination: PaginationArgs,
    @Args() search: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, pagination, search);
  }
  
/*
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.remove(id);
  }
    */
}

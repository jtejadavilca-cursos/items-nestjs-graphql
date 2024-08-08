import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

import { ValidRolesArgs } from 'src/auth/dto/args/roles.args';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /*@Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }*/

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @GetCurrentUser([ValidRoles.superuser]) user: User
  ): Promise<User[]> {
    return this.userService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @GetCurrentUser([ValidRoles.admin, ValidRoles.superuser]) user:User
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }) id: string,
    @GetCurrentUser([ValidRoles.superuser, ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.userService.block(id, user);
  }
  
  
  @Mutation(() => User, {name: 'updateUser'})
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetCurrentUser([ValidRoles.superuser, ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.userService.update(updateUserInput.id, updateUserInput, user);
  }
/*
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.remove(id);
  }
    */
}

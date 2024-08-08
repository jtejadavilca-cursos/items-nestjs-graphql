import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class UserService {

  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {

      const newUser = this.userRepository.create({
        ...signupInput,
        password: AuthHelper.hashPassword(signupInput.password)
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    pagination: PaginationArgs,
    search: SearchArgs
  ): Promise<User[]> {


    const {offset, limit} = pagination;
    const {term} = search;

    if(roles == null || roles.length === 0) {
      return this.userRepository.findBy({isActive: true})
    }
    const queryBuilder = this.userRepository.createQueryBuilder()
    .take(limit)
    .skip(offset)
    .where({isActive: true})
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles);

    if(term) {
      queryBuilder.andWhere('LOWER("fullName") like :fullName', {fullName: `%${term.toLowerCase()}%`})
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, isActive: boolean = true): Promise<User> {
    let where = {id};
    if(isActive != null) {
      where['isActive'] = isActive;
    }

    const user = await this.userRepository.findOneBy(where);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneByOrFail({email, isActive: true});

    return user;
  }

  
  async block(id: string, currentUser: User): Promise<User> {
    if(id === currentUser.id) {
      throw new BadRequestException('Can not block your own account');
    }

    const user = await this.findOne(id);
    user.isActive = false;
    user.lastUpdateBy = currentUser;
    return this.userRepository.save(user);
  }

  /**
   * Method used to validate a user by id
   * 
   * @param userId user id
   * @returns user
   */
  async validate(userId: string): Promise<User> {
    if (!userId) {
      throw new BadRequestException('Invalid user id');
    }

    const user = await this.findOne(userId);
    delete user.password;
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput, currentUser: User): Promise<User> {
    await this.findOne(id, null);

    const userToUpdate = await this.userRepository.preload({
      ...updateUserInput
    });
    userToUpdate.lastUpdateBy = currentUser;

    return this.userRepository.save(userToUpdate);
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }


    this.logger.error(error.message);

    throw new InternalServerErrorException('Please check server logs');
  }
/*
  remove(id: string) {
    throw new Error('Method not implemented.');
  }*/
}

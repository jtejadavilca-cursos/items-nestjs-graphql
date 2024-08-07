import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { AuthHelper } from 'src/auth/helpers/auth.helper';

@Injectable()
export class UserService {

  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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

  async findAll(): Promise<User[]> {
    return this.userRepository.findBy({isActive: true});
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({id, isActive: true});
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneByOrFail({email, isActive: true});

    return user;
  }

  
  async block(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
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

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }


    this.logger.error(error.message);

    throw new InternalServerErrorException('Please check server logs');
  }

  /*update(id: string, updateUserInput: UpdateUserInput) {
    throw new Error('Method not implemented.');
  }

  remove(id: string) {
    throw new Error('Method not implemented.');
  }*/
}

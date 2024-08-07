import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupInput } from './dto/inputs/signup.input';
import { LoginInput } from './dto/inputs/login.input';
import { UserService } from 'src/user/user.service';
import { AuthResponse } from './dto/types/auth-response.type';
import { AuthHelper } from './helpers/auth.helper';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    
  async signup(signupInput: SignupInput): Promise<AuthResponse> {

    const user = await this.userService.create(signupInput);
    return {
        user,
        token: this.getJwtToken(user),
    } as AuthResponse;
  }


  async login(loginInput: LoginInput): Promise<AuthResponse> {
    try {
        const user = await this.userService.findByEmail(loginInput.email);
        if (AuthHelper.comparePassword(loginInput.password, user.password)) {
            return {
                user,
                token: this.getJwtToken(user),
            };
        }
        throw new BadRequestException('Wrong credentials');

    } catch (error) {
        throw new BadRequestException('Wrong credentials');
    }
  }
  
  revalidateToken(user: User): AuthResponse {
    return {
      user,
      token: this.getJwtToken(user),
    };
  }

  private getJwtToken(user: User): string {
    return this.jwtService.sign({id: user.id});
  }
}

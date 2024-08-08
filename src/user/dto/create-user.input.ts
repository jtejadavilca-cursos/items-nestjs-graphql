import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;


  @Field(() => String)
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  fullName: string;

  @Field(() => String)
  @MinLength(6)
  @MaxLength(100)
  @IsString()
  password: string;
}

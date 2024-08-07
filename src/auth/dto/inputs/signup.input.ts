import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";


@InputType()
export class SignupInput {
  @Field(() => String, { description: 'User fullname' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  fullName: string;

  @Field(() => String, { description: 'User email' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";

@InputType()
export class LoginInput {
    @Field(() => String, { description: 'User email' })
    @IsEmail()
    email: string;

    @Field(() => String, { description: 'User password' })
    @IsString()
    password: string;
}
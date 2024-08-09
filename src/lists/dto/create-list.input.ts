import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateListInput {

  
  @Field(() => String, { description: 'List name' })
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => String, { description: 'List description' })
  @IsString()
  @MinLength(3)
  description: string;

}

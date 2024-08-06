import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Item name' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @Field(() => Float, { description: 'Quantity of item' })
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field(() => String, { description: 'Quantity unit of item', nullable: true })
  @IsOptional()
  quantityUnits?: string;
}

import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  @Field(() => String)
  name: string;

  @Column('float')
  @Field(() => Float)
  quantity: number;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits: string; // e.g. 'g', 'ml', 'kg', 'litres', 'each'
}

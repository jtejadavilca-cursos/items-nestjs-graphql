import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  @Field(() => String)
  name: string;

  /*@Column('float')
  @Field(() => Float)
  quantity: number;*/

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits: string; // e.g. 'g', 'ml', 'kg', 'litres', 'each'


  // stores
  // user
  @ManyToOne(
    () => User,
    (user) => user.items,
    { nullable: false, lazy: true }
  )
  @Index('userId-index')
  @Field(() => User)
  user: User;


  @OneToMany(
    () => ListItem,
    (listItem) => listItem.list,
    { lazy: true }
  )
  @Field(()=>[ListItem])
  @IsArray()
  listItem: ListItem[];
}

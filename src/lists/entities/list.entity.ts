import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsArray, IsString, MinLength } from 'class-validator';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {

  @Field(() => ID, { description: 'Id list' })
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({type: 'text'})
  @Field(() => String)
  @IsString()
  @MinLength(3)
  name: string;

  @Column({type: 'text'})
  @Field(() => String)
  @IsString()
  @MinLength(3)
  description: string;

  @ManyToOne(
    () => User,
    (user) => user.lists,
    {nullable: false, lazy: true}
  )
  @Index('userId-list-index')
  @Field(() => User)
  user: User;

  @OneToMany(
    () => ListItem,
    (listItem) => listItem.list,
    { lazy: true }
  )
  listItem: ListItem[];
}

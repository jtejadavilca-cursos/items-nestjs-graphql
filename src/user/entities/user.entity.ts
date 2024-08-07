import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Example field (placeholder)' })
  id: string;

  @Column('text')
  @Field(() => String)
  fullName: string;

  @Column('text', { unique: true })
  @Field(() => String)
  email: string;

  @Column('text')
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  isActive: boolean;
}

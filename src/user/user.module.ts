import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ItemsModule } from 'src/items/items.module';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  providers: [
    UserResolver,
    UserService
  ],
  imports: [
    ItemsModule,
    ListsModule,
    TypeOrmModule.forFeature([User]),
  ],
  exports: [
    TypeOrmModule,
    UserService
  ],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListItemModule } from 'src/list-item/list-item.module';
import { ListItemService } from 'src/list-item/list-item.service';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [
    TypeOrmModule.forFeature([List]),
    ListItemModule
  ],
  exports: [
    TypeOrmModule,
    ListsService,
  ]
})
export class ListsModule {}

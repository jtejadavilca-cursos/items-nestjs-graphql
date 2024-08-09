import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { List } from 'src/lists/entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { CreateListItemInput } from 'src/list-item/dto/create-list-item.input';

@Injectable()
export class SeedService {
    private isProd: boolean;
    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,

        private readonly userService: UserService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService,
        private readonly listItemSerice: ListItemService
    ) {
        this.isProd = configService.get('STAGE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {
        // Limpiar DB
        if(this.isProd) {
            throw new UnauthorizedException('We can not execute SEED on production environment')
        }

        this.cleanDataBase();

        // Crear usuarios
        const user = await this.loadUsers();

        // Crer items
        const items = await this.loadItems(user);

        // Crear lists
        const lists = await this.loadLists(user);

        this.loadListItems(lists, items);

        return true;
    }

    async cleanDataBase() {
        this.listItemRepository.delete({})
        this.listRepository.delete({})
        this.itemRepository.delete({});
        this.userRepository.delete({});
    }

    async loadUsers(): Promise<User> {
        const users: User[] = [];

        for(const user of SEED_USERS) {
            users.push(await this.userService.create(user))
        }

        return users[0];
    }

    async loadItems(user: User): Promise<Item[]> {
        const items: Item[] = [];

        for(const item of SEED_ITEMS) {
            items.push(await this.itemsService.create(item, user));
        }

        return items;
    }

    async loadLists(user: User) {
        const lists: List[] = [];

        for(const list of SEED_LISTS) {
            lists.push(await this.listsService.create(list, user));
        }

        return lists;
    }
    async loadListItems(lists: List[], items: Item[]) {
        const listItems: ListItem[] = [];

        let group = 0;
        for (const list of lists) {
            const itemsGroup = items.slice(group, group + 5);
            for (const item of itemsGroup) {//
                const createListItem: CreateListItemInput = {
                    itemId: item.id,
                    listId: list.id,
                    quantity: Math.floor(Math.random()*100),
                    completed: false
                };
                listItems.push( await this.listItemSerice.create(createListItem) )
            }
        }
        return listItems;
    }
}

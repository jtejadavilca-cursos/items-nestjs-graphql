import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
    private isProd: boolean;
    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
        private readonly itemsService: ItemsService,
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
        this.loadItems(user);

        return true;
    }

    async cleanDataBase() {
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
}

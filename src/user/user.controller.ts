import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':username') // Cambié ':id' a ':username'
    getUser(@Param('username') username: string) { // Cambié 'id' a 'username'
        return this.userService.getUser(username);
    }

    @Post()
    createUser(@Body() data: User) {
        return this.userService.createUser(data);
    }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from '@nestjs/common';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post('/users')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/users/login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Get('/users')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  async getCurrentUSer(@Request() req): Promise<User> {
    const authUser = req.user;
    const { user } = await this.usersService.findByEmail(authUser.email);
    return user;
  }

  @UseGuards(AuthGuard)
  @Put('/user')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

}

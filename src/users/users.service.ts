import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const IsEmailInUse = await this.findByEmail(createUserDto.email);

    if (IsEmailInUse) {
      throw new ConflictException('this Email already in use');
    }
    
    const newUser = this.userRepository.create({
      id: uuid(),
      username: createUserDto.username,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    

    const user = await this.userRepository.save(newUser);

    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: Partial<User>;
  }> {
    const { user } = await this.findByEmail(loginDto.email);

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user.id, email: user.email };
    const { password, ...userWithoutPassword } = user;
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user: userWithoutPassword,
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'username', 'email'],
      where: { id },
    });

    if (user) {
      return { user };
    }

    throw NotFoundException;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      return { user };
    }

    return null;
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    user.image = updateUserDto.image;
    user.bio = updateUserDto.bio;

    await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ 
        where: { username }, 
        relations: ['followers'] 
    });
  }

  async findOneWithFollowers(id: string) {
    return this.userRepository.findOne({ 
        where: { id }, 
        relations: ['following'] 
    });
  }
}

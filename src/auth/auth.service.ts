import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { decode, JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { RefreshDto } from './dto/refresh.dto';

interface Payload extends JwtPayload {
  login: string;
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async refreshToken(refreshTokenDto: RefreshDto) {
    try {
      const { refreshToken } = refreshTokenDto;

      const token = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      if (!token) {
        throw new ForbiddenException('Token is not valid or expired');
      }

      const { userId, login } = decode(refreshToken) as Payload;

      const accessToken = await this.jwtService.signAsync(
        { userId, login },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      );
      const newRefreshToken = await this.jwtService.signAsync(
        { userId, login },
        { secret: process.env.JWT_SECRET, expiresIn: '1d' },
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ForbiddenException('Token is not valid or expired');
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async follow(username: string) {
    const { profile } = await this.findOne(username);

    profile.following = true;

    return profile;
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(username: string) {
    const profile = await this.profileRepository.findOne({
      where: { username },
    });

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    return { profile };
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}

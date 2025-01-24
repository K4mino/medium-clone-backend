import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post('/:username/follow')
  async follow(@Param('username') username: string,@Request() req) {
    const followerId = req.user.id
    return await this.profileService.follow(followerId,username);
  }

  @UseGuards(AuthGuard)
  @Get(':username')
  async findOne(@Param('username') username: string,@Request() req) {
    const currentUserId = req.user.id
    return await this.profileService.findOne(username, currentUserId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }
  @UseGuards(AuthGuard)
  @Delete('/:username/follow')
  async unFollow(@Param('username') username: string,@Request() req) {
    const followerId = req.user.id
    return await this.profileService.unFollow(followerId,username);
  }
}

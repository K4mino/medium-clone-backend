import { Controller, Get, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getTags(){
    return await this.tagsService.getTags()
  }
}

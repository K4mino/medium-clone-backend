import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>
    ){}

    async getTags(){
        return await this.tagsRepository.find()
    }
}

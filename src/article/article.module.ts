import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ProfileService } from 'src/profile/profile.service';
import { Article } from './entities/article.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { Comment } from 'src/comment/entities/comment.entity';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports:[TypeOrmModule.forFeature([Article,User,Comment]),UsersModule,ProfileModule,CommentModule],
  controllers: [ArticleController],
  providers: [ArticleService,ProfileService],
})
export class ArticleModule {}

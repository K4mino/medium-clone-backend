import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from '@nestjs/common';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto,@Request() req) {
    const authUserId = req.user.id;
    return this.articleService.create(createArticleDto,authUserId);
  }

  @UseGuards(AuthGuard)
  @Post(':slug/favorite')
  async addToFavorites(@Param('slug') slug: string,@Request() req){
    const authUserId = req.user.id;
    return this.articleService.addToFavorites(slug,authUserId)
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/favorite')
  async removeFromFavorites(@Param('slug') slug: string,@Request() req){
    const authUserId = req.user.id;
    return this.articleService.removeFromFavorites(slug,authUserId)
  }

  @UseGuards(AuthGuard)
  @Post(':slug/comments')
  async addComment(@Param('slug') slug:string,@Body() body:string,@Request() req){
    const authUserId = req.user.id;
    return this.articleService.addComment(slug,body,authUserId);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/comments/:id')
  async deleteComment(@Param('slug') slug:string,@Param('id') id:string){
    return this.articleService.deleteComment(slug,id)
  }

  @Get(':slug/comments')
  async getCommentsByArticle(@Param('slug') slug:string){
    return this.articleService.getCommentsByArticle(slug);
  }

  @Get()
  async findAll(
    @Query('tag') tag?:string,
    @Query('author') author?:string,
    @Query('favorited') favorited?:string,
    @Query('limit') limit:number = 20,
    @Query('offset') offset:number = 0) {
    return this.articleService.findAll(tag,author,favorited,limit,offset);
  }

  @UseGuards(AuthGuard)
  @Get('/feed')
  async getFeed(
    @Request() req,
    @Query('tag') tag?:string,
    @Query('author') author?:string,
    @Query('favorited') favorited?:string,
    @Query('limit') limit:number = 20,
    @Query('offset') offset:number = 0,
  ){
    const authUserId = req.user.id;
    return this.articleService.findAll(tag,author,favorited,limit,offset,authUserId)
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.articleService.findOne(slug);
  }

  @UseGuards(AuthGuard)
  @Patch(':slug')
  async update(@Param('slug') slug: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(slug, updateArticleDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug')
  async   remove(@Param('slug') slug: string) {
    return this.articleService.remove(slug);
  }
}

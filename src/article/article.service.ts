import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { DeepPartial, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ProfileService } from 'src/profile/profile.service';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository:Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly profileService: ProfileService,
  ){}

  async create(createArticleDto: CreateArticleDto,userId:string) {

    const slug =  this.getSlug(createArticleDto.title);

    const user = await this.userRepository.findOne({
      where:{id:userId},
      relations:{
        articles:true
      }
    })

    const { profile } = await this.profileService.findOne(user.username,userId)

    const newArticle = this.articleRepository.create({
      ...createArticleDto,
      slug,
      favorited:false,
      favoritesCount:0,
      author: { username: user.username } as DeepPartial<User>
    });

    const savedArticle = await this.articleRepository.save(newArticle);

    user.articles.push(newArticle);

    await this.userRepository.save(user)

    return {
      article:{
        ...savedArticle,
        author:{
          ...profile
        }
      }
    };
  }

  async findAll(tag?:string,author?:string,favorited?:string,limit?:number,offset?:number,authUserId?:string) {

    const query =  this.articleRepository.createQueryBuilder('article').leftJoinAndSelect('article.author', 'author');

    if(authUserId){
      const user = await this.userRepository.findOne({
        where:{
          id:authUserId
        },
        relations:{
          following:true
        }
      })

      if(!user) throw new NotFoundException('User not found');

      const followingIds = user.following.map((followedUser) => followedUser.id);

      query.andWhere('author.id IN (:...followingIds)',{followingIds})
    }

    if(tag){
      query.andWhere(':tag = ANY(article.tagList)',{tag})
    }

    if(author){
      const user = await this.userRepository.findOne({where:{username:author}})
      query.andWhere('article.authorId  = :authorId',{ authorId:user.id })
    }

    if(favorited){
      const favoritingUser = await this.userRepository.findOne(
        { 
          where: { username: favorited } ,
          relations: ['favorites']
        }
      );
      if (!favoritingUser) throw new NotFoundException('User not found');

      query 
      .innerJoin('article.favoritedBy', 'favoritedBy')
      .andWhere('favoritedBy.username = :favorited',{ favorited })
    }

    query
    .orderBy('article.createdAt','DESC')
    .limit(limit)
    .offset(offset)

    return  query.getMany();
  }

  async findOne(slug: string) {
    const article = await this.articleRepository.findOne({
      where:{slug}
    });

    if(!article){
      throw new NotFoundException('Article not found');
    }
    return {article}
  }

  async update(slug: string, updateArticleDto: UpdateArticleDto) {
    try {
      const { article } =  await this.findOne(slug)

      if(!article){
        throw new NotFoundException('Article not found');
      }

      article.title = updateArticleDto.title
      article.description = updateArticleDto.description
      article.body = updateArticleDto.body
      article.slug = this.getSlug(updateArticleDto.title)
    
      await this.articleRepository.save(article)

      return { article };
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(slug: string) {
   try {
    const article = await this.articleRepository.findOne({
      where:{ slug },
      relations: ['author','favorites']
    })

    if(!article){
      throw new NotFoundException('Article not found');
    }
    const usersWithFavorites = await this.userRepository.find({
      where: { favorites: { id: article.id } },
      relations: ['favorites'],
    });

    for (const user of usersWithFavorites) {
      user.favorites = user.favorites.filter(fav => fav.id !== article.id);
      await this.userRepository.save(user);
    }

    await this.articleRepository.delete(article.id);

    return `Article ${slug} removed successfully`;

   } catch (error) {
    throw new Error(error)
   }
  }

  async addToFavorites(slug:string,userId:string){
    try {
      const { article } = await this.findOne(slug)

      const user = await this.userRepository.findOne({
        where:{
          id:userId
        },
        relations:['favorites']
      })
      user.favorites.push(article);

      await this.userRepository.save(user)

      return { article }
    } catch (error) {
      throw new Error(error)
    }
  }

  async removeFromFavorites(slug:string,userId:string){
    try {
      const { article } = await this.findOne(slug)

      const user = await this.userRepository.findOne({
        where:{
          id:userId
        },
        relations:['favorites']
      })

      user.favorites = user.favorites.filter(favoriteArticle => favoriteArticle.id != article.id);

      await this.userRepository.save(user)

      return { article }
    } catch (error) {
      throw new Error(error)
    }
  }

  async addComment(slug:string,body:string,userId:string){
    try {
      const article = await this.articleRepository.findOne({
        where:{ slug },
        relations: ['comments']
      })

      const newComment =  this.commentRepository.create({
        body,
      })

      article.comments.push(newComment)

      await this.commentRepository.save(newComment)
      await this.articleRepository.save(article)

      return { article }
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteComment(slug:string,commentId:string){
    try {
      const article = await this.articleRepository.findOne({
        where:{ slug },
        relations: ['comments']
      })

      article.comments = article.comments.filter(comm => comm.id != commentId)

      await this.articleRepository.save(article)
    } catch (error) {
      throw new Error(error)
    }
  }

  async getCommentsByArticle(slug:string){
    try {
      const article = await this.articleRepository.findOne({
        where:{ slug },
        relations: ['comments']
      })

      return article.comments
    } catch (error) {
      throw new Error(error)
    }
  }

  getSlug(title:string){
    return title.toLowerCase().split(' ').join('-')
  }
}

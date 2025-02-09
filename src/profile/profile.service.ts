import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';  
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async follow(followerId:string,username: string) {
    const userToFollow =  await this.userRepository.findOne({ 
      where: { username }, 
      relations:{followers:true,following:true}
  })
    
    if(!userToFollow){
      throw new NotFoundException('User not found')
    }

    const currentUser = await this.userRepository.findOne({ 
      where: { id:followerId },
      relations:{followers:true,following:true}
  })

    const isFollowing = userToFollow.followers.some(user => user.id === followerId)

    if(!isFollowing){
      userToFollow.followers.push(currentUser);
      await this.userRepository.save(userToFollow);
    }

    return {
      username:userToFollow.username,
      bio:userToFollow.bio,
      image:userToFollow.image,
      following:true
    };
  }

  async unFollow(followerId:string,username: string) {
    const userToFollow =  await this.userRepository.findOne({ 
      where: { username },
      relations:{followers:true,following:true}
  })
    
    if(!userToFollow){
      throw new NotFoundException('User not found')
    }

    const isFollowing = userToFollow.followers.some(user => user.id === followerId)

    if(isFollowing){
      userToFollow.followers = userToFollow.followers.filter(user => user.id !== followerId);
      await this.userRepository.save(userToFollow);
    }

    return {
      username:userToFollow.username,
      bio:userToFollow.bio,
      image:userToFollow.image,
      following:false
    };
  }

  async findOne(username: string, currentUserId:string) {
    const profile = await this.userRepository.findOne({
      where: { username },
      relations:{followers:true,following:true}
    });

    if (!profile) {
      throw new NotFoundException('profile not found');
    }
   
    const isFollowing = profile.followers.some(follower => follower.id === currentUserId);
 
    return { 
      profile:{
          username:profile.username,
          bio:profile.bio,
          image:profile.image,
          following:isFollowing
      } 

    };
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}

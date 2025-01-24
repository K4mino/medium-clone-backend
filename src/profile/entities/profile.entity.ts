import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id:string
  @Column()
  username: string;
  @Column()
  bio: string;
  @Column()
  image: string;
  @Column()
  following: boolean;

}

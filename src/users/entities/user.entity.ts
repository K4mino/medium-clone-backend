import { Profile } from 'src/profile/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable  } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  username: string;
  @Column({ unique: true })
  email: string;
  @Column('text')
  password: string;
  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  bio: string;

  @ManyToMany(() => User, user => user.followers)
  @JoinTable()
  following:User[]

  @ManyToMany(() => User, user=>user.following)
  followers:User[]
}

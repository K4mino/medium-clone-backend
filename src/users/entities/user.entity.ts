import { Article } from 'src/article/entities/article.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany  } from 'typeorm';

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

  @OneToMany(() => Article, article => article.author,{onDelete:'CASCADE'})
  articles:Article[]

  @OneToMany(() => Comment, comment => comment.author,{onDelete:'CASCADE'})
  comments:Comment[]

  @ManyToMany(() => Article,(article) => article.favoritedBy,{onDelete:'CASCADE'})
  @JoinTable()
  favorites:Article[]
}

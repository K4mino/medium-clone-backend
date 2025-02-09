import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, Timestamp, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, DeepPartial  } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @CreateDateColumn({type:'timestamp'})
    createdAt:Date;
    @UpdateDateColumn({type:'timestamp'})
    updatedAt:Date;
    @Column()
    body:string;

    @ManyToOne(() => User, (user) => user.comments,{ onDelete: 'CASCADE' })
    author:User

    @ManyToOne(()=> Article, (article) => article.comments, { onDelete: "CASCADE" })
    article:Article
}

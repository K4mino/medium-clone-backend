import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, Timestamp, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, DeepPartial  } from 'typeorm';

@Entity()
export class Article {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    slug:string;
    @Column()
    title:string;
    @Column()
    body:string;
    @Column()
    description:string;
    @Column()
    favorited:boolean;
    @Column('text',{array:true})
    tagList:string[];
    @CreateDateColumn({type:'timestamp'})
    createdAt:Date;
    @UpdateDateColumn({type:'timestamp'})
    updatedAt:Date;
    @Column({default:0})
    favoritesCount:number;

    @ManyToOne(() => User, (user) => user.articles,{ onDelete: 'CASCADE' })
    author:User

    @OneToMany(() => Comment, comment => comment.article,{eager:true})
    @JoinColumn()
    comments:Comment[]

    @ManyToMany(() => User,(user) => user.favorites,{ onDelete: 'CASCADE' })
    favoritedBy:User[]
}

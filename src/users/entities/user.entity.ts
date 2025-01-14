import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  @Column()
  image: string;
  @Column()
  bio: string;
}

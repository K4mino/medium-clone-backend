import { Column, Entity } from 'typeorm';

@Entity()
export class Profile {
  @Column()
  username: string;
  @Column()
  bio: string;
  @Column()
  image: string;
  @Column()
  following: boolean;
}

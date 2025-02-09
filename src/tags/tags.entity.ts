import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tag{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    tag:string;
}
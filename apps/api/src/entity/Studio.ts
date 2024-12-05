import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Studio {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  displayName: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @ManyToMany(() => User)
  engineers: User[];
}

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Studio } from "./Studio";
import { UserType } from "../types";

export type UserInput = {
  displayName: string;
  email: string;
  userType: UserType;
};

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  displayName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  userType: string;

  @ManyToMany(() => Studio, (studio) => studio.engineers)
  studios: Studio[];
}

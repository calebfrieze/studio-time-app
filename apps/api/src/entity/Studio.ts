import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
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

  @ManyToMany(() => User, user => user.studios)
  @JoinTable({
    joinColumn: {
      name: "studio_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "engineer_id",
      referencedColumnName: "id",
    },
  })
  engineers: User[];
}

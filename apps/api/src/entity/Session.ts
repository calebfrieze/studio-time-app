import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Studio } from "./Studio";

export type SessionInput = {
  startTime: string;
  endTime: string;
  date: string;
  engineerId: string;
  studioId: string;
  customerId: string;
};

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time" })
  endTime: string;

  @Column()
  engineerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "engineerId" })
  engineer: User;

  @Column()
  studioId: string;

  @ManyToOne(() => Studio)
  @JoinColumn({ name: "studioId" })
  studio: Studio;

  @Column()
  customerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "customerId" })
  customer: User;

  @Column()
  date: Date;
}

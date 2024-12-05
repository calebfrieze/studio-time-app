import "reflect-metadata";

import { DataSource } from "typeorm";
import { User, Session, Studio } from "./entity";

const entities = [User, Session, Studio];

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://test:test@postgres:5432/test?schema=public",
  synchronize: true,
  logging: true,
  entities,
  subscribers: [],
  migrations: [],
});

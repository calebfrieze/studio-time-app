import { DataSource } from "typeorm";
import { Studio } from "./entity/Studio";
import { User } from "./entity/User";

export async function seed(dataSource: DataSource) {
  // Clear existing data
  await dataSource.getRepository(User).clear();
  await dataSource.getRepository(Studio).clear();

  // Create users
  const users = await dataSource.getRepository(User).save([
    {
      email: "admin@example.com",
      displayName: "Chris Lorde-Alge",
      userType: "engineer",
    },
    {
      email: "gregwells@gmail.com",
      displayName: "Greg Wells",
      userType: "engineer",
    },
    {
      email: "michael@brauer.com",
      displayName: "Michael Brauer",
      userType: "engineer",
    },
  ]);

  // Create studios
  await dataSource.getRepository(Studio).save([
    {
      displayName: "East West Studios",
      city: "Los Angeles",
      state: "CA",
      engineers: users.filter((user): user is User => !!user),
    },
    {
      displayName: "The Village Studios",
      city: "Los Angeles",
      state: "CA",
      engineers: users.filter((user): user is User => !!user),
    },
  ]);
}

import { DataSource } from "typeorm";
import { Studio } from "./entity/Studio";
import { User } from "./entity/User";
import { Session } from "./entity/Session";

export async function seed(dataSource: DataSource) {
  // if data already exists, don't seed
  const userCount = await dataSource.getRepository(User).count();
  if (userCount > 0) {
    return;
  }

  // Clear existing data
  await dataSource.query('DELETE FROM "studio_engineers_user"');
  await dataSource.getRepository(Session).delete({}); // Delete all sessions first
  await dataSource.getRepository(User).delete({}); // Then users
  await dataSource.getRepository(Studio).delete({}); // Then studios

  // Create users
  const users = await dataSource.getRepository(User).save([
    {
      email: "cla@cla.com",
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
    {
      email: "john@doe.com",
      displayName: "John Doe",
      userType: "customer",
    },
  ]);

  // Create studios
  const studios = await dataSource.getRepository(Studio).save([
    {
      displayName: "East West Studios",
      city: "Los Angeles",
      state: "CA",
      engineers: users[0] ? [users[0]] : [],
    },
    {
      displayName: "The Village Studios",
      city: "Los Angeles",
      state: "CA",
      engineers: users[1] ? [users[1]] : [],
    },
    {
      displayName: "The Sound Factory",
      city: "Los Angeles",
      state: "CA",
      engineers: users[2] ? [users[2]] : [],
    },
  ]);

  if (studios[0] && users[0]) {
    await dataSource.getRepository(Session).save([
      {
        startTime: "05:00",
        endTime: "012:00",
        date: new Date("2024-12-06"),
        studio: studios[0],
        engineer: users[0],
        customer: users[3],
      },
      {
        startTime: "06:00",
        endTime: "07:00",
        date: new Date("2024-12-07"),
        studio: studios[0],
        engineer: users[0],
        customer: users[3],
      },
      {
        startTime: "07:00",
        endTime: "08:00",
        date: new Date("2024-12-08"),
        studio: studios[0],
        engineer: users[0],
        customer: users[3],
      },
    ]);
  }
}

import { In, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import { AppDataSource } from "./data-source";
import { Session, SessionInput, Studio } from "./entity";
import { User, UserInput } from "./entity/User";
import { UserType } from "./types";

export const resolvers = {
  Query: {
    users: () => {
      const userRepository = AppDataSource.getRepository(User);
      return userRepository.find();
    },
    studios: () => {
      const studioRepository = AppDataSource.getRepository(Studio);
      return studioRepository.find();
    },
    getCustomerById: (_: any, { id }: { id: string }) => {
      const customerRepository = AppDataSource.getRepository(User);
      return customerRepository.findOne({
        where: { id },
      });
    },
    getSessionsByEngineerId: (
      _: any,
      { engineerId }: { engineerId: string },
    ) => {
      const sessionRepository = AppDataSource.getRepository(Session);
      return sessionRepository.find({
        where: {
          engineerId,
        },
        relations: ["engineer", "studio", "customer"],
      });
    },
    getSessionById: (_: any, { id }: { id: string }) => {
      const sessionRepository = AppDataSource.getRepository(Session);
      return sessionRepository.findOne({
        where: {
          id,
        },
        relations: ["engineer", "studio", "customer"],
      });
    },
    getSessionsByCustomerId: (
      _: any,
      { customerId }: { customerId: string },
    ) => {
      const sessionRepository = AppDataSource.getRepository(Session);
      return sessionRepository.find({
        where: {
          customerId,
        },
        relations: ["engineer", "studio", "customer"],
      });
    },
    getCustomersByEmail: (_: any, { email }: { email: string }) => {
      const customerRepository = AppDataSource.getRepository(User);
      return customerRepository.find({
        where: {
          userType: UserType.CUSTOMER,
          email,
        },
      });
    },
    getEngineersByAvailability: async (
      _: any,
      {
        start,
        end,
        date,
        studioId,
      }: { start: string; end: string; date: string; studioId: string },
    ) => {
      const engineerRepository = AppDataSource.getRepository(User);
      const sessionRepository = AppDataSource.getRepository(Session);

      // Find sessions that overlap with the given time range on the given date
      const overlappingSessions = await sessionRepository.find({
        where: {
          date: new Date(date),
          startTime: LessThanOrEqual(end),
          endTime: MoreThanOrEqual(start),
        },
        relations: ["engineer"],
      });

      const overlappingUserIds = overlappingSessions.map(
        (session) => session.engineer.id,
      );

      return engineerRepository.find({
        where: {
          userType: UserType.ENGINEER,
          id: Not(In(overlappingUserIds)),
          studios: {
            id: studioId,
          },
        },
        relations: ["studios"],
      });
    },
  },
  Mutation: {
    createSession: async (_: any, { session }: { session: SessionInput }) => {
      const sessionRepository = AppDataSource.getRepository(Session);
      return sessionRepository.save(session);
    },
    createCustomer: async (_: any, { customer }: { customer: UserInput }) => {
      const customerRepository = AppDataSource.getRepository(User);
      return customerRepository.save(customer);
    },
  },
};

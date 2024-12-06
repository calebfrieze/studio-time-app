import { In, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import { AppDataSource } from "./data-source";
import { Session, SessionInput, Studio } from "./entity";
import { User, UserInput } from "./entity/User";
import { UserType } from "./types";
import { parse } from "date-fns";

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
    getUsersByEmail: (_: any, { email }: { email: string }) => {
      const usersRepository = AppDataSource.getRepository(User);
      return usersRepository.find({
        where: {
          email,
        },
      });
    },
    getUserById: (_: any, { id }: { id: string }) => {
      const usersRepository = AppDataSource.getRepository(User);
      return usersRepository.findOne({
        where: { id },
      });
    },
    getCustomerById: (_: any, { id }: { id: string }) => {
      const customerRepository = AppDataSource.getRepository(User);
      return customerRepository.findOne({
        where: { id },
      });
    },
    getSessionsByUserId: (_: any, { userId }: { userId: string }) => {
      const sessionRepository = AppDataSource.getRepository(Session);
      return sessionRepository.find({
        where: [
          {
            engineerId: userId,
          },
          {
            customerId: userId,
          },
        ],
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
      const studioRepository = AppDataSource.getRepository(Studio);
      const userRepository = AppDataSource.getRepository(User);

      // Find and validate studio
      const studio = await studioRepository.findOne({
        where: { id: session.studioId },
      });
      if (!studio) {
        throw new Error("Studio not found");
      }

      // Find and validate engineer
      const engineer = await userRepository.findOne({
        where: { id: session.engineerId },
      });
      if (!engineer) {
        throw new Error("Engineer not found");
      }

      // Find and validate customer
      const customer = await userRepository.findOne({
        where: { id: session.customerId },
      });
      if (!customer) {
        throw new Error("Customer not found");
      }

      // Check for overlapping sessions
      const overlappingSessions = await sessionRepository.find({
        where: {
          date: new Date(session.date),
          startTime: LessThanOrEqual(session.endTime),
          endTime: MoreThanOrEqual(session.startTime),
          engineer: { id: engineer.id },
        },
      });

      if (overlappingSessions.length > 0) {
        throw new Error("Engineer is already booked during this time");
      }

      // Create the session
      return sessionRepository.save({
        ...session,
        engineer,
        studio,
        customer,
      });
    },
    createCustomer: async (_: any, { customer }: { customer: UserInput }) => {
      const customerRepository = AppDataSource.getRepository(User);
      return customerRepository.save(customer);
    },
    deleteSessionById: (_: any, { id }: { id: string }) => {
      const sessionRepository = AppDataSource.getRepository(Session);
      return sessionRepository.delete(id);
    },
  },
};

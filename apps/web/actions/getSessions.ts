import { gql } from "@apollo/client";
import { query } from "../clients/graphql";

export async function getSessionsByUserId(userId: string) {
  const { data } = await query({
    query: gql`
      query getSessionsByUserId($userId: String!) {
        getSessionsByUserId(userId: $userId) {
          id
          startTime
          endTime
          date
          engineer {
            id
            displayName
          }
          studio {
            id
            displayName
          }
        }
      }
    `,
    variables: {
      userId,
    },
  });

  return data.getSessionsByUserId;
}

export async function getSessionsByEngineerId(engineerId: string) {
  const { data } = await query({
    query: gql`
      query getSessionsByEngineerId($engineerId: String!) {
        getSessionsByEngineerId(engineerId: $engineerId) {
          id
          startTime
          endTime
          date
          studio {
            id
            displayName
          }
        }
      }
    `,
    variables: {
      engineerId,
    },
  });

  return data.getSessionsByEngineerId;
}

export async function getSessionById(id: string) {
  const { data } = await query({
    query: gql`
      query getSessionById($id: String!) {
        getSessionById(id: $id) {
          id
          startTime
          endTime
          date
          engineer {
            id
            displayName
          }
          studio {
            id
            displayName
          }
          customer {
            id
            displayName
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return data.getSessionById;
}

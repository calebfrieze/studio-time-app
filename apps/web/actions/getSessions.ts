import { gql } from "@apollo/client";
import { query } from "../clients/graphql";

export async function getSessionsByCustomerId(customerId: string) {
  const { data } = await query({
    query: gql`
      query getSessionsByCustomerId($customerId: String!) {
        getSessionsByCustomerId(customerId: $customerId) {
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
      customerId,
    },
  });

  return data.getSessionsByCustomerId;
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

"use server";

import { gql } from "@apollo/client";
import { query } from "../clients/graphql";

export async function createSession({
  start,
  end,
  date,
  engineerId,
  studioId,
  customerId,
}: {
  start: string;
  end: string;
  date: string;
  engineerId: string;
  studioId: string;
  customerId: string;
}) {
  try {
    const { data } = await query({
      query: gql`
        mutation createSession($session: SessionInput!) {
          createSession(session: $session) {
            id
          }
        }
      `,
      variables: {
        session: {
          startTime: start,
          endTime: end,
          date,
          engineerId,
          studioId,
          customerId,
        },
      },
    });
    return data.createSession;
  } catch (e) {
    console.error(e);
  }
}

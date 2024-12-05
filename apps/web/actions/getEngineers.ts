import { gql } from "@apollo/client";
import { User } from "../../api/src/entity";
import { query } from "../clients/graphql";

export async function getEngineersByAvailability({
  start,
  end,
  date,
  studioId,
}: {
  start: string;
  end: string;
  date: string;
  studioId: string;
}): Promise<User[]> {
  const { data } = await query({
    query: gql`
      query getEngineersByAvailability(
        $start: String!
        $end: String!
        $date: String!
        $studioId: String!
      ) {
        getEngineersByAvailability(
          start: $start
          end: $end
          date: $date
          studioId: $studioId
        ) {
          id
          displayName
          email
          studios {
            displayName
          }
        }
      }
    `,
    variables: {
      start,
      end,
      date,
      studioId,
    },
  });

  return data.getEngineersByAvailability;
}

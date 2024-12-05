import { gql } from "@apollo/client";
import { query } from "../clients/graphql";
import { Studio } from "../../api/src/entity";

export async function getStudios(): Promise<Studio[]> {
  const { data } = await query({
    query: gql`
      query Query {
        studios {
          id
          displayName
        }
      }
    `,
  });

  return data.studios;
}

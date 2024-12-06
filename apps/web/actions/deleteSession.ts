import { gql } from "@apollo/client";
import { query } from "../clients/graphql";

export async function deleteSessionById(id: string) {
  const { data } = await query({
    query: gql`
      mutation deleteSessionById($id: String!) {
        deleteSessionById(id: $id) {
          id
        }
      }
    `,
    variables: {
      id,
    },
  });

  return data.deleteSessionById;
}

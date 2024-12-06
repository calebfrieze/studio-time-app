import { gql } from "@apollo/client";
import { query } from "../clients/graphql";
import { User } from "../../api/src/entity";

export async function getUsersByEmail(email: string): Promise<User[]> {
  const { data } = await query({
    query: gql`
      query getUsersByEmail($email: String!) {
        getUsersByEmail(email: $email) {
          id
        }
      }
    `,
    variables: {
      email,
    },
  });

  return data.getUsersByEmail;
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await query({
    query: gql`
      query getUserById($id: String!) {
        getUserById(id: $id) {
          id
          displayName
          email
          userType
        }
      }
    `,
    variables: { id },
  });

  return data.getUserById;
}

import { gql } from "@apollo/client";
import { query } from "../clients/graphql";
import { User } from "../../api/src/entity";

export async function getCustomersByEmail(email: string): Promise<User[]> {
  const { data } = await query({
    query: gql`
      query getCustomersByEmail($email: String!) {
        getCustomersByEmail(email: $email) {
          id
        }
      }
    `,
    variables: {
      email,
    },
  });

  return data.getCustomersByEmail;
}

export async function getCustomerById(id: string): Promise<User> {
  const { data } = await query({
    query: gql`
      query getCustomerById($id: String!) {
        getCustomerById(id: $id) {
          id
          displayName
          email
          userType
        }
      }
    `,
    variables: { id },
  });

  return data.getCustomerById;
}

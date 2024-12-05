"use server";

import { gql } from "@apollo/client";
import { query } from "../clients/graphql";
import { UserType } from "../../api/src/types";

export async function createCustomer({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { data } = await query({
    query: gql`
      mutation createCustomer($customer: UserInput!) {
        createCustomer(customer: $customer) {
          id
        }
      }
    `,
    variables: {
      customer: {
        displayName: name,
        email,
        userType: UserType.CUSTOMER,
      },
    },
  });

  return data.createCustomer;
}

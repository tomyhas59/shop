import { gql } from "graphql-tag";

export const EXECUTE_PAY = gql`
  mutation ExecutePay($ids: [ID!]) {
    executePay(ids: $ids)
  }
`;

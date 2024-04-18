import { gql } from "graphql-tag";

export const EXECUTE_PAY = gql`
  mutation ExecutePay($uid: ID!, $ids: [ID!]) {
    executePay(uid: $uid, ids: $ids)
  }
`;

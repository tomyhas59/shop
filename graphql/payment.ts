import { gql } from "graphql-tag";

export const EXECUTE_PAY = gql`
  mutation ExecutePay($uid: ID!, $ids: [ID!]) {
    executePay(uid: $uid, ids: $ids)
  }
`;

export const GET_ORDERS = gql`
  query GET_ORDERS($uid: ID!) {
    orders(uid: $uid) {
      id
      amount
      product {
        id
        imageUrl
        price
        title
        description
        createdAt
      }
    }
  }
`;

export const DELETE_ORDERS = gql`
  mutation DELETE_ORDERS($id: ID!) {
    deleteOrders(ordersId: $id)
  }
`;

export const DELETE_ALL_ORDERS = gql`
  mutation DELETE_ORDERS {
    deleteAllOrders
  }
`;

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
      createdAt
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

export const DELETE_ORDER = gql`
  mutation DELETE_ORDERS($id: ID!) {
    deleteOrder(orderId: $id)
  }
`;

export const DELETE_ALL_ORDERS = gql`
  mutation DELETE_ORDERS {
    deleteAllOrders
  }
`;

export const DELETE_SELECTED_ORDERS = gql`
  mutation DELETE_SELECTED_ORDERS($ids: [ID!]!) {
    deleteSelectedOrders(ids: $ids)
  }
`;

import gql from "graphql-tag";
import { Product } from "./products";

export type Cart = {
  id: string;
  amount: number;
  product: Product;
};

export const ADD_CART = gql`
  mutation ADD_CART($id: ID!) {
    addCart(id: $id) {
      id
      imageUrl
      price
      title
      amount
    }
  }
`;

export const GET_CART = gql`
  query GET_CART {
    getCart {
      id
      amount
      product {
        id
        imageUrl
        price
        title
        description
        createAt
      }
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UPDATE_CART($id: ID!, $amount: Int) {
    updateCart(id: $id, amount: $amount) {
      id
      imageUrl
      price
      title
      amount
    }
  }
`;

export const DELETE_CART = gql`
  mutation DELETE_CART($id: ID!) {
    deleteCart(id: $id)
  }
`;

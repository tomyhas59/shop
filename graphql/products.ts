import gql from "graphql-tag";

export type Product = {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  description: string;
  createAt: string;
};

export type Products = {
  products: Product[];
};

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    product(id: $id) {
      id
      imageUrl
      price
      title
      description
      createAt
    }
  }
`;

const GET_PRODUCTS = gql`
  query GET_PRODUCTS($cursor: ID!) {
    products(cursor: $cursor) {
      id
      imageUrl
      price
      title
      description
      createAt
    }
  }
`;

export default GET_PRODUCTS;

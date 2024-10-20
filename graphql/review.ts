import { gql } from "graphql-tag";

export type Review = {
  id: string;
  content: string;
  rating: number;
  uid: string;
  createdAt: string;
};

export const GET_REVIEWS = gql`
  query GET_REVIEWS($productId: ID!) {
    reviews(productId: $productId) {
      id
      content
      rating
      uid
      createdAt
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation ADD_REVIEW(
    $productId: ID!
    $content: String!
    $rating: Int!
    $uid: ID!
  ) {
    addReview(
      productId: $productId
      content: $content
      rating: $rating
      uid: $uid
    ) {
      id
      content
      rating
      createdAt
    }
  }
`;

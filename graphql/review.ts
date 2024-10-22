import { gql } from "graphql-tag";

export type Review = {
  id: string;
  content: string;
  rating: number;
  userId: string;
  createdAt: string;
  user: {
    nickname: string;
  };
};

export const GET_REVIEWS = gql`
  query GET_REVIEWS($productId: ID!, $userId: ID!) {
    reviews(productId: $productId, userId: $userId) {
      id
      content
      rating
      user
      createdAt
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation ADD_REVIEW(
    $productId: ID!
    $content: String!
    $rating: Int!
    $userId: ID!
  ) {
    addReview(
      productId: $productId
      content: $content
      rating: $rating
      userId: $userId
    ) {
      id
      content
      rating
      createdAt
      user
    }
  }
`;

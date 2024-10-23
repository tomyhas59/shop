import { gql } from "graphql-tag";
import { User } from "./signUp";

export type Review = {
  addReview: Review;
  id: string;
  content: string;
  rating: number;
  uid: string;
  createdAt: string;
  user: User;
};

export const GET_REVIEWS = gql`
  query GET_REVIEWS($productId: ID!) {
    reviews(productId: $productId) {
      id
      content
      rating
      createdAt
      user {
        uid
        email
        nickname
      }
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
      user {
        uid
        email
        nickname
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DELETE_REVIEW($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`;

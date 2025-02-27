import React from "react";
import { GET_REVIEWS, Review } from "@/graphql/review"; // DELETE_REVIEW 임포트
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect } from "react";
import { useQuery } from "react-query";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";

const ReviewList = ({ productId }: { productId: string }) => {
  const {
    data: reviewsData,
    refetch: refetchReviews,
    error,
  } = useQuery<{
    reviews: Review[];
  }>([QueryKeys.REVIEWS, productId], () =>
    graphqlFetcher<{ reviews: Review[] }>(GET_REVIEWS, { productId })
  );

  useEffect(() => {
    refetchReviews();
  }, [refetchReviews]);

  return (
    <div className="review-list-container">
      <h2 className="review-title">
        리뷰 <span className="review-count">{reviewsData?.reviews.length}</span>
      </h2>
      <ReviewItem reviews={reviewsData?.reviews} />
      <ReviewForm productId={productId} />
    </div>
  );
};

export default ReviewList;

import React from "react";
import { GET_REVIEWS, Review } from "@/graphql/review";
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
    graphqlFetcher<{ reviews: Review[] }>(GET_REVIEWS, { productId }),
  );

  useEffect(() => {
    refetchReviews();
  }, [refetchReviews]);

  const reviewCount = reviewsData?.reviews.length || 0;

  return (
    <div className="review-section">
      <div className="review-section-container">
        <div className="review-section-header">
          <h2 className="review-section-title">
            <i className="fas fa-comments"></i>
            <span>상품 리뷰</span>
          </h2>
          <div className="review-section-count">
            <i className="fas fa-star"></i>
            <span>{reviewCount}개의 리뷰</span>
          </div>
        </div>

        <ReviewForm productId={productId} />

        {reviewCount > 0 ? (
          <div className="review-list">
            <ReviewItem reviews={reviewsData?.reviews} />
          </div>
        ) : (
          <div className="review-empty">
            <i className="fas fa-comment-slash"></i>
            <h3>아직 리뷰가 없습니다</h3>
            <p>첫 번째 리뷰를 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;

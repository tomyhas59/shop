import React from "react";
import { GET_REVIEWS, Review } from "@/graphql/review"; // DELETE_REVIEW 임포트
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { reviewsState } from "@/recolis/review";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";

const ReviewList = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useRecoilState<Review[]>(reviewsState);

  const {
    data: reviewsData,
    refetch: refetchReviews,
    error,
  } = useQuery<{
    reviews: Review[];
  }>(
    [QueryKeys.PRODUCT, productId],
    () => graphqlFetcher<{ reviews: Review[] }>(GET_REVIEWS, { productId }),
    {
      onSuccess: (data) => {
        setReviews(data.reviews);
      },
    }
  );

  console.log(reviews);
  useEffect(() => {
    if (reviews) {
      console.log("받은 리뷰 데이터:", reviews);
    }
    if (error) {
      console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
    }
  }, [error, reviews]);

  useEffect(() => {
    refetchReviews();
  }, [refetchReviews]);

  return (
    <div className="review-list-container">
      <h2>
        리뷰 <span>{reviews.length}</span>
      </h2>
      <ReviewItem reviews={reviews} refetchReviews={refetchReviews} />
      <ReviewForm productId={productId} refetchReviews={refetchReviews} />
    </div>
  );
};

export default ReviewList;

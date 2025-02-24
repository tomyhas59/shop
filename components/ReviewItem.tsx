import { DELETE_REVIEW, Review } from "@/graphql/review";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@/context/UserProvider";
import { QueryObserverResult, useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";

type ReviewItemProps = {
  reviews?: Review[];
  refetchReviews: () => Promise<
    QueryObserverResult<{ reviews: Review[] }, unknown>
  >;
};

const ReviewItem: React.FC<ReviewItemProps> = ({ reviews, refetchReviews }) => {
  const { user } = useUser();
  const uid = user?.uid;

  const formatDate = (date: {
    getFullYear: () => any;
    getMonth: () => number;
    getDate: () => any;
  }) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { mutate: deleteReview } = useMutation(
    (reviewId: string) => graphqlFetcher(DELETE_REVIEW, { reviewId }),
    {
      onSuccess: () => {
        // 삭제 후 리뷰를 다시 가져오거나 로컬 상태에서 삭제
        refetchReviews();
      },
      onError: (error) => {
        console.error("리뷰 삭제 중 오류 발생:", error);
        alert("리뷰 삭제에 실패했습니다.");
      },
    }
  );

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId);
  };

  return (
    <div className="reviews">
      {reviews?.map((review, i) => (
        <div key={i} className="review-item">
          <div className="review-header">
            <div className="nickname-wrapper">
              <p className="nickname">{review.user?.nickname}</p>
              {review.rating > 0 &&
                Array.from({ length: review.rating }).map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    style={{ color: "gold", marginLeft: "-5px" }}
                  />
                ))}
              <p className="date">
                {formatDate(new Date(Number(review.createdAt)))}
              </p>
            </div>
            {(uid === review.user.uid || user?.displayName === "admin") && (
              <button
                className="review-delete-button"
                onClick={() => handleDeleteReview(review.id)}
              >
                삭제
              </button>
            )}
          </div>
          <p className="review-content">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewItem;

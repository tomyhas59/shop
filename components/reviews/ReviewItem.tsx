import { DELETE_REVIEW, Review } from "@/graphql/review";
import React from "react";
import { useUser } from "@/context/UserProvider";
import { useMutation } from "react-query";
import { getClient, graphqlFetcher, QueryKeys } from "@/queryClient";

type ReviewItemProps = {
  reviews?: Review[];
};

const ReviewItem: React.FC<ReviewItemProps> = ({ reviews }) => {
  const { user } = useUser();
  const uid = user?.uid;
  const queryClient = getClient();

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { mutate: deleteReview } = useMutation(
    (reviewId: string) => graphqlFetcher(DELETE_REVIEW, { reviewId }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries([QueryKeys.PRODUCTS, "products"], {
          exact: true,
        });
        queryClient.invalidateQueries(QueryKeys.REVIEWS);
      },
      onError: (error) => {
        console.error("리뷰 삭제 중 오류 발생:", error);
        alert("리뷰 삭제에 실패했습니다.");
      },
    },
  );

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteReview(reviewId);
    }
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <>
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-card-header">
            <div className="review-card-user">
              <div className="review-card-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="review-card-user-info">
                <div className="review-card-nickname">
                  {review.user?.nickname}
                </div>
                <div className="review-card-date">
                  {formatDate(new Date(Number(review.createdAt)))}
                </div>
              </div>
            </div>

            {(uid === review.user.uid || user?.displayName === "admin") && (
              <button
                className="review-card-delete"
                onClick={() => handleDeleteReview(review.id)}
              >
                <i className="fas fa-trash-alt"></i>
                <span>삭제</span>
              </button>
            )}
          </div>

          <div className="review-card-rating">
            {Array.from({ length: 5 }).map((_, index) => (
              <i
                key={index}
                className={`fas fa-star ${
                  index < review.rating ? "active" : ""
                }`}
              ></i>
            ))}
            <span className="review-card-rating-text">{review.rating}.0</span>
          </div>

          <div className="review-card-content">{review.content}</div>
        </div>
      ))}
    </>
  );
};

export default ReviewItem;

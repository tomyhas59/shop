import { DELETE_REVIEW, Review } from "@/graphql/review";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
      onSuccess: async () => {
        await queryClient.refetchQueries([QueryKeys.PRODUCTS, "products"], {
          exact: true,
        });
        queryClient.invalidateQueries(QueryKeys.REVIEWS); //data refresh로 ui update
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
              <div className="review-stars">
                {review.rating > 0 &&
                  Array.from({ length: review.rating }).map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className="review-star-icon"
                    />
                  ))}
              </div>
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

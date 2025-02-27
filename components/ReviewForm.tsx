import { useUser } from "@/context/UserProvider";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";
import { useMutation } from "react-query";
import { ADD_REVIEW, Review } from "@/graphql/review";
import { getClient, graphqlFetcher, QueryKeys } from "@/queryClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

type ReviewFormProps = {
  productId: string;
};

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { user } = useUser();
  const uid = user?.uid;
  const setLoading = useSetRecoilState(loadingState);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const queryClient = getClient();
  const handleRating = (rating: number) => {
    setReviewRating(rating);
  };

  const { mutate: addReview } = useMutation<
    Review,
    unknown,
    { productId: string; content: string; rating: number; uid: string }
  >(
    ({ productId, content, rating, uid }) =>
      graphqlFetcher(ADD_REVIEW, { productId, content, rating, uid }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.REVIEWS);
      },
    }
  );

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!uid) {
      alert("로그인이 필요합니다");
      return setLoading(false);
    }
    if (!reviewContent) {
      alert("리뷰를 작성하세요.");
      return setLoading(false);
    }

    try {
      addReview({
        productId,
        content: reviewContent,
        rating: reviewRating,
        uid,
      });

      setReviewContent("");
      setReviewRating(0);
    } catch (error) {
      console.error("리뷰 제출 중 오류 발생:", error);
      alert("리뷰 제출에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const reviewPlaceholder = user
    ? "리뷰 내용을 입력해주세요."
    : "로그인 후 입력 가능합니다.";

  return (
    <form onSubmit={handleReviewSubmit} className="review-form">
      <h2>리뷰 작성</h2>
      <textarea
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
        placeholder={reviewPlaceholder}
        required
        className="review-textarea"
        disabled={!user}
      />
      <div className="rating-wrapper">
        {[1, 2, 3, 4, 5].map((rating) => (
          <FontAwesomeIcon
            key={rating}
            icon={faStar}
            onClick={() => handleRating(rating)}
            className={`star-icon ${reviewRating >= rating ? "selected" : ""}`}
          />
        ))}
      </div>
      <button type="submit" className="review-submit-button">
        리뷰 추가
      </button>
    </form>
  );
};

export default ReviewForm;

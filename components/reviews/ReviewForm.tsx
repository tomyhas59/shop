import { useUser } from "@/context/UserProvider";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";
import { useMutation } from "react-query";
import { ADD_REVIEW, Review } from "@/graphql/review";
import { getClient, graphqlFetcher, QueryKeys } from "@/queryClient";

type ReviewFormProps = {
  productId: string;
};

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { user } = useUser();
  const uid = user?.uid;
  const setLoading = useSetRecoilState(loadingState);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
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
      onSuccess: async () => {
        await queryClient.refetchQueries([QueryKeys.PRODUCTS, "products"], {
          exact: true,
        });
        await queryClient.invalidateQueries(QueryKeys.REVIEWS);
        alert("리뷰가 등록되었습니다!");
      },
    },
  );

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!uid) {
      alert("로그인이 필요합니다");
      return setLoading(false);
    }

    if (reviewRating === 0) {
      alert("별점을 선택해주세요.");
      return setLoading(false);
    }

    if (!reviewContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
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
    ? "상품에 대한 솔직한 리뷰를 작성해주세요."
    : "로그인 후 리뷰를 작성할 수 있습니다.";

  return (
    <form onSubmit={handleReviewSubmit} className="review-form">
      <div className="review-form-header">
        <h3 className="review-form-title">
          <i className="fas fa-pen"></i>
          <span>리뷰 작성하기</span>
        </h3>
      </div>

      <div className="review-form-rating">
        <label className="review-form-label">별점을 선택해주세요</label>
        <div className="review-form-stars">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`review-form-star ${
                (hoveredRating || reviewRating) >= rating ? "active" : ""
              }`}
              onClick={() => handleRating(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              disabled={!user}
            >
              <i className="fas fa-star"></i>
            </button>
          ))}
          {reviewRating > 0 && (
            <span className="review-form-rating-text">{reviewRating}.0</span>
          )}
        </div>
      </div>

      <div className="review-form-content">
        <label className="review-form-label">리뷰 내용</label>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder={reviewPlaceholder}
          required
          className="review-form-textarea"
          disabled={!user}
          rows={4}
        />
        <div className="review-form-counter">
          {reviewContent.length} / 500자
        </div>
      </div>

      <button type="submit" className="review-form-submit" disabled={!user}>
        <i className="fas fa-paper-plane"></i>
        <span>리뷰 등록</span>
      </button>

      {!user && (
        <div className="review-form-login-notice">
          <i className="fas fa-info-circle"></i>
          <span>리뷰를 작성하려면 로그인이 필요합니다</span>
        </div>
      )}
    </form>
  );
};

export default ReviewForm;

import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import {
  ADD_REVIEW,
  GET_REVIEWS,
  Review,
  DELETE_REVIEW,
} from "@/graphql/review"; // DELETE_REVIEW 임포트
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { reviewsState } from "@/recolis/review";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ProductDetail = ({
  description,
  imageUrl,
  price,
  title,
  id,
}: Product) => {
  const { user } = useUser();
  const uid = user?.uid;

  const { mutate: addCart } = useMutation(
    ({ uid, id }: { uid: string; id: string }) =>
      graphqlFetcher(ADD_CART, { uid, id })
  );

  const { data, refetch } = useQuery<{ cart: Cart[] }>(
    [QueryKeys.CART, uid],
    () => {
      if (uid) return graphqlFetcher<{ cart: Cart[] }>(GET_CART, { uid });
      else {
        return Promise.resolve({ cart: [] });
      }
    },
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);
  const [addedCart, setAddedCart] = useState(isAddedToCart);

  const handleAddToCart = () => {
    if (uid) {
      addCart({ uid, id });
      setAddedCart(true);
    } else alert("로그인이 필요합니다");
  };

  useEffect(() => {
    setAddedCart(isAddedToCart);
  }, [data, isAddedToCart]);

  const formattedPrice = formatPrice(price);

  // 리뷰 관련
  const [reviews, setReviews] = useRecoilState<Review[]>(reviewsState);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");

  const handleRating = (rating: number) => {
    setReviewRating(rating);
  };

  const {
    data: reviewsData,
    refetch: refetchReviews,
    error,
  } = useQuery<{
    reviews: Review[];
  }>(
    [QueryKeys.PRODUCT, id],
    () => graphqlFetcher<{ reviews: Review[] }>(GET_REVIEWS, { productId: id }),
    {
      onSuccess: (data) => {
        setReviews(data.reviews);
      },
    }
  );

  useEffect(() => {
    if (reviews) {
      console.log("받은 리뷰 데이터:", reviews);
    }
    if (error) {
      console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
    }
  }, [error, reviews]);

  const { mutate: addReview } = useMutation<
    Review,
    unknown,
    { productId: string; content: string; rating: number; uid: string }
  >(
    ({ productId, content, rating, uid }) =>
      graphqlFetcher(ADD_REVIEW, { productId, content, rating, uid }),
    {
      onSuccess: (data) => {
        const newReview = data.addReview || data;
        console.log(newReview.content);
        setReviews((prevReviews) => [newReview, ...prevReviews]);
      },
    }
  );

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) {
      alert("로그인이 필요합니다");
      return;
    }
    if (!reviewContent) {
      alert("리뷰를 작성하세요.");
      return;
    }

    try {
      addReview({
        productId: id,
        content: reviewContent,
        rating: reviewRating,
        uid,
      });

      setReviewContent("");
      setReviewRating(0);
      refetchReviews();
    } catch (error) {
      console.error("리뷰 제출 중 오류 발생:", error);
      alert("리뷰 제출에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    refetch();
    refetchReviews();
  }, [refetch, refetchReviews]);

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

  console.log(reviews);
  return (
    <div>
      <div className="product-detail">
        <p className="title">{title}</p>
        <img className="image" src={imageUrl} alt={title} />
        <p className="description">{description}</p>
        <span className="price">{formattedPrice}원</span>
        <button className="add-cart" onClick={handleAddToCart}>
          {addedCart ? "담기 완료" : "담기"}
        </button>
      </div>
      <div className="reviews">
        <h2>
          리뷰 <span>{reviews.length}</span>
        </h2>
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
      <form onSubmit={handleReviewSubmit} className="review-form">
        <h2>리뷰 작성</h2>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="리뷰 내용을 입력하세요."
          required
        />
        <div className="rating-wrapper">
          {[1, 2, 3, 4, 5].map((rating) => (
            <FontAwesomeIcon
              key={rating}
              icon={faStar}
              onClick={() => handleRating(rating)}
              style={{
                cursor: "pointer",
                color: reviewRating >= rating ? "gold" : "gray",
                fontSize: "24px",
              }}
            />
          ))}
          <button type="submit">리뷰 추가</button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;

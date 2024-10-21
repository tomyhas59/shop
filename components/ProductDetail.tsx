import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { ADD_REVIEW, GET_REVIEWS, Review } from "@/graphql/review";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const ProductDetail = ({
  createdAt,
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

  const formatedPrice = formatPrice(price);

  // 리뷰 관련
  const {
    data: reviewsData,
    refetch: refetchReviews,
    error,
  } = useQuery<{
    reviews: Review[];
  }>([QueryKeys.REVIEWS, id, uid], () =>
    graphqlFetcher<{ reviews: Review[] }>(GET_REVIEWS, {
      productId: id,
      userId: uid,
    })
  );

  useEffect(() => {
    if (reviewsData) {
      console.log("받은 리뷰 데이터:", reviewsData.reviews);
    }
    if (error) {
      console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
    }
  }, [error, reviewsData]);

  const { mutate: addReview } = useMutation(
    ({
      productId,
      content,
      rating,
      uid,
    }: {
      productId: string;
      content: string;
      rating: number;
      uid: string;
    }) => graphqlFetcher(ADD_REVIEW, { productId, content, rating, uid })
  );

  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) {
      alert("로그인이 필요합니다");
      return;
    }
    if (!reviewContent || !reviewRating) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    try {
      addReview({
        productId: id,
        content: reviewContent,
        rating: reviewRating,
        uid: uid,
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
  }, [refetch]);

  return (
    <div>
      <div className="product-detail">
        <p className="title">{title}</p>
        <img className="image" src={imageUrl} alt={title} />

        <p className="description">{description}</p>
        <span className="price">{formatedPrice}원</span>
        <button className="add-cart" onClick={handleAddToCart}>
          {addedCart ? "담기 완료" : "담기"}
        </button>
      </div>
      <div className="reviews">
        <h2>리뷰 목록</h2>
        {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
          reviewsData.reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p>{review.content}</p>
              <p>평점: {review.rating}</p>
              <p>작성일: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
      </div>

      <form onSubmit={handleReviewSubmit} className="review-form">
        <h2>리뷰 작성</h2>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="리뷰 내용을 입력하세요."
          required
        />
        <select
          value={reviewRating}
          onChange={(e) => setReviewRating(Number(e.target.value))}
          required
        >
          <option value={0} disabled>
            평점을 선택하세요.
          </option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
        <button type="submit">리뷰 추가</button>
      </form>
    </div>
  );
};

export default ProductDetail;

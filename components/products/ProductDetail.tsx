import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, DELETE_CART, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ReviewList from "../reviews/ReviewList";

const ProductDetail = ({
  description,
  imageUrl,
  price,
  title,
  id,
}: Product) => {
  const { user } = useUser();
  const uid = user?.uid;
  const queryClient = useQueryClient();

  const { data } = useQuery<{ cart: Cart[] }>(
    [QueryKeys.CART, uid],
    () => graphqlFetcher(GET_CART, { uid }),
    {
      enabled: !!uid, // 🔥 로그인 시에만 실행
    },
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);

  const addCart = useMutation(() => graphqlFetcher(ADD_CART, { uid, id }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.CART, uid]);
    },
  });

  const deleteCart = useMutation(
    (cartId: string) => graphqlFetcher(DELETE_CART, { id: cartId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.CART, uid]);
      },
    },
  );

  const handleCart = () => {
    if (!uid) return alert("로그인이 필요합니다");

    if (!isAddedToCart) {
      addCart.mutate();
    } else {
      const cartItem = data?.cart.find((item) => item.product.id === id);
      if (cartItem) {
        deleteCart.mutate(cartItem.id);
      }
    }
  };

  const formattedPrice = formatPrice(price);

  return (
    <>
      <div className="product-detail-container">
        <div className="product-detail-card">
          <div className="product-detail-image-wrapper">
            <div className="product-detail-image-container">
              <img
                className="product-detail-image"
                src={imageUrl}
                alt={title}
              />
            </div>
          </div>

          <div className="product-detail-info">
            <div className="product-detail-header">
              <div className="product-detail-badge">
                <i className="fas fa-star"></i>
                <span>인기상품</span>
              </div>
              <h1 className="product-detail-title">{title}</h1>
              <p className="product-detail-description">{description}</p>
            </div>

            <div className="product-detail-price-section">
              <div className="product-detail-price-label">판매가</div>
              <div className="product-detail-price">{formattedPrice}원</div>
            </div>

            <div className="product-detail-actions">
              <button
                className={`product-detail-cart-btn ${isAddedToCart ? "added" : ""}`}
                onClick={handleCart}
              >
                <i
                  className={`fas fa-${isAddedToCart ? "check" : "shopping-cart"}`}
                ></i>
                <span>
                  {isAddedToCart ? "장바구니에 담김" : "장바구니에 담기"}
                </span>
              </button>
            </div>

            <div className="product-detail-info-list">
              <div className="product-detail-info-item">
                <i className="fas fa-shipping-fast"></i>
                <div>
                  <strong>배송 정보</strong>
                  <span>무료배송 (5만원 이상)</span>
                </div>
              </div>
              <div className="product-detail-info-item">
                <i className="fas fa-undo-alt"></i>
                <div>
                  <strong>반품/교환</strong>
                  <span>30일 이내 무료 반품</span>
                </div>
              </div>
              <div className="product-detail-info-item">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <strong>안전 결제</strong>
                  <span>SSL 보안 결제 시스템</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewList productId={id} />
    </>
  );
};

export default ProductDetail;

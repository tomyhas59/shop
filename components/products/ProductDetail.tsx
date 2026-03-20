import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, DELETE_CART, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
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

  const { mutate: addCart } = useMutation(
    ({ uid, id }: { uid: string; id: string }) =>
      graphqlFetcher(ADD_CART, { uid, id }),
  );

  const { mutate: deleteCart } = useMutation((id: string) =>
    graphqlFetcher(DELETE_CART, { id }),
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
    },
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);
  const [addedCart, setAddedCart] = useState(isAddedToCart);

  const findCartIdByProductId = (productId: string) => {
    const cartItem = data?.cart.find((item) => item.product.id === productId);
    return cartItem?.id;
  };

  const handleCartData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) return alert("로그인이 필요합니다");
    if (uid) {
      if (!addedCart) {
        addCart({ uid, id });
        setAddedCart(true);
      } else {
        const cartId = findCartIdByProductId(id);
        if (cartId) {
          deleteCart(cartId);
        }
      }
      setAddedCart(!addedCart);
    }
  };

  useEffect(() => {
    setAddedCart(isAddedToCart);
  }, [data, isAddedToCart]);

  const formattedPrice = formatPrice(price);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
                className={`product-detail-cart-btn ${addedCart ? "added" : ""}`}
                onClick={handleCartData}
              >
                <i
                  className={`fas fa-${addedCart ? "check" : "shopping-cart"}`}
                ></i>
                <span>{addedCart ? "장바구니에 담김" : "장바구니에 담기"}</span>
              </button>

              <button className="product-detail-buy-btn">
                <i className="fas fa-bolt"></i>
                <span>바로 구매하기</span>
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

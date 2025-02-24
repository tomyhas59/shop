import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import ReviewList from "./ReviewList";

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

  useEffect(() => {
    refetch();
  }, [refetch]);

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
      <ReviewList productId={id} />
    </div>
  );
};

export default ProductDetail;

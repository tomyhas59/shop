import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const ProductItem = ({ imageUrl, price, title, id }: Product) => {
  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { id })
  );

  const formatedPrice = formatPrice(price);

  const { data } = useQuery<{ cart: Cart[] }>(
    "cart",
    () => graphqlFetcher<{ cart: Cart[] }>(GET_CART),
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const [isAddedToCart, setIsAddedToCart] = useState(cartIds.includes(id));

  const handleAddToCart = () => {
    if (!isAddedToCart) {
      addCart(id);
      setIsAddedToCart(true);
    }
  };

  useEffect(() => {
    if (cartIds.includes(id)) {
      setIsAddedToCart(true);
    }
  }, [cartIds, id]);

  return (
    <li className="productItem">
      <img className="image" src={imageUrl} alt={title} />
      <p className="title">{title}</p>
      <Link className="link" href={`/products/${id}`}>
        상세 보기
      </Link>
      <span className="price">{formatedPrice}원</span>
      <button
        className="addCart"
        onClick={handleAddToCart}
        disabled={isAddedToCart}
      >
        {isAddedToCart ? "담기 완료" : "담기"}
      </button>
    </li>
  );
};

export default ProductItem;

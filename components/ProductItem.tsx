import { useUser } from "@/context/UserProvider";
import auth from "@/firebaseConfig";
import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { User, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { SyntheticEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const ProductItem = ({ imageUrl, price, title, id }: Product) => {
  const { user } = useUser();
  const uid = user?.uid;

  const { mutate: addCart } = useMutation(
    ({ uid, id }: { uid: string; id: string }) =>
      graphqlFetcher(ADD_CART, { uid, id })
  );

  const formatedPrice = formatPrice(price);

  const { data } = useQuery<{ cart: Cart[] }>(
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
  const [isAddedToCart, setIsAddedToCart] = useState(cartIds.includes(id));

  const handleAddToCart = () => {
    if (!isAddedToCart) {
      if (uid) {
        addCart({ uid, id });
        setIsAddedToCart(true);
      }
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

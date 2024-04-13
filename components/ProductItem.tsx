/* eslint-disable @next/next/no-img-element */
import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";

const ProductItem = ({ imageUrl, price, title, id }: Product) => {
  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { id })
  );

  const formatedPrice = formatPrice(price);

  const { data, refetch } = useQuery<{ cart: Cart[] }>(
    "cart",
    () => graphqlFetcher<{ cart: Cart[] }>(GET_CART),
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];

  const handleAddToCart = async () => {
    addCart(id);
    refetch();
  };

  return (
    <li className="productItem">
      <img className="image" src={imageUrl} alt={title} />
      <p className="title">{title}</p>
      <Link className="link" href={`/products/${id}`}>
        상세 보기
      </Link>
      <span className="price">{formatedPrice}원</span>
      <button className="addCart" onClick={handleAddToCart}>
        {!cartIds?.includes(id) ? "담기" : "담기 완료"}
      </button>
    </li>
  );
};

export default ProductItem;

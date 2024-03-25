/* eslint-disable @next/next/no-img-element */
import { ADD_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { graphqlFetcher } from "@/queryClient";
import { useMutation } from "react-query";

const ProductDetail = ({
  createAt,
  description,
  imageUrl,
  price,
  title,
  id,
}: Product) => {
  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { id })
  );

  const formatedPrice = formatPrice(price);

  return (
    <div className="productDetailWrapper">
      <div className="productDetail">
        <p className="createAt">{createAt}</p>
        <p className="title">{title}</p>
        <img className="image" src={imageUrl} alt={title} />
        <p className="description">{description}</p>
        <span className="price">{formatedPrice}원</span>
        <button className="addCart" onClick={() => addCart(id)}>
          담기
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

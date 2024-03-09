import { ADD_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { graphqlFetcher } from "@/queryClient";
import Link from "next/link";
import { useMutation } from "react-query";

const ProductItem = ({
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
  return (
    <li className="product-item">
      <p className="createAt">{createAt}</p>
      <p className="title">{title}</p>
      <Link className="link" href={`/products/${id}`}>
        상세 보기
      </Link>
      <img className="image" src={imageUrl} alt={title} />
      <span className="price">{price}달러</span>
      <button className="addCart" onClick={() => addCart(id)}>
        담기
      </button>
    </li>
  );
};

export default ProductItem;

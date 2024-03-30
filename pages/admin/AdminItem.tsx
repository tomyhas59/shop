/* eslint-disable @next/next/no-img-element */
import { ADD_CART } from "@/graphql/cart";
import { DELETE_PRODUCT, Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import Link from "next/link";
import { useMutation } from "react-query";

const AdminItem = ({ imageUrl, price, title, id, createdAt }: Product) => {
  const queryClient = getClient();

  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { id })
  );

  const formatedPrice = formatPrice(price);

  const { mutate: deleteProduct } = useMutation(
    (id: string) => graphqlFetcher(DELETE_PRODUCT, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });
      },
    }
  );

  const handleDeleteProduct = () => {
    deleteProduct(id);
  };

  return (
    <li className="productItem">
      <button className="deleteButton" onClick={handleDeleteProduct}>
        삭제
      </button>
      <img className="image" src={imageUrl} alt={title} />
      <p className="title">{title}</p>
      <Link className="link" href={`/products/${id}`}>
        상세 보기
      </Link>
      <span className="price">{formatedPrice}원</span>
      <button className="addCart" onClick={() => addCart(id)}>
        담기
      </button>
      {!createdAt && <span>삭제된 상품</span>}
    </li>
  );
};

export default AdminItem;

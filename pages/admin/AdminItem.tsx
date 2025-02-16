import { ADD_CART } from "@/graphql/cart";
import {
  DELETE_PRODUCT,
  MutableProduct,
  Product,
  UPDATE_PRODUCT,
} from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import arrToObj from "@/util/arrToObj";
import Link from "next/link";
import { SyntheticEvent } from "react";
import { useMutation } from "react-query";

const AdminItem = ({
  imageUrl,
  price,
  title,
  id,
  createdAt,
  isEditing,
  description,
  doneEdit,
  startEdit,
}: Product & {
  isEditing: Boolean;
  startEdit: () => void;
  doneEdit: () => void;
}) => {
  const queryClient = getClient();
  //장바구니 담기----------------------------------------
  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { id })
  );

  const formattedPrice = formatPrice(price);

  //상품 삭제-------------------------------------------
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
  //상품 수정-------------------------------------------

  const { mutate: updateProduct } = useMutation(
    ({ title, imageUrl, description, price }: MutableProduct) =>
      graphqlFetcher<any>(UPDATE_PRODUCT, {
        id,
        title,
        imageUrl,
        description,
        price,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });
        doneEdit();
      },
    }
  );

  const handleUpdateProduct = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    updateProduct(formData as MutableProduct);
  };
  if (isEditing)
    return (
      <form onSubmit={handleUpdateProduct}>
        <label>
          상품명:
          <input
            className="input-field"
            name="title"
            placeholder="title"
            type="text"
            required
            defaultValue={title}
          />
        </label>
        <label>
          이미지URL:
          <input
            className="input-field"
            name="imageUrl"
            type="text"
            required
            defaultValue={imageUrl}
          />
        </label>
        <label>
          가격:
          <input
            className="input-field"
            placeholder="Price"
            name="price"
            required
            type="number"
            min="1000"
            defaultValue={price}
          />
        </label>
        <label>
          상세:
          <textarea
            className="textarea-field"
            name="description"
            placeholder="Description"
            defaultValue={description}
          />
        </label>
        <button type="submit" className="submit-button">
          저장
        </button>
        <button
          type="button"
          className="submit-button"
          onClick={() => doneEdit()}
        >
          취소
        </button>
      </form>
    );

  return (
    <li className="product-item">
      <button className="delete-button" onClick={handleDeleteProduct}>
        삭제
      </button>
      <button className="update-button" onClick={startEdit}>
        수정
      </button>
      <img className="image" src={imageUrl} alt={title} />
      <p className="title">{title}</p>
      <Link className="link" href={`/products/${id}`}>
        상세 보기
      </Link>
      <span className="price">{formattedPrice}원</span>
      {!createdAt && <div className="xMark">삭제된 상품</div>}
    </li>
  );
};

export default AdminItem;

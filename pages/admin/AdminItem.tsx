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
    graphqlFetcher(ADD_CART, { id }),
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
    },
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
    },
  );

  const handleUpdateProduct = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    updateProduct(formData as MutableProduct);
  };
  if (isEditing)
    return (
      <li className="product-item editing">
        <form onSubmit={handleUpdateProduct} className="admin-edit-form">
          <div className="edit-form-content">
            <input
              name="title"
              defaultValue={title}
              required
              placeholder="상품명"
            />
            <input
              name="imageUrl"
              defaultValue={imageUrl}
              required
              placeholder="이미지 URL"
            />
            <input name="price" type="number" defaultValue={price} required />
            <textarea
              name="description"
              defaultValue={description}
              placeholder="상세 설명"
            />
          </div>
          <div className="edit-actions">
            <button type="submit" className="save-btn">
              저장
            </button>
            <button type="button" className="cancel-btn" onClick={doneEdit}>
              취소
            </button>
          </div>
        </form>
      </li>
    );

  return (
    <li className="product-item admin">
      <div className="product-item__image-wrapper">
        <img className="product-item__image" src={imageUrl} alt={title} />
        {createdAt ? (
          <div className="admin-item-overlay">
            <button
              className="admin-action-btn edit"
              onClick={startEdit}
              title="수정"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="admin-action-btn delete"
              onClick={handleDeleteProduct}
              title="삭제"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ) : (
          <div className="deleted-status-overlay">
            <span>삭제된 상품</span>
          </div>
        )}
      </div>

      <div className="product-item__content">
        <h3 className="product-item__title">{title}</h3>
        <div className="product-item__footer">
          <span className="product-item__price">{formattedPrice}원</span>
          <div className="admin-status-badge">
            {createdAt ? "판매중" : "판매중지"}
          </div>
        </div>
      </div>
    </li>
  );
};

export default AdminItem;

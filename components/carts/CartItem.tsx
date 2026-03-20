import { Cart, DELETE_CART, UPDATE_CART } from "@/graphql/cart";
import { formatPrice } from "@/pages/products";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { checkedCartState } from "@/recolis/cart";
import { ForwardedRef, forwardRef, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilState } from "recoil";

const CartItem = (
  {
    id,
    product: { title, imageUrl, price, createdAt },
    amount,
    onCheckboxChange,
    isChecked,
    setIsChecked,
  }: Cart & {
    onCheckboxChange: (itemId: string, isChecked: boolean) => void;
    isChecked: boolean;
    setIsChecked: (checked: boolean) => void;
  },
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const queryClient = getClient();
  const [quantity, setQuantity] = useState(amount);
  const [checkedItems, setCheckedItems] = useRecoilState(checkedCartState);

  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher<any>(UPDATE_CART, { id, amount }),
  );

  const { mutate: deleteCart } = useMutation(
    (id: string) => graphqlFetcher(DELETE_CART, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CART);
      },
    },
  );

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    updateCart({ id, amount: newQuantity });

    const updatedItems = checkedItems.map((item) =>
      item.id === id ? { ...item, amount: newQuantity } : item,
    );
    setCheckedItems(updatedItems);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 99) {
      updateQuantity(value);
    }
  };

  const handleIncrement = () => {
    if (quantity < 99) {
      updateQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(quantity - 1);
    }
  };

  const handleDelete = () => {
    if (window.confirm("이 상품을 삭제하시겠습니까?")) {
      deleteCart(id);
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onCheckboxChange(id, checked);
  };

  const checkedItem = checkedItems.find((item) => item.id === id);
  const itemQuantity = checkedItem ? checkedItem.amount : quantity;
  const itemPrice = formatPrice(price);
  const totalPrice = formatPrice(price * itemQuantity);

  return (
    <li
      className={`cart-product ${!createdAt ? "cart-product--unavailable" : ""}`}
    >
      <div className="cart-product__select">
        <input
          type="checkbox"
          id={`cart-item-${id}`}
          className="cart-product__checkbox"
          name="selectItem"
          ref={ref}
          data-id={id}
          checked={isChecked} // ✅ 상위에서 내려온 체크 상태 동기화
          disabled={!createdAt}
          onChange={handleCheck}
        />
        <label
          htmlFor={`cart-item-${id}`}
          className="cart-product__check-label"
        >
          <i className="fas fa-check"></i>
        </label>
      </div>

      {/* 💡 수정된 부분: div를 label로 바꾸고 htmlFor 연결 */}
      <label
        htmlFor={`cart-item-${id}`}
        className="cart-product__image"
        style={{ cursor: createdAt ? "pointer" : "default", display: "block" }}
      >
        <img src={imageUrl} alt={title} />
        {!createdAt && (
          <div className="cart-product__unavailable-overlay">
            <i className="fas fa-exclamation-triangle"></i>
            <span>품절</span>
          </div>
        )}
      </label>

      <div className="cart-product__details">
        <h3 className="cart-product__name">{title}</h3>
        <div className="cart-product__price">
          <span className="cart-product__price-label">상품가격</span>
          <span className="cart-product__price-value">{itemPrice}원</span>
        </div>
      </div>

      <div className="cart-product__quantity">
        <button
          type="button"
          className="cart-product__qty-btn"
          onClick={handleDecrement}
          disabled={!createdAt || quantity <= 1}
          aria-label="수량 감소"
        >
          <i className="fas fa-minus"></i>
        </button>
        <input
          type="number"
          className="cart-product__qty-input"
          value={quantity}
          onChange={handleQuantityChange}
          min={1}
          max={99}
          disabled={!createdAt}
        />
        <button
          type="button"
          className="cart-product__qty-btn"
          onClick={handleIncrement}
          disabled={!createdAt || quantity >= 99}
          aria-label="수량 증가"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="cart-product__total">
        <span className="cart-product__total-label">합계</span>
        <span className="cart-product__total-value">{totalPrice}원</span>
      </div>

      <button
        type="button"
        className="cart-product__remove"
        onClick={handleDelete}
        aria-label="상품 삭제"
      >
        <i className="fas fa-times"></i>
      </button>
    </li>
  );
};

export default forwardRef(CartItem);

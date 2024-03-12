import { Cart } from "@/graphql/cart";
import CartItem from "./CartItem";
import { createRef, useRef, useState } from "react";
import { SyntheticEvent } from "react";

const CartList = ({ cartItems }: { cartItems: Cart[] }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = cartItems.map(() => createRef<HTMLInputElement>());

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;
    // const checkboxes =
    //   formRef.current.querySelectorAll<HTMLInputElement>(".cartItemCheckbox");
    const targetInput = e.target as HTMLInputElement;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("selectItem").length; //name="selectItem"

    if (targetInput.classList.contains("selectAll")) {
      const allChecked = targetInput.checked;
      checkboxRefs.forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
    } else {
      const allChecked = selectedCount === cartItems.length;
      formRef.current.querySelector<HTMLInputElement>(".selectAll")!.checked =
        allChecked;
    }
  };

  return (
    <form ref={formRef} onChange={handleCheckboxChanged}>
      {"폼이라서 전체 삭제 오류"}
      <label>
        <input type="checkbox" className="selectAll" />
        전체 선택
      </label>
      <div className="cartList">
        {cartItems.map((cartItem, i) => (
          <CartItem {...cartItem} key={cartItem.id} ref={checkboxRefs[i]} />
        ))}
      </div>
    </form>
  );
};

export default CartList;

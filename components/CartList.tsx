import { Cart, DELETE_ALL_CART } from "@/graphql/cart";
import CartItem from "./CartItem";
import {
  createRef,
  useRef,
  SyntheticEvent,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useRecoilState } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";

const CartList = ({
  cartItems,
  onCheckboxChange,
  setCartItems,
}: {
  cartItems: Cart[];
  onCheckboxChange: (itemId: string, isChecked: boolean) => void;
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
}) => {
  const [checkedItems, setCheckedCartData] = useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = cartItems.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const [itemCheckedStates, setItemCheckedStates] = useState<{
    [key: string]: boolean;
  }>(cartItems.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}));

  //개별 체크 올 체크 시------------------------------------------------
  const enabledItem = cartItems.filter((item) => item.product.createdAt);

  const setAllCheckedFromItems = useCallback(() => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("selectItem").length; //name="selectItem"
    const allItemsSelected = selectedCount === enabledItem.length;

    const selectAllCheckbox =
      document.querySelector<HTMLInputElement>(".select-all");

    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allItemsSelected;
    }
  }, [cartItems.length]);

  //올 체크 시-----------------------------------------------
  const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
    const allChecked = targetInput.checked;
    checkboxRefs
      .filter((inputElem) => {
        return !inputElem.current?.disabled;
      })
      .forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
    setItemCheckedStates((prevStates) =>
      Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = allChecked;
        return acc;
      }, {} as { [key: string]: boolean })
    );
  };

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;
    const targetInput = e.target as HTMLInputElement;

    if (targetInput && targetInput.classList.contains("select-all")) {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }

    const data = new FormData(formRef.current);
    setFormData(data);
  };

  //전체 카트 삭제
  const { mutate: deleteAllCart } = useMutation(() =>
    graphqlFetcher(DELETE_ALL_CART)
  );

  const handleDeleteAllItem = (e: SyntheticEvent) => {
    e.preventDefault();
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      deleteAllCart();
      setCartItems([]);
    }
  };

  //recoil checked 업데이트
  useEffect(() => {
    checkedItems.forEach((item) => {
      const itemRef = checkboxRefs.find(
        (ref) => ref.current!.dataset.id === item.id
      );
      if (itemRef) itemRef.current!.checked = true;
    });
    setAllCheckedFromItems();
  }, []);

  //recoil data 추가
  useEffect(() => {
    const checkedItems = checkboxRefs.reduce<Cart[]>((res, ref, i) => {
      if (ref.current!.checked) res.push(cartItems[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [cartItems, formData]);

  useEffect(() => {
    const selectAllCheckbox =
      document.querySelector<HTMLInputElement>(".select-all");

    if (selectAllCheckbox) {
      if (enabledItem.length === 0) {
        selectAllCheckbox.disabled = true;
      } else {
        selectAllCheckbox.disabled = false;
      }
    }
  }, [enabledItem]);

  return (
    <div className="cart-list-container">
      <form
        ref={formRef}
        onChange={handleCheckboxChanged}
        className="cart-list-form-container"
      >
        <div className="all-button">
          <label className="custom-select-all">
            <input
              id="select-all"
              type="checkbox"
              className="select-all"
              name="selectAll"
              style={{ display: "none" }}
            />
            전체 선택
            <label htmlFor="select-all"></label>
          </label>
          <button className="delete-all" onClick={handleDeleteAllItem}>
            전체 삭제
          </button>
        </div>
        <div className="cart-list">
          {cartItems.map((cartItem, i) => (
            <CartItem
              {...cartItem}
              key={cartItem.id}
              ref={checkboxRefs[i]}
              onCheckboxChange={onCheckboxChange}
              isChecked={itemCheckedStates[cartItem.id] || false}
              setIsChecked={(checked: boolean) =>
                setItemCheckedStates((prev) => ({
                  ...prev,
                  [cartItem.id]: checked,
                }))
              }
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default CartList;

import { Cart, DELETE_ALL_CART, DELETE_SELECTED_CART } from "@/graphql/cart";
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

  const enabledItem = cartItems.filter((item) => item.product.createdAt);

  const setAllCheckedFromItems = useCallback(() => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("selectItem").length;
    const allItemsSelected = selectedCount === enabledItem.length;

    const selectAllCheckbox = document.querySelector<HTMLInputElement>(
      ".cart-select-all-input",
    );

    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allItemsSelected;
    }
  }, [cartItems.length]);

  const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
    const allChecked = targetInput.checked;
    checkboxRefs
      .filter((inputElem) => !inputElem.current?.disabled)
      .forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
    setItemCheckedStates((prevStates) =>
      Object.keys(prevStates).reduce(
        (acc, key) => {
          acc[key] = allChecked;
          return acc;
        },
        {} as { [key: string]: boolean },
      ),
    );
  };

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;
    const targetInput = e.target as HTMLInputElement;

    if (targetInput?.classList.contains("cart-select-all-input")) {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }

    const data = new FormData(formRef.current);
    setFormData(data);
  };

  const { mutate: deleteAllCart } = useMutation(() =>
    graphqlFetcher(DELETE_ALL_CART),
  );

  const handleDeleteAllItem = (e: SyntheticEvent) => {
    e.preventDefault();
    if (window.confirm("장바구니를 모두 비우시겠습니까?")) {
      deleteAllCart();
      setCartItems([]);
    }
  };

  const { mutate: deleteSelectedCart } = useMutation((ids: string[]) =>
    graphqlFetcher(DELETE_SELECTED_CART, { ids }),
  );

  const handleDeleteSelectedItems = (e: SyntheticEvent) => {
    e.preventDefault();

    const selectedIds = Object.keys(itemCheckedStates).filter(
      (id) => itemCheckedStates[id],
    );

    if (selectedIds.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    if (
      window.confirm(`선택한 ${selectedIds.length}개 상품을 삭제하시겠습니까?`)
    ) {
      deleteSelectedCart(selectedIds);
      setCartItems((prevItems) =>
        prevItems.filter((item) => !selectedIds.includes(item.id)),
      );
    }
  };

  useEffect(() => {
    checkedItems.forEach((item) => {
      const itemRef = checkboxRefs.find(
        (ref) => ref.current?.dataset.id === item.id,
      );
      if (itemRef) itemRef.current!.checked = true;
    });
    setAllCheckedFromItems();
  }, []);

  useEffect(() => {
    const checkedItems = checkboxRefs.reduce<Cart[]>((res, ref, i) => {
      if (ref.current?.checked) res.push(cartItems[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [cartItems, formData]);

  useEffect(() => {
    const selectAllCheckbox = document.querySelector<HTMLInputElement>(
      ".cart-select-all-input",
    );

    if (selectAllCheckbox) {
      selectAllCheckbox.disabled = enabledItem.length === 0;
    }
  }, [enabledItem]);

  return (
    <div className="cart-list">
      <form
        ref={formRef}
        onChange={handleCheckboxChanged}
        className="cart-list__form"
      >
        <div className="cart-list__toolbar">
          <div className="cart-select-all">
            <input
              type="checkbox"
              id="cart-select-all"
              className="cart-select-all-input"
              name="selectAll"
            />
            <label htmlFor="cart-select-all" className="cart-select-all__label">
              <span className="cart-select-all__box">
                <i className="fas fa-check"></i>
              </span>
              <span className="cart-select-all__text">전체선택</span>
            </label>
          </div>

          <div className="cart-actions">
            <button
              type="button"
              className="cart-actions__button"
              onClick={handleDeleteSelectedItems}
            >
              <i className="fas fa-trash-alt"></i>
              <span>선택삭제</span>
            </button>
            <button
              type="button"
              className="cart-actions__button cart-actions__button--danger"
              onClick={handleDeleteAllItem}
            >
              <i className="fas fa-trash"></i>
              <span>전체삭제</span>
            </button>
          </div>
        </div>

        <ul className="cart-items">
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
        </ul>
      </form>
    </div>
  );
};

export default CartList;

import { Cart } from "@/graphql/cart";
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
import { checkedOrdersState } from "@/recolis/cart";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import OrdersItem from "./OrdersItem";
import { DELETE_ALL_ORDERS, DELETE_SELECTED_ORDERS } from "@/graphql/payment";

const OrdersList = ({
  ordersItems,
  onCheckboxChange,
  setOrdersItems,
}: {
  ordersItems: Cart[];
  onCheckboxChange: (itemId: string, isChecked: boolean) => void;
  setOrdersItems: Dispatch<SetStateAction<Cart[]>>;
}) => {
  const [checkedItems, setCheckedCartData] = useRecoilState(checkedOrdersState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = ordersItems.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const [itemCheckedStates, setItemCheckedStates] = useState<{
    [key: string]: boolean;
  }>(ordersItems.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}));

  const enabledItem = ordersItems.filter((item) => item.product.createdAt);

  const setAllCheckedFromItems = useCallback(() => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("selectItem").length;
    const allItemsSelected = selectedCount === enabledItem.length;

    const selectAllCheckbox = document.querySelector<HTMLInputElement>(
      ".orders-select-all-input",
    );

    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allItemsSelected;
    }
  }, [enabledItem.length]);

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

    if (targetInput?.classList.contains("orders-select-all-input")) {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }

    const data = new FormData(formRef.current);
    setFormData(data);
  };

  const { mutate: deleteAllOrders } = useMutation(() =>
    graphqlFetcher(DELETE_ALL_ORDERS),
  );

  const handleDeleteAllItem = (e: SyntheticEvent) => {
    e.preventDefault();
    if (window.confirm("모든 주문 내역을 삭제하시겠습니까?")) {
      deleteAllOrders();
      setOrdersItems([]);
    }
  };

  const { mutate: deleteSelectedOrders } = useMutation((ids: string[]) =>
    graphqlFetcher(DELETE_SELECTED_ORDERS, { ids }),
  );

  const handleDeleteSelectedItems = (e: SyntheticEvent) => {
    e.preventDefault();

    const selectedIds = Object.keys(itemCheckedStates).filter(
      (id) => itemCheckedStates[id],
    );

    if (selectedIds.length === 0) {
      alert("삭제할 주문을 선택해주세요.");
      return;
    }

    if (window.confirm(`선택한 ${selectedIds.length}건을 삭제하시겠습니까?`)) {
      deleteSelectedOrders(selectedIds);
      setOrdersItems((prevItems) =>
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
      if (ref.current?.checked) res.push(ordersItems[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [formData, ordersItems]);

  useEffect(() => {
    const selectAllCheckbox = document.querySelector<HTMLInputElement>(
      ".orders-select-all-input",
    );

    if (selectAllCheckbox) {
      selectAllCheckbox.disabled = enabledItem.length === 0;
    }
  }, [enabledItem]);

  return (
    <div className="orders-list">
      <form
        ref={formRef}
        onChange={handleCheckboxChanged}
        className="orders-list__form"
      >
        <div className="orders-list__toolbar">
          <div className="orders-select-all">
            <input
              type="checkbox"
              id="orders-select-all"
              className="orders-select-all-input"
              name="selectAll"
            />
            <label
              htmlFor="orders-select-all"
              className="orders-select-all__label"
            >
              <span className="orders-select-all__box">
                <i className="fas fa-check"></i>
              </span>
              <span className="orders-select-all__text">전체선택</span>
            </label>
          </div>

          <div className="orders-actions">
            <button
              type="button"
              className="orders-actions__button"
              onClick={handleDeleteSelectedItems}
            >
              <i className="fas fa-trash-alt"></i>
              <span>선택삭제</span>
            </button>
            <button
              type="button"
              className="orders-actions__button orders-actions__button--danger"
              onClick={handleDeleteAllItem}
            >
              <i className="fas fa-trash"></i>
              <span>전체삭제</span>
            </button>
          </div>
        </div>

        <ul className="orders-items">
          {ordersItems.map((ordersItem, i) => (
            <OrdersItem
              {...ordersItem}
              key={ordersItem.id}
              ref={checkboxRefs[i]}
              onCheckboxChange={onCheckboxChange}
              isChecked={itemCheckedStates[ordersItem.id] || false}
              setIsChecked={(checked: boolean) =>
                setItemCheckedStates((prev) => ({
                  ...prev,
                  [ordersItem.id]: checked,
                }))
              }
            />
          ))}
        </ul>
      </form>
    </div>
  );
};

export default OrdersList;

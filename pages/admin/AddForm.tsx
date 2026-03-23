import React, { SyntheticEvent, useRef } from "react";
import { useMutation } from "react-query";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { ADD_PRODUCT, MutableProduct, Product } from "@/graphql/products";
import arrToObj from "@/util/arrToObj";

const AddForm = () => {
  const queryClient = getClient();
  const titleRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: addProduct } = useMutation(
    ({
      title,
      imageUrl,
      description,
      price,
    }: Omit<Product, "id" | "createdAt">) =>
      graphqlFetcher<any>(ADD_PRODUCT, { title, imageUrl, description, price }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });
      },
    },
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    addProduct(formData as MutableProduct);
    console.log(formData);

    titleRef.current!.value = "";
    imageUrlRef.current!.value = "";
    priceRef.current!.value = "";
    descriptionRef.current!.value = "";
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h2>
          <i className="fas fa-plus-circle"></i> 새 상품 등록
        </h2>
        <p>판매할 새로운 상품의 정보를 입력해 주세요.</p>
      </div>
      <form onSubmit={handleSubmit} className="admin-product-form">
        <div className="form-group-grid">
          <div className="form-group">
            <label>
              <i className="fas fa-tag"></i> 상품명
            </label>
            <input
              ref={titleRef}
              name="title"
              placeholder="상품명을 입력하세요"
              type="text"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <i className="fas fa-link"></i> 이미지 URL
            </label>
            <input
              ref={imageUrlRef}
              name="imageUrl"
              type="text"
              required
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>
              <i className="fas fa-won-sign"></i> 가격
            </label>
            <input
              ref={priceRef}
              name="price"
              required
              type="number"
              min="1000"
              placeholder="1000원 이상"
            />
          </div>
        </div>
        <div className="form-group">
          <label>
            <i className="fas fa-align-left"></i> 상세 설명
          </label>
          <textarea
            ref={descriptionRef}
            name="description"
            placeholder="상품에 대한 설명을 적어주세요"
          />
        </div>
        <button type="submit" className="admin-submit-btn">
          <span>상품 등록하기</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </form>
    </div>
  );
};

export default AddForm;

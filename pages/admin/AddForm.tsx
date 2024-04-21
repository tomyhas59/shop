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
    }
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
    <form onSubmit={handleSubmit} className="inputForm">
      <label>
        상품명:
        <input
          ref={titleRef}
          className="inputField"
          name="title"
          placeholder="title"
          type="text"
          required
        />
      </label>
      <label>
        이미지URL:
        <input
          ref={imageUrlRef}
          className="inputField"
          name="imageUrl"
          type="text"
          required
        ></input>
      </label>
      <label>
        가격:
        <input
          ref={priceRef}
          className="inputField"
          placeholder="Price"
          name="price"
          required
          type="number"
          min="1000"
        />
      </label>
      <label>
        상세:
        <textarea
          ref={descriptionRef}
          className="textareaField"
          name="description"
          placeholder="Description"
        />
      </label>
      <button type="submit" className="submitButton">
        등록
      </button>
    </form>
  );
};

export default AddForm;

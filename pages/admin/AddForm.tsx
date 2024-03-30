import React, { SyntheticEvent } from "react";
import { useMutation } from "react-query";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { ADD_PRODUCT, Product } from "@/graphql/products";
import arrToObj from "@/util/arrToObj";

const AddForm = () => {
  const queryClient = getClient();
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
    addProduct(formData as Omit<Product, "id" | "createdAt">);
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        상품명:
        <input
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
          className="inputField"
          name="imageUrl"
          type="text"
          required
        ></input>
      </label>
      <label>
        가격:
        <input
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

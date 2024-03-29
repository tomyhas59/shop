import React, { SyntheticEvent, useCallback, useRef } from "react";
import useInput from "@/hooks/useInput";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { ADD_PRODUCT } from "@/graphql/products";

const MainPage = () => {
  const [title, titleOnChange] = useInput();
  const [price, priceOnChange] = useInput();
  const [description, descriptionOnChange] = useInput();
  const imageInput = useRef<HTMLInputElement>(null);

  const { mutate: addProduct } = useMutation(() =>
    graphqlFetcher(ADD_PRODUCT, { title, price, description })
  );

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      addProduct();
    },
    [addProduct]
  );

  const onClickFileUpload = useCallback(() => {
    if (imageInput.current) imageInput.current.click();
  }, []);

  return (
    <div className="mainPage">
      <h1>MainPage</h1>
      <form encType="multipart/form-data" onSubmit={onSubmit}>
        <input
          className="inputField"
          placeholder="Title"
          value={title}
          onChange={titleOnChange}
        />
        <input
          className="inputField"
          placeholder="Price"
          value={price}
          onChange={priceOnChange}
          type="number"
        />
        <textarea
          className="textareaField"
          placeholder="Description"
          value={description}
          onChange={descriptionOnChange}
        />
        <input type="file" name="image" multiple hidden ref={imageInput} />
        <button className="fileButton" onClick={onClickFileUpload}>
          파일 첨부
        </button>
        <button type="submit" className="submitButton">
          등록
        </button>
      </form>
    </div>
  );
};

export default MainPage;

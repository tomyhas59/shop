import React, { SyntheticEvent, useCallback, useRef } from "react";
import useInput from "@/hooks/useInput";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { ADD_PRODUCT } from "@/graphql/products";
import AddForm from "./admin/AddForm";

const MainPage = () => {
  return (
    <div className="mainPage">
      <h1>MainPage</h1>
    </div>
  );
};

export default MainPage;

import { ChangeEvent, useCallback } from "react";
import { useState } from "react";

type UseInputType = [
  string,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  React.Dispatch<React.SetStateAction<string>>
];

const useInput = (): UseInputType => {
  const [value, setValue] = useState<string>("");
  const onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return [value, onChange, setValue];
};

export default useInput;

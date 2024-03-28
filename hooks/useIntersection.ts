import { RefObject, useEffect, useCallback, useRef, useState } from "react";

const useIntersection = (targetRef: RefObject<HTMLElement>) => {
  const observerRef = useRef<IntersectionObserver>();
  const [intersecting, setIntersecting] = useState(false);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        setIntersecting(entries.some((entry) => entry.isIntersecting));
        console.log(entries);
      });
    }
    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (targetRef.current) getObserver().observe(targetRef.current);
  }, [observerRef.current]);

  return intersecting;
};

export default useIntersection;

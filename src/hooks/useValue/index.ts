import { useRef } from "react";

const useValue = <T = boolean>(initial: T): [T, (value: T) => void] => {
  const hasLoaded = useRef(initial);
  return [
    hasLoaded.current,
    (value) => {
      hasLoaded.current = value;
    },
  ];
};

export default useValue;

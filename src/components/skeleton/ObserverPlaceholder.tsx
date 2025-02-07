import { Skeleton } from "@/components/ui/skeleton";
import { useObserver } from "@/hooks/use-observer.hook";
import React, { useEffect } from "react";
import { Icons } from "../icons";

type TProps = {
  callback: () => void;
};

const ObserverPlaceholder = ({ callback }: TProps) => {
  const { isIntersecting, ref } = useObserver();

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting]);

  return (
    <div className="flex items-center justify-center my-4" ref={ref}>
      <Icons.Loader2Icon className="size-8 animate-spin text-main" />
    </div>
  );
};

export default ObserverPlaceholder;

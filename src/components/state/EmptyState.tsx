import React from "react";

type TProps = {
  data?: [];
  message?: string;
  children: React.ReactNode;
};

const EmptyState: React.FC<TProps> = ({ data, message, children }) => {
  return (
    <>
      {data !== undefined && data.length > 0 ? (
        children
      ) : (
        <p className="text-center text-sm w-fit mx-auto text-secondary">
          {message}
        </p>
      )}
    </>
  );
};

export default EmptyState;

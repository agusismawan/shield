import React from "react";
import { classNames } from "../../utils";

export const SecondaryButton = React.forwardRef(
  ({ onClick, children, className, type, ...rest }, ref) => {
    return (
      <button
        type={type}
        onClick={onClick}
        ref={ref}
        className={classNames(
          "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

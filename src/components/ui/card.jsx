import React from "react";
import classNames from "classnames";

export const Card = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "bg-white rounded-xl shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={classNames("space-y-2", className)}>
      {children}
    </div>
  );
};

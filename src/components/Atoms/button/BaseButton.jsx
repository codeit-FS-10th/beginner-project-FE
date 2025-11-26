import React from "react";
import "./baseButton.css";

const BaseButton = ({ children, type = "default", size = "md", ...props }) => {
  const typeClass = {
    default: "btn--type-default",
    cancel: "btn--type-cancel",
  }[type];
  const sizeClass = {
    xl: "btn--xl",
    lg: "btn--lg",
    md: "btn--md",
    sm: "btn--sm",
    full: "btn--full",
  }[size];

  return (
    <button className={`btn ${typeClass} ${sizeClass}`.trim()}>
      {children}
    </button>
  );
};

export default BaseButton;

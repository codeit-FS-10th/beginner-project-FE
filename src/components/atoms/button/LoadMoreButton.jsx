import "@styles/atoms/loadMoreButton.css";
import React from "react";

const LoadMoreButton = ({ children }) => {
    return <button className="loadmore-btn">{children}</button>;
};

export default LoadMoreButton;

import "@styles/atoms/loadMoreButton.css";
import React from "react";

const LoadMoreButton = ({ children, onClick }) => {
    return (
        <button onClick={onClick} className="loadmore-btn">
            {children}
        </button>
    );
};

export default LoadMoreButton;

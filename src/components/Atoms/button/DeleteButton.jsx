import React from "react";
import { TrashIcon } from "../../../assets/Icons";
import "../../../assets/styles/deleteButton.css";

const DeleteButton = () => {
  return (
    <button type="button" className="deleteBtn">
      <TrashIcon color="#F50E0E" size={24} />
    </button>
  );
};

export default DeleteButton;

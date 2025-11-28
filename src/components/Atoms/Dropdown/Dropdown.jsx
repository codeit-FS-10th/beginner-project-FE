import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  //바깥 클릭시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="dropdown-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        정렬 기준
      </button>

      <ul className={`dropdown-content ${isOpen ? "show" : ""}`}>
        <li>최신 순</li>
        <li>오래된 순</li>
        <li>많은 포인트 순</li>
        <li>적은 포인트 순</li>
      </ul>
    </div>
  );
} 

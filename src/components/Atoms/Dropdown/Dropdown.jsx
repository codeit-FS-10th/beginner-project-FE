import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export default function Dropdown({
    items = [],
    onSelect,
    label = "정렬 기준",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (item) => {
        onSelect?.(item);
        setIsOpen(false);
    };

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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button
                className="dropdown-btn"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {label}
            </button>

            <ul className={`dropdown-content ${isOpen ? "show" : ""}`}>
                {items.map((item) => (
                    <li key={item} onClick={() => handleSelect(item)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
//pr용

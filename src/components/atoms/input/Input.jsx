import { useState } from "react";
import "@styles/atoms/Input.css";

import eyeClosed from "@img/eye1.svg";
import eyeOpen from "@img/eye2.svg";

export default function Input({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    error = "",
    showToggle,
    multiline = false,
    ...rest
}) {
    const [show, setShow] = useState(false);

    const shouldShowToggle = type === "password" ? true : showToggle;

    const actualType =
        shouldShowToggle && type === "password"
            ? show
                ? "text"
                : "password"
            : type;

    const Tag = multiline ? "textarea" : "input";

    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}

            <div
                className={`input-box ${
                    multiline ? "input-box--multiline" : ""
                }`}
            >
                <Tag
                    type={multiline ? undefined : actualType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`input-field ${
                        multiline ? "input-field--multiline" : ""
                    } ${error ? "input-error" : ""}`}
                    {...rest}
                />

                {!multiline && shouldShowToggle && type === "password" && (
                    <img
                        src={show ? eyeOpen : eyeClosed}
                        alt="toggle password visibility"
                        className="input-icon"
                        onClick={() => setShow((prev) => !prev)}
                    />
                )}
            </div>

            {error && <p className="input-error-message">{error}</p>}
        </div>
    );
}

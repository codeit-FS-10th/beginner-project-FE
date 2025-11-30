import { useState } from "react";

import styles from "@styls/Input.css";


function Input({
    value = "",
    onChange,
    type = "text",
    error = false,
    errorMessage = "",
    showToggle = false,
    ...rest
}) {
    const [show, setShow] = useState(false);
    const actualType = showToggle ? (show ? "text" : "password") : type;

    return (
        <div className={styles.wrapper}>
            <input
                className={`${styles.input} ${error ? styles.error : ""}`}
                value={value}
                onChange={onChange}
                type={actualType}
                {...rest}
            />

            {showToggle && (
                <img
                    src={show ? "/img/eye2.svg" : "/img/eye1.svg"}
                    className={styles.eyeIcon}
                    alt="toggle password"
                    onClick={() => setShow(!show)}
                />
            )}

            {error && errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}
        </div>
    );
}

export default Input;

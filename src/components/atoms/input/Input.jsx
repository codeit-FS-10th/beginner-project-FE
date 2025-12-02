import "@styles/atoms/Input.css";

export default function Input({
    label,
    placeholder,
    value,
    onChange,
    error,
    errorMessage,
}) {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}

            <input
                className={`${styles.input} ${error ? styles.error : ""}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

            {error && errorMessage && (
                <p className={styles.errorMsg}>{errorMessage}</p>
            )}
        </div>
    );
}

import React, { useEffect } from "react";
import styles from "./Toast.module.css";

function Toast({ message, type = "info", onClose, duration = 4000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#4A9B9B" />
                        <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case "error":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#e74c3c" />
                        <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case "warning":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#f39c12" />
                        <path d="M12 7v6M12 16v1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            default:
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#3498db" />
                        <path d="M12 11v5M12 8v1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
        }
    };

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <div className={styles.icon}>{getIcon()}</div>
            <div className={styles.message}>{message}</div>
            <button onClick={onClose} className={styles.closeButton}>
                ×
            </button>
        </div>
    );
}

export default Toast;

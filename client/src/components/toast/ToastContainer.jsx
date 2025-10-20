import React from "react";
import Toast from "./Toast";
import styles from "./ToastContainer.module.css";

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

export default ToastContainer;

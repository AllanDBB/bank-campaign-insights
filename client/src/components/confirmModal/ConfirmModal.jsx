import React from "react";
import styles from "./ConfirmModal.module.css";

function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "danger"
}) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={`${styles.icon} ${styles[type]}`}>
                        {type === "danger" && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 20h20L12 2z" fill="currentColor" opacity="0.2"/>
                                <path d="M12 9v5M12 17v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        )}
                        {type === "warning" && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 7v6M12 16v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        )}
                        {type === "info" && (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 11v5M12 8v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        )}
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                </div>

                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmButton} ${styles[type]}`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;

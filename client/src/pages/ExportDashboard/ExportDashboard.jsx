import React from "react";
import styles from "./ExportDashboard.module.css";

function ExportDashboard({ onClose }) {
    const handlePDFExport = () => {
        console.log("Exportando a PDF...");
        // Aquí iría la lógica de exportación a PDF
    };

    const handleExcelExport = () => {
        console.log("Exportando a Excel...");
        // Aquí iría la lógica de exportación a Excel
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
                
                <h2 className={styles.title}>Exportar Dashboard</h2>
                
                <div className={styles.exportOptions}>
                    <div className={styles.exportCard} style={{ backgroundColor: '#4A9B9B' }}>
                        <div className={styles.iconContainer}>
                            <svg className={styles.icon} viewBox="0 0 64 64" fill="none">
                                <rect x="16" y="8" width="32" height="48" stroke="white" strokeWidth="2" fill="none" rx="2"/>
                                <path d="M20 8 L20 4 L44 4 L44 8" stroke="white" strokeWidth="2"/>
                                <text x="32" y="36" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">PDF</text>
                            </svg>
                        </div>
                        <h3 className={styles.formatTitle}>PDF</h3>
                        <button className={styles.downloadButton} onClick={handlePDFExport}>
                            Descargar
                        </button>
                    </div>

                    <div className={styles.exportCard} style={{ backgroundColor: '#4A5FA0' }}>
                        <div className={styles.iconContainer}>
                            <svg className={styles.icon} viewBox="0 0 64 64" fill="none">
                                <rect x="12" y="12" width="40" height="40" stroke="white" strokeWidth="2" fill="none" rx="2"/>
                                <path d="M20 12 L20 52 M28 12 L28 52" stroke="white" strokeWidth="2"/>
                                <path d="M12 20 L52 20 M12 28 L52 28 M12 36 L52 36" stroke="white" strokeWidth="1.5"/>
                                <text x="38" y="36" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">X</text>
                            </svg>
                        </div>
                        <h3 className={styles.formatTitle}>Excel</h3>
                        <button className={styles.downloadButton} onClick={handleExcelExport}>
                            Descargar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExportDashboard;

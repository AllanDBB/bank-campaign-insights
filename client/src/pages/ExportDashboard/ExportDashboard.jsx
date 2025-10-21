import React, { useState } from "react";
import styles from "./ExportDashboard.module.css";
import exportService from "../../services/exportService";
import { useActiveFilter } from "../../context/FilterContext";
import { CircularProgress } from "@mui/material";

function ExportDashboard({ onClose }) {
    const { activeFilter } = useActiveFilter();
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const buildFiltersObject = () => {
        const filters = {};
        if (activeFilter.queryParams) {
            for (const [key, value] of activeFilter.queryParams.entries()) {
                if (filters[key]) {
                    // If key already exists, convert to array or append to array
                    if (Array.isArray(filters[key])) {
                        filters[key].push(value);
                    } else {
                        filters[key] = [filters[key], value];
                    }
                } else {
                    filters[key] = value;
                }
            }
        }
        return filters;
    };

    const handlePDFExport = async () => {
        try {
            setLoadingPDF(true);
            setError(null);
            setSuccess(null);
            console.log("Exportando a PDF...");
            
            const filters = buildFiltersObject();
            await exportService.exportToPDF(filters);
            
            console.log("PDF exportado exitosamente");
            setSuccess("¡PDF descargado exitosamente!");
            
            // Cerrar el modal después de mostrar el mensaje de éxito
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error al exportar PDF:", err);
            setError("Error al exportar a PDF. Por favor intenta de nuevo.");
        } finally {
            setLoadingPDF(false);
        }
    };

    const handleExcelExport = async () => {
        try {
            setLoadingExcel(true);
            setError(null);
            setSuccess(null);
            console.log("Exportando a Excel...");
            
            const filters = buildFiltersObject();
            await exportService.exportToExcel(filters);
            
            console.log("Excel exportado exitosamente");
            setSuccess("¡Excel descargado exitosamente!");
            
            // Cerrar el modal después de mostrar el mensaje de éxito
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error al exportar Excel:", err);
            setError("Error al exportar a Excel. Por favor intenta de nuevo.");
        } finally {
            setLoadingExcel(false);
        }
    };

    return (
        <div className={styles.overlay}>
            {/* Loading Overlay cuando está exportando */}
            {(loadingPDF || loadingExcel) && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingContainer}>
                        <CircularProgress size={80} style={{ color: '#44A1B4' }} />
                        <h3 className={styles.loadingText}>
                            {loadingPDF ? 'Generando PDF...' : 'Generando Excel...'}
                        </h3>
                        <p className={styles.loadingSubtext}>
                            Por favor espera mientras preparamos tu archivo
                        </p>
                    </div>
                </div>
            )}

            <div className={styles.modal}>
                <button 
                    className={styles.closeButton} 
                    onClick={onClose}
                    disabled={loadingPDF || loadingExcel}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
                
                <h2 className={styles.title}>Exportar Dashboard</h2>
                
                {success && (
                    <div style={{ 
                        backgroundColor: '#4caf50', 
                        color: 'white', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        marginBottom: '20px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>✓</span>
                        {success}
                    </div>
                )}
                
                {error && (
                    <div style={{ 
                        backgroundColor: '#f44336', 
                        color: 'white', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                
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
                        <button 
                            className={styles.downloadButton} 
                            onClick={handlePDFExport}
                            disabled={loadingPDF || loadingExcel}
                        >
                            {loadingPDF ? (
                                <CircularProgress size={20} style={{ color: 'white' }} />
                            ) : (
                                'Descargar'
                            )}
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
                        <button 
                            className={styles.downloadButton} 
                            onClick={handleExcelExport}
                            disabled={loadingPDF || loadingExcel}
                        >
                            {loadingExcel ? (
                                <CircularProgress size={20} style={{ color: 'white' }} />
                            ) : (
                                'Descargar'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExportDashboard;

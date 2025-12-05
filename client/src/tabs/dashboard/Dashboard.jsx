import React from "react";
import { useState, useContext, useEffect } from "react";
import styles from "./Dashboard.module.css"
import TitleCard from "../../components/titleCard/TitleCard";
import ArrowButton from "../../components/arrowButton/ArrowButton";
import DashboardGeneral from "./dashboardTabs/dashboardGeneral/DashboardGeneral"
import DashbaordCall from "./dashboardTabs/dashboardCallDetails/DashboardCall";
import DashboardAdditional from "./dashboardTabs/dashboardAdditional/DashboardAdditional";
import DashboardKPI from "./dashboardTabs/dashboardKPI/DashboardKPI"
import { DashboardDataProvider, DashboardDataContext } from "../../context/DashboardDataContext";
import { useToastContext } from "../../context/ToastContext";
import ExportDashboard from "../../pages/ExportDashboard/ExportDashboard";

function DashboardContent() {
    const [page, setPage] = useState(0);
    const [showExportModal, setShowExportModal] = useState(false);
    const { permissionError, loadDashboardMetrics } = useContext(DashboardDataContext);
    const { error: showError } = useToastContext();

    useEffect(() => {
        loadDashboardMetrics();
    }, [loadDashboardMetrics]);

    useEffect(() => {
        if (permissionError) {
            showError('No tienes permiso para realizar esta acción. Contacta a tu administrador si necesitas acceso.');
        }
    }, [permissionError, showError]);

    const dashboards = [
        { id: 0, title: "Dashboard General", component: () => <DashboardGeneral/> },
        { id: 1, title: "Dashboard de Detalles de Llamadas", component: () => <DashbaordCall/> },
        { id: 2, title: "Dashboard Adicional", component: () => <DashboardAdditional/> },
        { id: 3, title: "Dashboard de KPIs", component: () => <DashboardKPI/> }
    ];

    const handleExport = () => {
        setShowExportModal(true);
    }

    const handleCloseExportModal = () => {
        setShowExportModal(false);
    }

    const handleNext = () => setPage((prev) => (prev + 1) % dashboards.length);
    const handlePrev = () => setPage((prev) => (prev - 1 + dashboards.length) % dashboards.length);

    return(
        <div className= {styles.container}>
            <div className= {styles.headTitleDiv}>
                <ArrowButton direction={'left'} onClick={handlePrev} size={'60px'}></ArrowButton>
                <TitleCard text={dashboards[page].title} width={'50%'}></TitleCard>
                <ArrowButton direction={'right'} onClick={handleNext} size={'60px'}></ArrowButton>
            </div>

            {permissionError && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    minHeight: "500px"
                }}>
                    <div style={{
                        textAlign: "center"
                    }}>
                        <h2 style={{ color: "#e74c3c", marginBottom: "1rem", fontSize: "2rem" }}>Acceso Denegado</h2>
                        <p style={{ color: "#ccc", fontSize: "1.1rem" }}>No tienes permisos para acceder a esta sección.</p>
                        <p style={{ fontSize: "0.9rem", color: "#999", marginTop: "1rem" }}>
                            Contacta con un administrador si crees que esto es un error.
                        </p>
                    </div>
                </div>
            )}

            {!permissionError && (
            <>
            <div className={styles.exportDiv}>
                <button className={styles.exportButton} onClick={handleExport}>Exportar</button>
            </div>
            <div className={styles.contentDiv}>
                {dashboards[page].component()}
            </div>
            </>
            )}

            {showExportModal && (
                <ExportDashboard onClose={handleCloseExportModal} />
            )}
        </div>
    );
}

function Dashboard() {
    return (
        <DashboardDataProvider>
            <DashboardContent />
        </DashboardDataProvider>
    );
}

export default Dashboard
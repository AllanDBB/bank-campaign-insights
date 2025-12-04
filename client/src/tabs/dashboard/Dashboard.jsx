import React from "react";
import { useState } from "react";
import styles from "./Dashboard.module.css"
import TitleCard from "../../components/titleCard/TitleCard";
import ArrowButton from "../../components/arrowButton/ArrowButton";
import DashboardGeneral from "./dashboardTabs/dashboardGeneral/DashboardGeneral"
import DashbaordCall from "./dashboardTabs/dashboardCallDetails/DashboardCall";
import DashboardAdditional from "./dashboardTabs/dashboardAdditional/DashboardAdditional";
import DashboardKPI from "./dashboardTabs/dashboardKPI/DashboardKPI"
import { DashboardDataProvider } from "../../context/DashboardDataContext";
import ExportDashboard from "../../pages/ExportDashboard/ExportDashboard";

function Dashboard() {
    const [page, setPage] = useState(0);
    const [showExportModal, setShowExportModal] = useState(false);

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
        <DashboardDataProvider>
            <div className= {styles.container}>
                <div className= {styles.headTitleDiv}>
                    <ArrowButton direction={'left'} onClick={handlePrev} size={'60px'}></ArrowButton>
                    <TitleCard text={dashboards[page].title} width={'50%'}></TitleCard>
                    <ArrowButton direction={'right'} onClick={handleNext} size={'60px'}></ArrowButton>
                </div>
                <div className={styles.exportDiv}>
                    <button className={styles.exportButton} onClick={handleExport}>Exportar</button>
                </div>
                <div className={styles.contentDiv}>
                    {dashboards[page].component()}
                </div>
                
                {showExportModal && (
                    <ExportDashboard onClose={handleCloseExportModal} />
                )}
            </div>
        </DashboardDataProvider>
    );
}

export default Dashboard
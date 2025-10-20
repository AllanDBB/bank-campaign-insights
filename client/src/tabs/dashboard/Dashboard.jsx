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

function Dashboard() {
    const [page, setPage] = useState(0);
    const dashboards = [
        { id: 0, title: "Dashboard General", component: () => <DashboardGeneral/> },
        { id: 1, title: "Dashboard de Detalles de Llamadas", component: () => <DashbaordCall/> },
        { id: 2, title: "Dashboard Adicional", component: () => <DashboardAdditional/> },
        { id: 3, title: "Dashboard de KPIs", component: () => <DashboardKPI/> }
    ];

    const handleExport = () => {
        //navegación a pantalla de exportar
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
            </div>
        </DashboardDataProvider>
    );
}

export default Dashboard
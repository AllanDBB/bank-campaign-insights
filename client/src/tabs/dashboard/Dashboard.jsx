import React from "react";
import { useState } from "react";
import styles from "./Dashboard.module.css"
import TitleCard from "../../components/titleCard/TitleCard";
import ArrowButton from "../../components/arrowButton/ArrowButton";
import DashboardGeneral from "./dashboardTabs/DashboardGeneral"
import DashboardDetailed from "./dashboardTabs/DashboardDetailed";

function Dashboard() {
    const [page, setPage] = useState(0);
    const dashboards = [
        { id: 0, title: "Dashboard General", component: <DashboardGeneral/> },
        { id: 1, title: "Dashboard Detallado", component: <DashboardDetailed/> },
    ];

    const handleNext = () => setPage((prev) => (prev + 1) % dashboards.length);
    const handlePrev = () => setPage((prev) => (prev - 1 + dashboards.length) % dashboards.length);

    return(
        <div className= {styles.container}>
            <div className= {styles.headTitleDiv}>
                <ArrowButton direction={'left'} onClick={handlePrev} size={'60px'}></ArrowButton>
                <TitleCard text={dashboards[page].title} width={'50%'}></TitleCard>
                <ArrowButton direction={'right'} onClick={handleNext} size={'60px'}></ArrowButton>
            </div>
            <div className={styles.exportDiv}>
                <button className={styles.exportButton}>Exportar</button>
            </div>
            <div className={styles.contentDiv}>
                {dashboards[page].component}
            </div>
        </div>
    );
}

export default Dashboard
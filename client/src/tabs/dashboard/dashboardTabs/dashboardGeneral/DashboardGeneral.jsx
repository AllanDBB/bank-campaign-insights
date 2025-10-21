import React, { useEffect } from "react";
import styles from "./DashboardGeneral.module.css"
import {Typography, Divider, CircularProgress, Alert} from "@mui/material"
import Histogram from "../../../../components/histogram/Histogram"
import CircularChart from "../../../../components/pieChart/CircularChart";
import GroupedBarChart from "../../../../components/groupedBarChart/GroupedBarChart";
import { useDashboardData } from "../../../../hooks/useDashboardData";


function DashboardGeneral(){
    const { dashboardData, loading, error, loadDashboardMetrics } = useDashboardData();

    // Load metrics when component mounts
    useEffect(() => {
        loadDashboardMetrics();
    }, [loadDashboardMetrics]);

    if (loading) {
        return (
            <div className={styles.mainContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress size={60} style={{ color: '#44A1B4' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.mainContainer} style={{ padding: '2rem' }}>
                <Alert severity="error">{error}</Alert>
            </div>
        );
    }

    return (
        <div className={styles.mainContainer}>
            <div className={`${styles.graphContainer} ${styles.cardContainerSuccess}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Llamadas Exitosas</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> {dashboardData.successfulCalls} </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.cardContainerFail}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Llamadas No Exitosas</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> {dashboardData.unsuccessfulCalls}</Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.histogramContainer}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dashboardData.ageDistribution} 
                    xLabel="Edad" yLabel="Cantidad" 
                    title="Distribución de Edad">
                    </Histogram>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.barContainer}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dashboardData.ocupation} 
                    xLabel="Ocupación" 
                    yLabel="Cantidad" 
                    title="Ocupación" 
                    showLine={false}
                    barColor= "#835eacff"
                    horizontal= {false}>
                    </Histogram>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.donutContainer}`}>
                <div className={styles.card}>
                    <CircularChart
                    data={dashboardData.maritalStatus}
                    title="Estado Civil"
                    isDonut={true}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.groupedBarContainer}`}>
                <div className={styles.card}>
                    <GroupedBarChart
                    data={dashboardData.consumerCredital}
                    keys={["Si", "No", "Uknown"]}
                    title="Información de Usuarios"
                    colors= {["#1b11afff", "#4ea8d8ff", "#6d1338ff"]}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.orderedContainer}`}>
                <div className={styles.card}>
                    <GroupedBarChart
                    data={dashboardData.educationCR}
                    keys={[
                        "Primaria4to",
                        "Primaria6to",
                        "Primaria9no",
                        "Colegio",
                        "CursoProfesional",
                        "GradoUniversitario",
                        "Desconocido"
                    ]}
                    title="Tasa por nivel de educación"
                    horizontal={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardGeneral
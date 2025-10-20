import React from "react";
import styles from "./DashboardAdditional.module.css"
import Histogram from "../../../../components/histogram/Histogram"
import TimeSeriesChart from "../../../../components/timeSeries/TimeSeriesChart";
import ScatterPlot from "../../../../components/scatterPlot/ScatterPlot";
import CircularChart from "../../../../components/pieChart/CircularChart";
import { useContext } from "react";
import { DashboardDataContext } from "../../../../context/DashboardDataContext";


function DashboardAdditional(){
    const {dashboardData, setDashboardData} = useContext(DashboardDataContext);
    return (
        <div className={styles.mainContainer}>
            <div className={`${styles.graphContainer} ${styles.pdayHistogram}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dashboardData.prevCR} 
                    xLabel="Días previos" 
                    yLabel="Tasa de Conversión" 
                    title="Tasa de Conversión segun Contactos Previos" 
                    showBars={true}
                    showLine={true}
                    barColor="#730ab9ff"
                    lineColor="#b98a0aff">
                    </Histogram>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.timeSer}`}>
                <div className={styles.card}>
                    <TimeSeriesChart
                    data={dashboardData.monthlyVar}
                    seriesKeys={["varRate", "consPrice", "consConf"]}
                    title="Variaciones por mes"
                    yLabel="Promedio mensual"
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.scatter}`}>
                <div className={styles.card}>
                    <ScatterPlot
                    data={dashboardData.employeeNumberCR}               
                    title="Tasa de Conversión por número de empleados"
                    xLabel="Número de Empleados"
                    yLabel="Tasa de Conversión"
                    color="#3b82f6"                 
                    showGrid={true}                  
                    useZ={false}                      
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.pieChart}`}>
                <div className={styles.card}>
                    <CircularChart
                    data={dashboardData.callSubscription}
                    title="Suscripción en llamada"
                    isDonut={false}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.lineChart}`}>
                <div className={styles.card}>
                    <TimeSeriesChart
                    data={dashboardData.monthlyEur}
                    seriesKeys={["euribor"]}
                    title="Tasa de euribor mensual"
                    yLabel="Promedio mensual"
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardAdditional
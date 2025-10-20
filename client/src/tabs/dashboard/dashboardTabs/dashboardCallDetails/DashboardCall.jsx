import React from "react";
import styles from "./DashboardCall.module.css"
import {Typography, Divider} from "@mui/material"
import Histogram from "../../../../components/histogram/Histogram"
import CircularChart from "../../../../components/pieChart/CircularChart";
import GroupedBarChart from "../../../../components/groupedBarChart/GroupedBarChart";
import AreaChartComponent from "../../../../components/areaChart/AreaChart";
import StackedBarChart from "../../../../components/stackedChart/stackedChart";

const data = [
    {group: "Contact", Cellular: 40, Telephone: 60},
];

const stackedBarChart = [
    {name: "Resultado", nonexistant: 4000, success: 3325, failed:2190}
]

const dataEjemploLlamadas = [
    {group: "Resultado", Aceptada: 600, Rechazada: 340},
];

const dataEjemploHeatmap = [
    { name: "Mon", value: 30 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 60 },
    { name: "Thu", value: 50 },
    { name: "Fri", value: 70 },
];

const dataEjemploBarras = [
{ name: "A", value: 30},
{ name: "B", value: 70},
{ name: "C", value: 80},
{ name: "D", value: 20},
{ name: "E", value: 50},
{ name: "F", value: 20},
{ name: "G", value: 20},
];

const dataEjemploLinea = [
{ name: "A", lineValue: 30},
{ name: "B", lineValue: 70},
{ name: "C", lineValue: 80},
{ name: "D", lineValue: 20},
{ name: "E", lineValue: 50},
{ name: "F", lineValue: 20},
{ name: "G", lineValue: 20},
];

const dataEjemploHistograma = [
{ name: "A", value: 30, lineValue: 10 },
{ name: "B", value: 50, lineValue: 25 },
{ name: "C", value: 80, lineValue: 60 },
{ name: "D", value: 20, lineValue: 75 },
{ name: "E", value: 20, lineValue: 75 },
{ name: "F", value: 20, lineValue: 75 },
{ name: "G", value: 20, lineValue: 75 },
{ name: "H", value: 20, lineValue: 75 },
{ name: "I", value: 20, lineValue: 75 },
];

function DashboardCall(){
    return (
        <div className={styles.mainContainer}>
            <div className={`${styles.graphContainer} ${styles.groupedBarContainer}`}>
                <div className={styles.card}>
                    <GroupedBarChart
                    data={data}
                    keys={["Cellular", "Telephone"]}
                    title="Tipo de Contacto"
                    horizontal={true}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.lineContainer}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dataEjemploLinea} 
                    xLabel="Mes" 
                    yLabel="Cantidad" 
                    title="Llamadas por Mes" 
                    showBars={false}
                    showLine={true}
                    lineColor= "#835eacff">
                    </Histogram>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.areaChartContainer}`}>
                <div className={styles.card}>
                    <AreaChartComponent
                    data={dataEjemploHeatmap}
                    title="Tasa de conversión por día de la semana"
                    xLabel="Día"
                    yLabel="Tasa de Conversión"
                    areaColor="rgba(59, 130, 246, 0.3)"
                    strokeColor="#3b82f6"
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.groupedDurationContainer}`}>
                <div className={styles.card}>
                    <GroupedBarChart
                    data={dataEjemploLlamadas}
                    keys={["Aceptada", "Rechazada"]}
                    colors={["#19a385ff", "#6b0d63ff"]}
                    title="Duración promedio de llamadas en segundos"
                    horizontal={true}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.capaingHist}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dataEjemploLinea} 
                    xLabel="Mes" 
                    yLabel="Cantidad" 
                    title="Llamadas por Campaña" 
                    showBars={false}
                    showLine={true}
                    lineColor= "#835eacff">
                    </Histogram>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.stackedChart}`}>
                <div className={styles.card}>
                    <StackedBarChart
                    data={stackedBarChart}
                    series={["nonexistant", "success", "failed"]}
                    title="Resultado de las llamadas"
                    yLabel="Cantidad"
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardCall
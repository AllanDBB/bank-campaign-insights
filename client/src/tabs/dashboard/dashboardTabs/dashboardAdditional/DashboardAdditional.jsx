import React from "react";
import styles from "./DashboardAdditional.module.css"
import Histogram from "../../../../components/histogram/Histogram"
import TimeSeriesChart from "../../../../components/timeSeries/TimeSeriesChart";
import GroupedBarChart from "../../../../components/groupedBarChart/GroupedBarChart";
import AreaChartComponent from "../../../../components/areaChart/AreaChart";
import StackedBarChart from "../../../../components/stackedChart/stackedChart";
import ScatterPlot from "../../../../components/scatterPlot/ScatterPlot";
import CircularChart from "../../../../components/pieChart/CircularChart";

const data = [
    {group: "Contact", Cellular: 40, Telephone: 60},
];

const stackedBarChart = [
    {name: "Resultado", nonexistant: 4000, success: 3325, failed:2190}
]

const dataEjemploLlamadas = [
    {group: "Resultado", Aceptada: 600, Rechazada: 340},
];

const dataEjemploTimeSer = [
    { date: "jan", varRate: -60, consPrice: 1.2, consConf: 91 },
    { date: "feb", varRate: -55, consPrice: 1.25, consConf: 92 },
    { date: "mar", varRate: -45, consPrice: 1.28, consConf: 90 },
    { date: "apr", varRate: -40, consPrice: 1.3, consConf: 95 },
    { date: "may", varRate: -35, consPrice: 1.32, consConf: 97 },
    { date: "jun", varRate: -38, consPrice: 1.34, consConf: 96 },
    { date: "jul", varRate: -30, consPrice: 1.36, consConf: 110 },
    { date: "ago", varRate: -32, consPrice: 1.38, consConf: 107 },
    { date: "sep", varRate: -40, consPrice: 1.4, consConf: 105 },
    { date: "oct", varRate: -45, consPrice: 1.42, consConf: 100 },
    { date: "nov", varRate: -48, consPrice: 1.43, consConf: 98 },
    { date: "dec", varRate: -50, consPrice: 1.45, consConf: 95 },
];

const scatterData = [
    { x: 4.2, y: 3.8, z: 2.5, name: "Punto 1" },
    { x: 1.5, y: 4.7, z: 3.0, name: "Punto 2" },
    { x: 3.3, y: 2.1, z: 1.5, name: "Punto 3" },
    { x: 0.8, y: 1.9, z: 2.0, name: "Punto 4" },
    { x: 2.7, y: 4.0, z: 3.5, name: "Punto 5" },
    { x: 4.9, y: 0.5, z: 2.2, name: "Punto 6" },
    { x: 3.6, y: 3.3, z: 1.8, name: "Punto 7" },
    { x: 2.2, y: 4.5, z: 2.9, name: "Punto 8" },
    { x: 1.1, y: 2.8, z: 3.0, name: "Punto 9" },
    { x: 4.5, y: 1.2, z: 2.4, name: "Punto 10" },
    { x: 0.5, y: 0.9, z: 1.5, name: "Punto 11" },
    { x: 3.8, y: 2.5, z: 2.7, name: "Punto 12" },
    { x: 2.0, y: 3.0, z: 3.1, name: "Punto 13" },
    { x: 1.8, y: 1.5, z: 2.0, name: "Punto 14" },
    { x: 4.7, y: 4.2, z: 3.3, name: "Punto 15" },
    { x: 3.0, y: 0.7, z: 1.8, name: "Punto 16" },
    { x: 2.5, y: 2.2, z: 2.6, name: "Punto 17" },
    { x: 0.9, y: 4.8, z: 2.9, name: "Punto 18" },
    { x: 4.0, y: 3.5, z: 3.0, name: "Punto 19" },
    { x: 1.2, y: 1.0, z: 1.7, name: "Punto 20" },
];

const dataEjemploPie = [
{ name: "Si", value: 30},
{ name: "No", value: 70}
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

function DashboardAdditional(){
    return (
        <div className={styles.mainContainer}>
            <div className={`${styles.graphContainer} ${styles.pdayHistogram}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dataEjemploHistograma} 
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
            <div className={`${styles.graphContainer} ${styles.pdayHistogram}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dataEjemploHistograma} 
                    xLabel="Días previos" 
                    yLabel="Tasa de Conversión" 
                    title="Tasa de Conversión según Contactos Previos" 
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
                    data={dataEjemploTimeSer}
                    seriesKeys={["varRate", "consPrice", "consConf"]}
                    title="Variaciones por mes"
                    yLabel="Promedio mensual"
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.scatter}`}>
                <div className={styles.card}>
                    <ScatterPlot
                    data={scatterData}               
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
                    data={dataEjemploPie}
                    title="Suscripción en llamada"
                    isDonut={false}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.lineChart}`}>
                <div className={styles.card}>
                    <TimeSeriesChart
                    data={dataEjemploTimeSer}
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
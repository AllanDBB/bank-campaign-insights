import React from "react";
import styles from "./DashboardKPI.module.css"
import GroupedBarChart from "../../../../components/groupedBarChart/GroupedBarChart";
import StackedBarChart from "../../../../components/stackedChart/stackedChart";
import { Typography, Divider } from "@mui/material";
import Histogram from "../../../../components/histogram/Histogram";
import TimeSeriesChart from "../../../../components/timeSeries/TimeSeriesChart";
import { useContext } from "react";
import { DashboardDataContext } from "../../../../context/DashboardDataContext";


function normalizeData(data) {
    const allKeys = Array.from(
        new Set(
        data.flatMap(item => Object.keys(item).filter(key => key !== "date"))
        )
    );
    const normalizedData = data.map(item => {
        const newItem = { ...item };
        allKeys.forEach(key => {
        if (!(key in newItem)) newItem[key] = 0;
        });
        return newItem;
    });
    return { normalizedData, allKeys };
}

const data = [
    {group: "Contacto", Cellular: 40.3, Telephone: 60},
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

const columns = ["18-25", "26-35", "36-45", "46-60", "60+"];

const dataHeatmap = [
    { name: "Primaria", values: [50, 40, 30, 20, 10] },
    { name: "Secundaria", values: [60, 55, 50, 35, 20] },
    { name: "Universitario", values: [30, 45, 40, 25, 15] },
    { name: "Posgrado", values: [5, 15, 20, 10, 5] },
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

const dataConversionMensual = [
    { date: "ene", campañaA: 0.05, campañaB: 0.03, campañaC: 0.02},
    { date: "feb", campañaA: 0.06, campañaB: 0.035, campañaC: 0.025, campañaD: 1 },
    { date: "mar", campañaA: 0.07, campañaB: 0.04, campañaC: 0.03, campañaD: 1 },
    { date: "abr", campañaA: 0.065, campañaB: 0.042, campañaC: 0.028, campañaD: 1 },
    { date: "may", campañaA: 0.075, campañaB: 0.045, campañaC: 0.032, campañaD: 1 },
    { date: "jun", campañaA: 0.08, campañaB: 0.048, campañaC: 0.035, campañaD: 1 },
    { date: "jul", campañaA: 0.085, campañaB: 0.05, campañaC: 0.038, campañaD: 1 },
    { date: "ago", campañaA: 0.09, campañaB: 0.052, campañaC: 0.04, campañaD: 1 },
    { date: "sep", campañaA: 0.092, campañaB: 0.054, campañaC: 0.042, campañaD: 1 },
    { date: "oct", campañaA: 0.095, campañaB: 0.056, campañaC: 0.045, campañaD: 1 },
    { date: "nov", campañaA: 0.1, campañaB: 0.058, campañaC: 0.048, campañaD: 1 },
    { date: "dic", campañaA: 0.105, campañaB: 0.06, campañaC: 0.05 , campañaD: 1},
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
    const {dashboardData, setDashboardData} = useContext(DashboardDataContext);
    const { normalizedData, allKeys } = normalizeData(dashboardData.campaignEfficiency);
    return (
        <div className={styles.mainContainer}>
            <div className={`${styles.graphContainer} ${styles.cardContainerCR}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Tasa de Conversión</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> {dashboardData.cr} </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.cardContainerTotal}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Total de Contactos</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> {dashboardData.totalCalls} </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.cardContainerMedian}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Duración media de llamadas en segundos</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> {dashboardData.callAvg} </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.groupedBar}`}>
                <div className={styles.card}>
                    <GroupedBarChart
                    data={dashboardData.contactSuccess}
                    keys={["Celular", "Telefono"]}
                    colors={["#791070ff", "#9c851fff"]}
                    title="Tasa de éxito por Canal"
                    horizontal={false}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.ageBar}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dashboardData.ageConversionRate} 
                    xLabel="Tasa de Conversión" 
                    yLabel="Rango de edad" 
                    title="Conversión por segmento de edad" 
                    showLine={false}
                    barColor= "#2f5eb6ff"
                    horizontal= {true}>
                    </Histogram>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.stackBar}`}>
                <div className={styles.card}>
                    <StackedBarChart
                    data={dashboardData.prevImpact}
                    series={["Exito", "Fallido", "Ninguno"]}
                    title="Impacto del historial previo"
                    yLabel="Tasa de Conversión"
                    colors={["#1b1079ff", "#1f8d9cff" , "#1f9c57ff"]}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.timeSer}`}>
                <div className={styles.card}>
                    <TimeSeriesChart
                    data={normalizedData}
                    seriesKeys={allKeys}
                    title="Índice de eficiencia por campaña"
                    yLabel="Tasa de Conversión"
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardAdditional
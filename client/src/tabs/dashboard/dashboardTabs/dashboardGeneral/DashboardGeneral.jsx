import React, { useContext } from "react";
import styles from "./DashboardGeneral.module.css"
import {Typography, Divider} from "@mui/material"
import Histogram from "../../../../components/histogram/Histogram"
import CircularChart from "../../../../components/pieChart/CircularChart";
import GroupedBarChart from "../../../../components/groupedBarChart/GroupedBarChart";
import { DashboardDataContext } from "../../../../context/DashboardDataContext"; 


const data = [
    {group: "Housing", Si: 40, No: 60, Uknown: 70},
    {group: "Loan", Si: 30, No: 55, Uknown: 80},
    {group: "Default", Si: 47, No: 61, Uknown: 73},
];

const data2 = [
    {group: "Educación", 
        Primaria4to: 40, 
        Primaria6to: 60, 
        Primaria9no: 70,
        Colegio: 23,
        CursoProfesional: 42,
        GradoUniversitario: 45,
        Desconocido: 6000
    },
];

const dataEjemploBarras = [
{ name: "A", value: 30},
{ name: "B", value: 70},
{ name: "C", value: 90},
{ name: "D", value: 20},
{ name: "E", value: 50},
{ name: "F", value: 20},
{ name: "G", value: 20},
];
const dataEjemploHistograma = [
{ name: "A", value: 30, lineValue: 30 },
{ name: "B", value: 50, lineValue: 50 },
{ name: "C", value: 80, lineValue: 80 },
{ name: "D", value: 20, lineValue: 75 },
{ name: "E", value: 20, lineValue: 75 },
{ name: "F", value: 20, lineValue: 75 },
{ name: "G", value: 20, lineValue: 75 },
{ name: "H", value: 20, lineValue: 75 },
{ name: "I", value: 20, lineValue: 75 },
];

function DashboardGeneral(){
    const {dashboardData, setDashboardData} = useContext(DashboardDataContext);
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
                    data={dataEjemploBarras} 
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
                    data={data}
                    keys={["Si", "No", "Uknown"]}
                    title="Información de Usuarios"
                    colors= {["#1b11afff", "#4ea8d8ff", "#6d1338ff"]}
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.orderedContainer}`}>
                <div className={styles.card}>
                    <GroupedBarChart
                    data={data2}
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
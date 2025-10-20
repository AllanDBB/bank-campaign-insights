import React from "react";
import styles from "./DashboardGeneral.module.css"
import {Typography, Divider} from "@mui/material"
import Histogram from "../../../../components/histogram/Histogram"
import CircularChart from "../../../../components/pieChart/CircularChart";
import GroupedBarChart from "../../../../components/groupedBarChart/GroupedBarChart";

const data = [
    {group: "Housing", Si: 40, No: 60, Uknown: 70},
    {group: "Loan", Si: 30, No: 55, Uknown: 80},
    {group: "Default", Si: 47, No: 61, Uknown: 73},
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

function DashboardGeneral(){
    return (
        <div className={styles.mainContainer}>
            <div className={`${styles.graphContainer} ${styles.cardContainer}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Total de Contactos</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> 45000 </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.cardContainer}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Duración media de las llamadas</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> 45000 </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.cardContainer}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Llamadas Exitosas</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> 45000 </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.cardContainer}`}>
                <div className={styles.card}>
                    <Typography variant="body1" align="center">Llamadas No Exitosas</Typography>
                    <Divider 
                    orientation="horizontal" 
                    variant="middle" 
                    flexItem 
                    sx={{ my: 2,backgroundColor: 'white',borderColor: 'white',}}/>
                    <Typography variant="h4" align="center"> 45000 </Typography>
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.histogramContainer}`}>
                <div className={styles.card}>
                    <Histogram 
                    data={dataEjemploHistograma} 
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
                    data={dataEjemploBarras}
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
                    />
                </div>
            </div>
            <div className={`${styles.graphContainer} ${styles.orderedContainer}`}>
                <div className={styles.card}>
                    <GroupedBarChart
                    data={data}
                    keys={["Si", "No", "Uknown"]}
                    title="Tasa por nivel de educación"
                    horizontal={true}
                    colors= {["#af9211ff", "#4ea8d8ff", "#6d1338ff"]}
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardGeneral
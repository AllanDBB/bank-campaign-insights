import React from "react";
import styles from "./Dashboard.module.css"
import TitleCard from "../../components/titleCard/TitleCard";
import ArrowButton from "../../components/arrowButton/ArrowButton";

function Dashboard() {
    return(
        <div className= {styles.container}>
            <div className= {styles.headTitleDiv}>
                <ArrowButton direction={'left'} onClick={null} size={'60px'}></ArrowButton>
                <TitleCard text={'Dashboard'} width={'50%'}></TitleCard>
                <ArrowButton direction={'right'} onClick={null} size={'60px'}></ArrowButton>
            </div>
            <div className={styles.exportDiv}>
                <button className={styles.exportButton}>Exportar</button>
            </div>
            <div className={styles.contentDiv}>
            </div>
        </div>
    );
}

export default Dashboard
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
            </div>
            <div className={styles.exportDiv}>
            </div>
            <div className={styles.contentDiv}>
            </div>
        </div>
    );
}

export default Dashboard
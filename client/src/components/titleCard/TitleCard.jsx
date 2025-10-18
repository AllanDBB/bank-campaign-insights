import React from "react";
import styles from "./TitleCard.module.css"

function TitleCard({text, width}){
    return(
        <div className={styles.card} style={{width: (width)||'100%'}}>
            <h2 className={styles.cardText}>{text}</h2>
        </div>
    )
}
export default TitleCard
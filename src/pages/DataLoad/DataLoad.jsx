import React, { useState } from "react";
import styles from "./DataLoad.module.css"
import { useNavigate } from "react-router-dom";
import TitleCard from "../../components/titleCard/TitleCard";

function DataLoad() {
    const [step, setStep] = useState('fileload')
    const navigate = useNavigate();

    const handleCargarDatos = () => {
        navigate("/app");
    };

    return (
        <div className={styles.mainContainer}>
            <TitleCard text={'Archivo de Origen'} width={'50%'}></TitleCard>
        </div>
    );
}

export default DataLoad
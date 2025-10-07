import React, { useState } from "react";
import styles from "./DataLoad.module.css"
import { useNavigate } from "react-router-dom";
import TitleCard from "../../components/titleCard/TitleCard";
import InputFileBox from "../../components/fileloadbox/InputFileBox";

function DataLoad() {
    const [step, setStep] = useState('fileload')
    const navigate = useNavigate();

    const handleCargarDatos = () => {
        navigate("/app");
    };

    return (
        <div className={styles.mainContainer}>
            <TitleCard text={'Archivo de Origen'} width={'50%'}></TitleCard>
            <InputFileBox width={"50%"} height={"60%"}></InputFileBox>
        </div>
    );
}

export default DataLoad
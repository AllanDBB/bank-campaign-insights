import React, { useState } from "react";
import styles from "./DataLoad.module.css"

import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';

import TitleCard from "../../components/titleCard/TitleCard";
import InputFileBox from "../../components/fileloadbox/InputFileBox";

function DataLoad() {
    const [step, setStep] = useState('fileload')
    const navigate = useNavigate();

    const handleDataLoad = () => {
        navigate('/app') 
        //setStep('progress')
    };

    const stepContent = () => {
        if (step === 'fileload') 
            return(<InputFileBox width={'50%'} height={'60%'} btnText={'Cargar Datos'} action={handleDataLoad}></InputFileBox>)
        else if (step === 'progress')
            return(<CircularProgress size={200} thickness={4} color='primary'/>)
        else if (step === 'log')
            return(<InputFileBox width={'50%'} height={'60%'} btnText={'Progreso'} action={handleDataLoad}></InputFileBox>)
    }

    return (
        <div className={styles.mainContainer}>
            <TitleCard text={'Archivo de Origen'} width={'50%'}></TitleCard>
            {stepContent()}
        </div>
    );
}

export default DataLoad
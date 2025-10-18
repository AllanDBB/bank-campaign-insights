import React, { useState } from "react";
import styles from "./DataLoad.module.css";

import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography, Alert, LinearProgress } from '@mui/material';

import TitleCard from "../../components/titleCard/TitleCard";
import InputFileBox from "../../components/fileloadbox/InputFileBox";
import { useFileUpload } from "../../hooks/useFileUpload";

function DataLoad() {
    const [step, setStep] = useState('fileload');
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const { upload, isUploading, uploadProgress, uploadResult, error, reset } = useFileUpload();

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const handleDataLoad = async () => {
        if (!selectedFile) {
            return;
        }

        setStep('progress');

        try {
            const result = await upload(selectedFile);
            setStep('success');

            setTimeout(() => {
                navigate('/app');
            }, 3000);
        } catch (err) {
            setStep('error');
        }
    };

    const handleRetry = () => {
        reset();
        setStep('fileload');
        setSelectedFile(null);
    };

    const stepContent = () => {
        if (step === 'fileload') {
            return (
                <InputFileBox
                    width={'50%'}
                    height={'60%'}
                    btnText={'Cargar Datos'}
                    action={handleDataLoad}
                    onFileSelect={handleFileSelect}
                />
            );
        }
        else if (step === 'progress') {
            return (
                <Box className={styles.progressContainer}>
                    <CircularProgress size={100} thickness={4} color='primary'/>
                    <Typography variant="h6" sx={{ mt: 3, color: 'white' }}>
                        Procesando archivo...
                    </Typography>
                    <Box sx={{ width: '60%', mt: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{ height: 8, borderRadius: 1 }}
                        />
                        <Typography variant="body2" sx={{ mt: 1, color: 'white', textAlign: 'center' }}>
                            {uploadProgress}%
                        </Typography>
                    </Box>
                </Box>
            );
        }
        else if (step === 'success') {
            return (
                <Box className={styles.resultContainer}>
                    <Alert severity="success" sx={{ mb: 3, width: '60%' }}>
                        Archivo cargado exitosamente
                    </Alert>
                    {uploadResult && (
                        <Box className={styles.statsContainer}>
                            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                Estadísticas de Carga
                            </Typography>
                            <Box className={styles.statRow}>
                                <Typography sx={{ color: '#ccc' }}>Total de registros:</Typography>
                                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {uploadResult.data.totalRecords.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box className={styles.statRow}>
                                <Typography sx={{ color: '#ccc' }}>Registros exitosos:</Typography>
                                <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                    {uploadResult.data.successfulInserts.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box className={styles.statRow}>
                                <Typography sx={{ color: '#ccc' }}>Registros fallidos:</Typography>
                                <Typography sx={{ color: '#f44336', fontWeight: 'bold' }}>
                                    {uploadResult.data.failedInserts.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box className={styles.statRow}>
                                <Typography sx={{ color: '#ccc' }}>Porcentaje de éxito:</Typography>
                                <Typography sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {uploadResult.data.successPercentage}%
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ mt: 3, color: '#aaa' }}>
                        Redirigiendo al dashboard...
                    </Typography>
                </Box>
            );
        }
        else if (step === 'error') {
            return (
                <Box className={styles.resultContainer}>
                    <Alert severity="error" sx={{ mb: 3, width: '60%' }}>
                        {error || 'Error al cargar el archivo'}
                    </Alert>
                    <button
                        className={styles.retryButton}
                        onClick={handleRetry}
                    >
                        Intentar de nuevo
                    </button>
                </Box>
            );
        }
    };

    return (
        <div className={styles.mainContainer}>
            <TitleCard text={'Archivo de Origen'} width={'50%'}/>
            {stepContent()}
        </div>
    );
}

export default DataLoad;

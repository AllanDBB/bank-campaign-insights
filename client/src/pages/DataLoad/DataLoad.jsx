import React, { useState } from "react";
import styles from "./DataLoad.module.css";

import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography, Alert, LinearProgress, Button } from '@mui/material';

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
            await upload(selectedFile);
            setStep('success');
        } catch (err) {
            setStep('error');
        }
    };

    const handleRetry = () => {
        reset();
        setStep('fileload');
        setSelectedFile(null);
    };

    const handleGoToDashboard = () => {
        navigate('/app');
    };

    const stepContent = () => {
        if (step === 'fileload') {
            return (
                <InputFileBox
                    width={'90%'}
                    height={'70%'}
                    btnText={'Cargar Datos'}
                    action={handleDataLoad}
                    onFileSelect={handleFileSelect}
                    style={{maxWidth: '600px'}}
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
                    <Typography variant="body2" sx={{ color: '#aaa', mt: 1, textAlign: 'center', px: 2 }}>
                        Por favor espere mientras validamos e insertamos los datos
                    </Typography>
                    <Box sx={{ width: '90%', maxWidth: '500px', mt: 3 }}>
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{
                                height: 10,
                                borderRadius: 1,
                                backgroundColor: 'rgba(68, 161, 180, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#44A1B4'
                                }
                            }}
                        />
                        <Typography variant="body2" sx={{ mt: 1, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                            {Math.round(uploadProgress)}%
                        </Typography>
                    </Box>
                </Box>
            );
        }
        else if (step === 'success') {
            return (
                <Box className={styles.resultContainer}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: '#4caf50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <Typography sx={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
                            ✓
                        </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 'bold', textAlign: 'center', px: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                        ¡Archivo cargado exitosamente!
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#aaa', mb: 2, textAlign: 'center', px: 2 }}>
                        Los datos han sido procesados y están listos para su análisis
                    </Typography>

                    {uploadResult && (
                        <Box className={styles.statsContainer}>
                            <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
                                Resumen de Carga
                            </Typography>

                            <Box className={styles.statsGrid}>
                                <Box className={styles.statCard}>
                                    <Typography className={styles.statLabel}>Total de Registros</Typography>
                                    <Typography className={styles.statValue}>
                                        {uploadResult.data.totalRecords.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box className={styles.statCard} sx={{ borderColor: '#4caf50' }}>
                                    <Typography className={styles.statLabel}>Insertados</Typography>
                                    <Typography className={styles.statValue} sx={{ color: '#4caf50' }}>
                                        {uploadResult.data.successfulInserts.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box className={styles.statCard} sx={{ borderColor: '#f44336' }}>
                                    <Typography className={styles.statLabel}>Fallidos</Typography>
                                    <Typography className={styles.statValue} sx={{ color: '#f44336' }}>
                                        {uploadResult.data.failedInserts.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box className={styles.statCard} sx={{ borderColor: '#44A1B4' }}>
                                    <Typography className={styles.statLabel}>Tasa de Éxito</Typography>
                                    <Typography className={styles.statValue} sx={{ color: '#44A1B4' }}>
                                        {uploadResult.data.successPercentage}%
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleGoToDashboard}
                        sx={{
                            mt: 4,
                            backgroundColor: '#44A1B4',
                            color: 'white',
                            padding: '12px 40px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#62c9dd'
                            }
                        }}
                    >
                        → Ir al Dashboard
                    </Button>
                </Box>
            );
        }
        else if (step === 'error') {
            return (
                <Box className={styles.resultContainer}>
                    <Alert severity="error" sx={{ mb: 3, width: '90%', maxWidth: '500px' }}>
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
            <TitleCard text={'Archivo de Origen'} width={'90%'} style={{maxWidth: '600px'}}/>
            {stepContent()}
        </div>
    );
}

export default DataLoad;

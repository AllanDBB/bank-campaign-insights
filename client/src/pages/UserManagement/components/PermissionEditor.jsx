import React from 'react';
import { Box, Typography, Button, FormControlLabel, Checkbox } from '@mui/material';
import s from './PermissionEditor.module.css';

const PERMISSION_LABELS = {
  viewDashboard: 'Ver Dashboard',
  viewTable: 'Ver Tabla de Datos',
  viewFilters: 'Ver Filtros',
  createFilters: 'Crear Filtros',
  uploadData: 'Cargar Datos',
  exportPDF: 'Exportar a PDF',
  exportExcel: 'Exportar a Excel',
  viewPrediction: 'Ver Modelo Predictivo',
  scorePrediction: 'Calificar Predicciones',
  viewCommercialAction: 'Ver Acciones Comerciales',
  compareWithAverage: 'Comparar con Promedio',
  viewJustification: 'Ver Justificaciones',
  simulateScenarios: 'Simular Escenarios',
  editConfig: 'Editar Configuración',
  manageUsers: 'Gestionar Usuarios',
};

export default function PermissionEditor({ roleName, permissions, onChange, onSave }) {
  const displayName = roleName === 'ejecutivo' ? 'Ejecutivo' : 'Gerente';

  const handleToggle = (permKey) => {
    onChange({ ...permissions, [permKey]: !permissions[permKey] });
  };

  return (
    <Box className={s.editor}>
      <Typography variant="h6" className={s.title}>
        {displayName}
      </Typography>

      <Box className={s.permissionsContainer}>
        {Object.entries(permissions).map(([key, value]) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={value || false}
                onChange={() => handleToggle(key)}
                sx={{
                  color: '#555',
                  '&.Mui-checked': {
                    color: '#44a1b4',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(68, 161, 180, 0.08)',
                  }
                }}
              />
            }
            label={PERMISSION_LABELS[key] || key}
            sx={{
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              backgroundColor: value ? 'rgba(68, 161, 180, 0.05)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(68, 161, 180, 0.1)',
              },
              '& .MuiTypography-root': {
                color: value ? '#44a1b4' : '#999',
                fontSize: '0.9rem',
                fontWeight: value ? '600' : '500',
                transition: 'all 0.2s ease',
                letterSpacing: '0.2px',
              }
            }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        onClick={() => onSave(roleName, permissions)}
        fullWidth
        sx={{
          backgroundColor: '#44a1b4',
          color: 'white',
          marginTop: '1rem',
          fontWeight: '600',
          padding: '0.75rem',
          fontSize: '0.95rem',
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(68, 161, 180, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#62c9dd',
            boxShadow: '0 4px 16px rgba(68, 161, 180, 0.4)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        Guardar Permisos
      </Button>
    </Box>
  );
}

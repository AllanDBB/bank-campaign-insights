import React, { useState, useEffect } from 'react';
import styles from '../Prediction.module.css';

/**
 * Componente para editar parámetros de predicción (RF-4 Decorator)
 * Permiso: editPredictionParams (SOLO GERENTE)
 *
 * Permite definir los valores paramétricos para determinar:
 * - Límite Baja -> Media
 * - Límite Media -> Alta
 * - Umbral decisión Sí/No
 */
export default function PredictionParametersPanel({ config, onSaveRanges, error, setError }) {
  const [rangeState, setRangeState] = useState({
    lowMax: 0.3,
    mediumMax: 0.6,
    acceptanceThreshold: 0.5
  });

  useEffect(() => {
    if (config) {
      const lowMax = config?.interpretationRanges?.[0]?.max ?? 0.3;
      const mediumMax = config?.interpretationRanges?.[1]?.max ?? 0.6;
      const acceptanceThreshold = config?.acceptanceThreshold ?? 0.5;
      setRangeState({ lowMax, mediumMax, acceptanceThreshold });
    }
  }, [config]);

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setRangeState((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSaveRanges = async () => {
    try {
      if (rangeState.lowMax >= rangeState.mediumMax || rangeState.mediumMax > 1 || rangeState.lowMax < 0) {
        setError("Los rangos deben ser crecientes y estar entre 0 y 1");
        return;
      }
      const updatedConfig = {
        acceptanceThreshold: rangeState.acceptanceThreshold,
        interpretationRanges: [
          {
            label: "Baja",
            min: 0,
            max: rangeState.lowMax,
            description: "Probabilidad baja de aceptación",
            color: "#ef4444"
          },
          {
            label: "Media",
            min: rangeState.lowMax,
            max: rangeState.mediumMax,
            description: "Probabilidad moderada, requiere seguimiento",
            color: "#f59e0b"
          },
          {
            label: "Alta",
            min: rangeState.mediumMax,
            max: 1,
            description: "Probabilidad alta, priorizar contacto",
            color: "#22c55e"
          }
        ]
      };

      await onSaveRanges(updatedConfig);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.managerCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.kicker}>Perfil gerencial · Decorator aplicado</p>
          <h2>Ajuste de rangos de interpretación</h2>
          <p className={styles.subtitle}>Define los umbrales para determinar si la predicción es Baja, Media o Alta.</p>
        </div>
        <button className={styles.primary} onClick={handleSaveRanges}>Guardar configuración</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.managerGrid}>
        <label className={styles.field}>
          <span>Límite Baja - Media</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            name="lowMax"
            value={rangeState.lowMax}
            onChange={handleRangeChange}
          />
        </label>
        <label className={styles.field}>
          <span>Límite Media - Alta</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            name="mediumMax"
            value={rangeState.mediumMax}
            onChange={handleRangeChange}
          />
        </label>
        <label className={styles.field}>
          <span>Umbral decisión Sí/No</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            name="acceptanceThreshold"
            value={rangeState.acceptanceThreshold}
            onChange={handleRangeChange}
          />
        </label>
      </div>

      {config && (
        <div className={styles.caption}>
          Última actualización: {config.lastUpdatedBy}
        </div>
      )}
    </div>
  );
}

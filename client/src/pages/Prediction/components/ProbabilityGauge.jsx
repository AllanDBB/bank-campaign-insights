import React from 'react';
import styles from '../Prediction.module.css';

/**
 * Componente para mostrar el medidor de probabilidad (RF-3)
 * Permiso: viewProbability
 */
export default function ProbabilityGauge({ result }) {
  if (!result) return null;

  const probabilityPercent = Math.round(result.probability * 100);

  return (
    <div className={styles.gaugeCard}>
      <div className={styles.meterLabel}>
        <span>Probabilidad</span>
        <strong>{probabilityPercent}%</strong>
      </div>
      <div className={styles.meterTrack}>
        <div className={styles.meterFill} style={{ width: `${probabilityPercent}%` }} />
      </div>
      <p className={styles.caption}>Modelo logístico</p>
    </div>
  );
}

import React from 'react';
import styles from '../Prediction.module.css';

export default function ProbabilityDisplay({ result }) {
  if (!result) {
    return (
      <div className={styles.placeholder}>
        Ingresa los datos y presiona "Calcular probabilidad" para ver resultados del modelo.
      </div>
    );
  }

  const probabilityPercent = Math.round(result.probability * 100);
  const interpretation = result?.interpretation?.range;
  const recommendation = result?.recommendation;

  return (
    <div className={styles.summaryGrid}>
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

      <div className={styles.interpretationBox}>
        <p className={styles.kicker}>Interpretación (Decorator)</p>
        <h3>{interpretation?.label || "Sin rango"}</h3>
        <p className={styles.description}>{interpretation?.description}</p>
        <p className={styles.chip}>
          Decisión: <strong>{result?.interpretation?.decision}</strong>
        </p>
        {result?.configSource && (
          <p className={styles.caption}>Fuente de rangos: {result.configSource}</p>
        )}
      </div>

      <div className={styles.recommendationBox}>
        <div>
          <p className={styles.kicker}>RF-6 Acción comercial</p>
          <h3>{recommendation?.label}</h3>
          <p className={styles.description}>{recommendation?.action}</p>
        </div>
        <div className={styles.rangeBadge}>
          Rango {Math.round((recommendation?.min ?? 0) * 100)}% - {Math.round((recommendation?.max ?? 1) * 100)}%
        </div>
      </div>
    </div>
  );
}

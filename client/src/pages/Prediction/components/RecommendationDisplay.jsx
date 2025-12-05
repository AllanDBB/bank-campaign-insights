import React from 'react';
import styles from '../Prediction.module.css';

export default function RecommendationDisplay({ result }) {
  if (!result?.recommendation) return null;

  const recommendation = result?.recommendation;

  return (
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
  );
}

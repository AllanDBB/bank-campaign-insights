import React from 'react';
import styles from '../Prediction.module.css';

export default function FactorAnalysisPanel({ result }) {
  if (!result?.justification) return null;

  return (
    <div className={styles.justificationBox}>
      <div>
        <p className={styles.kicker}>RF-5 Análisis de Factores</p>
        <h3>Factores más influyentes</h3>
      </div>
      <ul className={styles.justificationList}>
        {result.justification.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

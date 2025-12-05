import React from 'react';
import styles from '../Prediction.module.css';

export default function InterpretationDisplay({ result }) {
  if (!result?.interpretation) return null;

  const interpretation = result?.interpretation?.range;

  return (
    <div className={styles.interpretationBox}>
      <p className={styles.kicker}>RF-4 Interpretación (Decorator)</p>
      <h3>{interpretation?.label || "Sin rango"}</h3>
      <p className={styles.description}>{interpretation?.description}</p>
      <p className={styles.chip}>
        Decisión: <strong>{result?.interpretation?.decision}</strong>
      </p>
      {result?.configSource && (
        <p className={styles.caption}>Fuente de rangos: {result.configSource}</p>
      )}
    </div>
  );
}

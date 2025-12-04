import React from 'react';
import styles from '../Prediction.module.css';

/**
 * Componente para mostrar parámetros de acción comercial (RF-6 Decorator)
 * Permiso: editPredictionParams (SOLO GERENTE - lectura de valores configurados)
 *
 * Muestra las acciones comerciales recomendadas según los rangos de probabilidad
 */
export default function ActionParametersDisplay({ config }) {
  if (!config || !config.actionRanges) return null;

  return (
    <div className={styles.actionParametersBox}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.kicker}>Parámetros de Acción Comercial</p>
          <h3>Rangos y acciones recomendadas</h3>
        </div>
      </div>

      <div className={styles.actionGrid}>
        {config.actionRanges.map((range, idx) => (
          <div key={idx} className={styles.actionCard}>
            <div className={styles.actionRange}>
              {Math.round(range.min * 100)}% - {Math.round(range.max * 100)}%
            </div>
            <h4>{range.label}</h4>
            <p>{range.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

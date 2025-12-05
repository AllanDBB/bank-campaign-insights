import React from 'react';
import styles from '../Prediction.module.css';

export default function ContributionTable({ result }) {
  if (!result) return null;

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <p className={styles.kicker}>Contribuciones del modelo</p>
        <span>Top variables y peso en la probabilidad</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Valor</th>
            <th>Peso</th>
            <th>Contribución</th>
          </tr>
        </thead>
        <tbody>
          {result.contributions?.filter(row => row.feature !== "intercept").slice(0, 8).map((row, idx) => (
            <tr key={idx}>
              <td>{row.label}</td>
              <td>{row.value}</td>
              <td>{row.weight?.toFixed(3)}</td>
              <td className={row.contribution >= 0 ? styles.positive : styles.negative}>
                {row.contribution?.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

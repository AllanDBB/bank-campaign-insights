import React from 'react';
import styles from '../Prediction.module.css';
import { FILTER_FIELDS } from '../../../config/filterFields';

export default function ComparisonWithAverage({ result }) {
  if (!result?.contributions) return null;

  return (
    <div className={styles.comparisonCard}>
      <p className={styles.kicker}>RF-2.2 Prospecto según la media</p>
      <h2>Comparación con el promedio</h2>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
              <th>Promedio</th>
              <th>Interpretación</th>
            </tr>
          </thead>
          <tbody>
            {result.contributions?.filter(item => item.feature !== "intercept").map((item, idx) => {
              const isCategorical = [
                "job","marital","education",
                "hasCreditDefault","hasHousingLoan","hasPersonalLoan",
                "contactType","contactMonth","contactDayOfWeek","previousCampaignOutcome"
              ].includes(item.feature);
              let avgDisplay = "—";
              if (item.averageOrPercentage !== null && typeof item.averageOrPercentage === "number") {
                avgDisplay = isCategorical
                  ? `${item.averageOrPercentage.toFixed(2)}%`
                  : item.averageOrPercentage.toFixed(2);
              }
              let valueClass = styles.valueNeutral;
              if (!isCategorical && typeof item.value === "number" && typeof item.averageOrPercentage === "number") {
                if (item.value > item.averageOrPercentage) {
                  valueClass = styles.valueHigh;
                } else if (item.value < item.averageOrPercentage) {
                  valueClass = styles.valueLow;
                }
              }
              const avgClass = isCategorical
                ? styles.avgPercentage
                : styles.avgNumber;
              const interp = (item.interpretation || "").toLowerCase();
              let interpClass = styles.interpNeutral;
              if (interp.includes("arriba") || interp.includes("mayoría") || interp.includes("alto")) {
                interpClass = styles.interpHigh;
              } else if (interp.includes("debajo") || interp.includes("minoría") || interp.includes("bajo")) {
                interpClass = styles.interpLow;
              } else if (interp.includes("promedio") || interp.includes("neutral")) {
                interpClass = styles.interpMid;
              }
              return (
                <tr key={idx}>
                  <td>{FILTER_FIELDS[item.feature]?.label || item.label}</td>
                  <td className={valueClass}>
                    {String(item.value)}
                  </td>
                  <td className={avgClass}>
                    {avgDisplay}
                  </td>
                  <td className={interpClass}>
                    {item.interpretation || "Pendiente"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

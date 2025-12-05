import React, { useState } from 'react';
import styles from '../Prediction.module.css';
import { FILTER_FIELDS } from '../../../config/filterFields';

export default function ScenarioSimulationPanel({ form, onSimulate, result, scenarioResult, loading }) {
  const [scenarioItems, setScenarioItems] = useState([{ field: "contactType", value: "telephone" }]);

  const addScenarioItem = () => {
    const firstKey = Object.keys(FILTER_FIELDS)[0];
    const fieldConfig = FILTER_FIELDS[firstKey];

    setScenarioItems(prev => [
      ...prev,
      {
        field: firstKey,
        value: fieldConfig.type === "multiple" ? fieldConfig.options?.[0] || "" : 0
      }
    ]);
  };

  const removeScenarioItem = (index) => {
    setScenarioItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleScenario = async () => {
    const payload = { ...form };
    scenarioItems.forEach(item => {
      payload[item.field] = item.value;
    });
    await onSimulate(payload);
  };

  const probabilityPercent = result ? Math.round(result.probability * 100) : 0;

  if (!result) return null;

  return (
    <div className={styles.scenarioBox}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.kicker}>RF-7 ¿Qué pasaría si...?</p>
          <h3>Simular ajuste y recalcular</h3>
          <p className={styles.description}>Modifica una variable y compara cómo cambia la probabilidad.</p>
        </div>
        <button
          type="button"
          className={styles.primary}
          onClick={handleScenario}
          disabled={loading}
        >
          {loading ? "Calculando..." : "Recalcular"}
        </button>
      </div>

      <div className={styles.scenarioGridVertical}>
        {scenarioItems.map((item, index) => (
          <div key={index} className={styles.scenarioRow}>
            <label className={styles.field}>
              <span>Variable</span>
              <select
                value={item.field}
                onChange={(e) => {
                  const newField = e.target.value;
                  setScenarioItems(prev => {
                    const updated = [...prev];
                    updated[index].field = newField;
                    const config = FILTER_FIELDS[newField];
                    updated[index].value = config.type === "multiple" ? config.options?.[0] || "" : 0;
                    return updated;
                  });
                }}
              >
                {Object.keys(FILTER_FIELDS).map((key) => (
                  <option key={key} value={key}>
                    {FILTER_FIELDS[key].label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Valor simulado</span>
              {FILTER_FIELDS[item.field].type === "multiple" ? (
                <select
                  value={item.value}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setScenarioItems(prev => {
                      const updated = [...prev];
                      updated[index].value = newValue;
                      return updated;
                    });
                  }}
                >
                  {FILTER_FIELDS[item.field].options.map(opt => (
                    <option key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setScenarioItems(prev => {
                      const updated = [...prev];
                      updated[index].value = Number(newValue);
                      return updated;
                    });
                  }}
                />
              )}
            </label>
            {scenarioItems.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeScenarioItem(index)}
              >
                −
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={addScenarioItem}
        >
          + Añadir variable
        </button>
      </div>

      {scenarioResult && (
        <div className={styles.scenarioResult}>
          <div>
            <p className={styles.caption}>Actual</p>
            <strong>{probabilityPercent}%</strong>
          </div>
          <div className={styles.arrow}>→</div>
          <div>
            <p className={styles.caption}>Simulado</p>
            <strong>{Math.round(scenarioResult.probability * 100)}%</strong>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import styles from "./Prediction.module.css";
import LogisticProspectTemplate from "./templates/LogisticProspectTemplate";
import { getInterpretationConfig, updateInterpretationConfig } from "../../services/predictionService";

const defaultForm = {
  age: 38,
  job: "admin.",
  marital: "single",
  education: "university.degree",
  hasCreditDefault: "no",
  hasHousingLoan: "no",
  hasPersonalLoan: "no",
  contactType: "cellular",
  contactMonth: "may",
  contactDayOfWeek: "mon",
  contactDurationSeconds: 180,
  numberOfContacts: 1,
  daysSinceLastContact: 999,
  previousContactsCount: 0,
  previousCampaignOutcome: "unknown",
  employmentVariationRate: -1.8,
  consumerPriceIndex: 93.9,
  consumerConfidenceIndex: -40,
  euriborThreeMonthRate: 0.84,
  numberOfEmployees: 5167
};

const quickProfiles = [
  {
    label: "Joven digital",
    values: {
      age: 26,
      job: "technician",
      marital: "single",
      education: "university.degree",
      hasCreditDefault: "no",
      hasHousingLoan: "no",
      hasPersonalLoan: "no",
      contactType: "cellular",
      contactMonth: "mar",
      contactDayOfWeek: "wed",
      contactDurationSeconds: 120,
      numberOfContacts: 1,
      daysSinceLastContact: 999,
      previousContactsCount: 0,
      previousCampaignOutcome: "nonexistent"
    }
  },
  {
    label: "Cliente hipotecado",
    values: {
      age: 42,
      job: "management",
      marital: "married",
      education: "high.school",
      hasCreditDefault: "no",
      hasHousingLoan: "yes",
      hasPersonalLoan: "no",
      contactType: "cellular",
      contactMonth: "oct",
      contactDayOfWeek: "thu",
      contactDurationSeconds: 210,
      numberOfContacts: 2,
      daysSinceLastContact: 30,
      previousContactsCount: 1,
      previousCampaignOutcome: "failure"
    }
  },
  {
    label: "Senior jubilado",
    values: {
      age: 63,
      job: "retired",
      marital: "married",
      education: "professional.course",
      hasCreditDefault: "unknown",
      hasHousingLoan: "no",
      hasPersonalLoan: "unknown",
      contactType: "cellular",
      contactMonth: "sep",
      contactDayOfWeek: "tue",
      contactDurationSeconds: 240,
      numberOfContacts: 1,
      daysSinceLastContact: 999,
      previousContactsCount: 0,
      previousCampaignOutcome: "nonexistent"
    }
  }
];

function Prediction() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState(null);
  const [managerMode, setManagerMode] = useState(false);
  const [rangeState, setRangeState] = useState({
    lowMax: 0.3,
    mediumMax: 0.6,
    acceptanceThreshold: 0.5
  });
  const [scenarioField, setScenarioField] = useState("contactType");
  const [scenarioValue, setScenarioValue] = useState("telephone");
  const [scenarioResult, setScenarioResult] = useState(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(quickProfiles[0].label);

  const template = useMemo(() => new LogisticProspectTemplate(), []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getInterpretationConfig();
        if (response?.data) {
          setConfig(response.data);
          syncRangeState(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchConfig();
  }, []);

  const syncRangeState = (cfg) => {
    const lowMax = cfg?.interpretationRanges?.[0]?.max ?? 0.3;
    const mediumMax = cfg?.interpretationRanges?.[1]?.max ?? 0.6;
    const acceptanceThreshold = cfg?.acceptanceThreshold ?? 0.5;
    setRangeState({ lowMax, mediumMax, acceptanceThreshold });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await template.execute(form);
      if (response?.success) {
        setResult(response.data);
      } else {
        setError(response?.message || "No se pudo calcular la probabilidad");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(defaultForm);
    setResult(null);
    setError("");
    setStep(1);
  };

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
        ],
        actionRanges: [
          { label: "No priorizar", min: 0, max: rangeState.lowMax, action: "No priorizar seguimiento" },
          { label: "Seguimiento programado", min: rangeState.lowMax, max: rangeState.mediumMax, action: "Segundo intento / seguimiento programado" },
          { label: "Contacto inmediato", min: rangeState.mediumMax, max: 1, action: "Contacto inmediato / alta prioridad" }
        ]
      };

      const response = await updateInterpretationConfig(updatedConfig);
      if (response?.data) {
        setConfig(response.data);
        syncRangeState(response.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const probabilityPercent = result ? Math.round(result.probability * 100) : 0;
  const wizardSteps = ["Datos básicos", "Crédito", "Campaña y contexto"];

  const scenarioOptions = {
    contactType: ["cellular", "telephone"],
    contactMonth: ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
    contactDayOfWeek: ["mon","tue","wed","thu","fri"],
    job: ["admin.","technician","services","management","blue-collar","entrepreneur","retired","student","unemployed","self-employed","housemaid","unknown"]
  };

  const handleScenario = async () => {
    setScenarioLoading(true);
    try {
      const payload = { ...form, [scenarioField]: scenarioValue };
      const response = await template.execute(payload);
      if (response?.success) {
        setScenarioResult(response.data);
      }
    } catch (err) {
      setScenarioResult(null);
      setError(err.message);
    } finally {
      setScenarioLoading(false);
    }
  };
  const interpretation = result?.interpretation?.range;
  const recommendation = result?.recommendation;
  console.log("result:");
  console.log(result);
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.cardGroup}>
          <p className={styles.kicker}>Módulo predictivo · Regresión logística</p>
          <h1 className={styles.title}>Calcular probabilidad de aceptación</h1>
          <p className={styles.subtitle}>
            Ingresa los datos del prospecto para estimar la probabilidad, obtener interpretación,
            recomendación comercial y justificación.
          </p>
        </div>
        <div className={styles.managerToggle}>
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={managerMode}
              onChange={(e) => setManagerMode(e.target.checked)}
            />
            <span>Modo perfil gerencial (ajustar rangos con Decorator)</span>
          </label>
        </div>
      </div>

      <div className={styles.layout}>

        <div className={styles.cardGroup}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.kicker}>RF-2 Solicitud de datos</p>
                <h2>Datos del prospecto</h2>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.secondary} onClick={handleReset}>Reiniciar</button>
                <button type="submit" className={styles.primary} disabled={loading}>
                  {loading ? "Calculando..." : step < 3 ? "Siguiente" : "Calcular probabilidad"}
                </button>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.profileBar}>
              <div>
                <p className={styles.kicker}>Perfiles rápidos</p>
                <select value={selectedProfile} onChange={(e) => setSelectedProfile(e.target.value)}>
                  {quickProfiles.map((p) => (
                    <option key={p.label} value={p.label}>{p.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={() => {
                    const profile = quickProfiles.find(p => p.label === selectedProfile);
                    if (profile) setForm(prev => ({ ...prev, ...profile.values }));
                  }}
                >
                  Aplicar perfil
                </button>
              </div>
              <div className={styles.stepper}>
                {wizardSteps.map((s, idx) => (
                  <div key={s} className={`${styles.step} ${step === idx + 1 ? styles.stepActive : ''} ${step > idx + 1 ? styles.stepDone : ''}`}>
                    <span>{idx + 1}</span>
                    <small>{s}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.fieldsGrid}>
              {step === 1 && (
                <>
                  <label className={styles.field}>
                    <span>Edad</span>
                    <input type="number" name="age" value={form.age} onChange={handleChange} min="18" max="90" />
                  </label>
                  <label className={styles.field}>
                    <span>Profesión</span>
                    <select name="job" value={form.job} onChange={handleChange}>
                      <option value="admin.">Admin</option>
                      <option value="technician">Técnico</option>
                      <option value="services">Servicios</option>
                      <option value="management">Gerencia</option>
                      <option value="blue-collar">Blue collar</option>
                      <option value="entrepreneur">Emprendedor</option>
                      <option value="retired">Jubilado</option>
                      <option value="student">Estudiante</option>
                      <option value="unemployed">Desempleado</option>
                      <option value="self-employed">Independiente</option>
                      <option value="housemaid">Aseo</option>
                      <option value="unknown">Desconocido</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Estado civil</span>
                    <select name="marital" value={form.marital} onChange={handleChange}>
                      <option value="single">Soltero</option>
                      <option value="married">Casado</option>
                      <option value="divorced">Divorciado</option>
                      <option value="unknown">Desconocido</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Educación</span>
                    <select name="education" value={form.education} onChange={handleChange}>
                      <option value="basic.4y">Básica 4y</option>
                      <option value="basic.6y">Básica 6y</option>
                      <option value="basic.9y">Básica 9y</option>
                      <option value="high.school">Secundaria</option>
                      <option value="professional.course">Curso profesional</option>
                      <option value="university.degree">Universidad</option>
                      <option value="unknown">Desconocido</option>
                    </select>
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <label className={styles.field}>
                    <span>Default crédito</span>
                    <select name="hasCreditDefault" value={form.hasCreditDefault} onChange={handleChange}>
                      <option value="no">No</option>
                      <option value="yes">Sí</option>
                      <option value="unknown">Desconocido</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Hipoteca</span>
                    <select name="hasHousingLoan" value={form.hasHousingLoan} onChange={handleChange}>
                      <option value="no">No</option>
                      <option value="yes">Sí</option>
                      <option value="unknown">Desconocido</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Préstamo personal</span>
                    <select name="hasPersonalLoan" value={form.hasPersonalLoan} onChange={handleChange}>
                      <option value="no">No</option>
                      <option value="yes">Sí</option>
                      <option value="unknown">Desconocido</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Número de empleados (contexto)</span>
                    <input type="number" name="numberOfEmployees" value={form.numberOfEmployees} onChange={handleChange} />
                  </label>
                </>
              )}

              {step === 3 && (
                <>
                  <label className={styles.field}>
                    <span>Canal de contacto</span>
                    <select name="contactType" value={form.contactType} onChange={handleChange}>
                      <option value="cellular">Celular</option>
                      <option value="telephone">Teléfono fijo</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Mes de contacto</span>
                    <select name="contactMonth" value={form.contactMonth} onChange={handleChange}>
                      {["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].map((m) => (
                        <option key={m} value={m}>{m.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Día de contacto</span>
                    <select name="contactDayOfWeek" value={form.contactDayOfWeek} onChange={handleChange}>
                      {["mon","tue","wed","thu","fri"].map((d) => (
                        <option key={d} value={d}>{d.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Duración último contacto (seg)</span>
                    <input type="number" name="contactDurationSeconds" value={form.contactDurationSeconds} onChange={handleChange} min="0" />
                  </label>
                  <label className={styles.field}>
                    <span>Número de contactos</span>
                    <input type="number" name="numberOfContacts" value={form.numberOfContacts} onChange={handleChange} min="0" />
                  </label>
                  <label className={styles.field}>
                    <span>Días desde último contacto</span>
                    <input type="number" name="daysSinceLastContact" value={form.daysSinceLastContact} onChange={handleChange} min="0" />
                  </label>
                  <label className={styles.field}>
                    <span>Contactos previos</span>
                    <input type="number" name="previousContactsCount" value={form.previousContactsCount} onChange={handleChange} min="0" />
                  </label>
                  <label className={styles.field}>
                    <span>Resultado campaña anterior</span>
                    <select name="previousCampaignOutcome" value={form.previousCampaignOutcome} onChange={handleChange}>
                      <option value="success">Éxito</option>
                      <option value="failure">Fracaso</option>
                      <option value="nonexistent">No hubo</option>
                      <option value="unknown">Desconocido</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Var. empleo</span>
                    <input type="number" step="0.1" name="employmentVariationRate" value={form.employmentVariationRate} onChange={handleChange} />
                  </label>
                  <label className={styles.field}>
                    <span>IPC</span>
                    <input type="number" step="0.1" name="consumerPriceIndex" value={form.consumerPriceIndex} onChange={handleChange} />
                  </label>
                  <label className={styles.field}>
                    <span>Confianza consumidor</span>
                    <input type="number" step="0.1" name="consumerConfidenceIndex" value={form.consumerConfidenceIndex} onChange={handleChange} />
                  </label>
                  <label className={styles.field}>
                    <span>Euribor 3M</span>
                    <input type="number" step="0.01" name="euriborThreeMonthRate" value={form.euriborThreeMonthRate} onChange={handleChange} />
                  </label>
                </>
              )}
            </div>
            <div className={styles.wizardNav}>
              {step > 1 && (
                <button type="button" className={styles.secondary} onClick={() => setStep(step - 1)}>
                  Anterior
                </button>
              )}
              {step < 3 && (
                <button type="submit" className={styles.primary}>
                  Siguiente
                </button>
              )}
            </div>
          </form>
          {result && (
            <div className={styles.comparisonCard}>
              <p className={styles.kicker}>RF-2.2 Prospecto según la media</p>
              <h2>Comparación con el promedio</h2>
              <div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Variable</th>
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
                          <td>{item.label}</td>
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
          )}
        </div>



        <div className={styles.resultCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.kicker}>RF-3 · RF-4 · RF-6</p>
              <h2>Probabilidad, interpretación y acción</h2>
            </div>
          </div>

          {result ? (
            <>
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

              <div className={styles.justificationBox}>
                <div>
                  <p className={styles.kicker}>RF-5 Justificación</p>
                  <h3>Factores más influyentes</h3>
                </div>
                <ul className={styles.justificationList}>
                  {result.justification?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

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
                    disabled={scenarioLoading}
                  >
                    {scenarioLoading ? "Calculando..." : "Recalcular"}
                  </button>
                </div>
                <div className={styles.scenarioGrid}>
                  <label className={styles.field}>
                    <span>Variable</span>
                    <select value={scenarioField} onChange={(e) => {
                      const nextField = e.target.value;
                      setScenarioField(nextField);
                      const first = scenarioOptions[nextField]?.[0];
                      if (first) setScenarioValue(first);
                    }}>
                      <option value="contactType">Canal de contacto</option>
                      <option value="contactMonth">Mes</option>
                      <option value="contactDayOfWeek">Día</option>
                      <option value="job">Profesión</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Valor simulado</span>
                    <select value={scenarioValue} onChange={(e) => setScenarioValue(e.target.value)}>
                      {scenarioOptions[scenarioField].map((opt) => (
                        <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>
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
            </>
          ) : (
            <div className={styles.placeholder}>
              Ingresa los datos y presiona "Calcular probabilidad" para ver resultados del modelo.
            </div>
          )}
        </div>
      </div>



      {managerMode && (
        <div className={styles.managerCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.kicker}>Perfil gerencial · Decorator aplicado</p>
              <h2>Ajuste de rangos de interpretación y acción</h2>
              <p className={styles.subtitle}>Modifica los umbrales y persístelos para que el modelo aplique el decorador.</p>
            </div>
            <button className={styles.primary} onClick={handleSaveRanges}>Guardar configuración</button>
          </div>

          <div className={styles.managerGrid}>
            <label className={styles.field}>
              <span>Límite Baja - Media</span>
              <input type="number" step="0.01" min="0" max="1" name="lowMax" value={rangeState.lowMax} onChange={handleRangeChange} />
            </label>
            <label className={styles.field}>
              <span>Límite Media - Alta</span>
              <input type="number" step="0.01" min="0" max="1" name="mediumMax" value={rangeState.mediumMax} onChange={handleRangeChange} />
            </label>
            <label className={styles.field}>
              <span>Umbral decisión Sí/No</span>
              <input type="number" step="0.01" min="0" max="1" name="acceptanceThreshold" value={rangeState.acceptanceThreshold} onChange={handleRangeChange} />
            </label>
          </div>

          {config && (
            <div className={styles.caption}>
              Última actualización: {config.lastUpdatedBy}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Prediction;

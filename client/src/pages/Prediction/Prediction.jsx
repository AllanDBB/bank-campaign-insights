import React, { useEffect, useMemo, useState } from "react";
import styles from "./Prediction.module.css";
import LogisticProspectTemplate from "./templates/LogisticProspectTemplate";
import { getInterpretationConfig, updateInterpretationConfig } from "../../services/predictionService";
import { useAccessControl } from "../../hooks/useAccessControl";

// Componentes separados por permiso
import ProspectForm from "./components/ProspectForm";
import ProbabilityGauge from "./components/ProbabilityGauge";
import InterpretationDisplay from "./components/InterpretationDisplay";
import RecommendationDisplay from "./components/RecommendationDisplay";
import ComparisonWithAverage from "./components/ComparisonWithAverage";
import ContributionTable from "./components/ContributionTable";
import FactorAnalysisPanel from "./components/FactorAnalysisPanel";
import ScenarioSimulationPanel from "./components/ScenarioSimulationPanel";
import PredictionParametersPanel from "./components/PredictionParametersPanel";

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

function Prediction() {
  const access = useAccessControl();
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState(null);
  const [managerMode, setManagerMode] = useState(false);
  const [step, setStep] = useState(1);
  const [scenarioResult, setScenarioResult] = useState(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);

  const template = useMemo(() => new LogisticProspectTemplate(), []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getInterpretationConfig();
        if (response?.data) {
          setConfig(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, []);

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

  const handleScenario = async (payload) => {
    setScenarioLoading(true);
    try {
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

  const handleSaveRanges = async (updatedConfig) => {
    try {
      const response = await updateInterpretationConfig(updatedConfig);
      if (response?.data) {
        setConfig(response.data);
        setError("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.cardGroup}>
          <p className={styles.kicker}>Módulo predictivo · Regresión logística</p>
          <h1 className={styles.title}>Calcular probabilidad de aceptación</h1>
          <p className={styles.subtitle}>
            Ingresa los datos del prospecto para estimar la probabilidad, obtener interpretación,
            recomendación comercial y análisis.
          </p>
        </div>

        {/* PERMISO: editPredictionParams - Solo Gerente */}
        {access.can('editPredictionParams') && (
          <div className={styles.managerToggle}>
            <label className={styles.switchLabel}>
              <input
                type="checkbox"
                checked={managerMode}
                onChange={(e) => setManagerMode(e.target.checked)}
              />
              <span>Modo perfil gerencial</span>
            </label>
          </div>
        )}
      </div>

      <div className={styles.layout}>
        <div className={styles.cardGroup}>
          {/* PERMISO: viewProspects - Todos */}
          {access.can('viewProspects') ? (
            <ProspectForm
              form={form}
              onFormChange={setForm}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              step={step}
              onStepChange={setStep}
            />
          ) : (
            <div className={styles.error}>No tienes permisos para acceder al explorador de prospectos</div>
          )}

          {/* PERMISO: viewProspects - Comparación con promedio (RF-2.2) */}
          {access.can('viewProspects') && (
            <ComparisonWithAverage result={result} />
          )}
        </div>

        <div className={styles.resultCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.kicker}>Resultados</p>
              <h2>Probabilidad, interpretación y acción</h2>
            </div>
          </div>

          {result ? (
            <>
              {/* CONTENEDOR GRID PARA PERMISOS viewProbability, viewInterpretation, viewRecommendation */}
              <div className={styles.summaryGrid}>
                {/* PERMISO: viewProbability - Medidor RF-3 */}
                {access.can('viewProbability') ? (
                  <ProbabilityGauge result={result} />
                ) : (
                  <div className={styles.accessDenied}>No autorizado</div>
                )}

                {/* PERMISO: viewInterpretation - Interpretación RF-4 */}
                {access.can('viewInterpretation') ? (
                  <InterpretationDisplay result={result} />
                ) : (
                  <div className={styles.accessDenied}>No autorizado</div>
                )}

                {/* PERMISO: viewRecommendation - Recomendación RF-6 */}
                {access.can('viewRecommendation') ? (
                  <RecommendationDisplay result={result} />
                ) : (
                  <div className={styles.accessDenied}>No autorizado</div>
                )}
              </div>

              {/* PERMISO: viewFactorAnalysis - Análisis de Factores RF-5 - SOLO GERENTE */}
              {access.can('viewFactorAnalysis') && (
                <FactorAnalysisPanel result={result} />
              )}

              {/* TABLA DE CONTRIBUCIONES - Sin restricción específica */}
              <ContributionTable result={result} />

              {/* PERMISO: simulateScenarios - Simulación RF-7 - SOLO GERENTE */}
              {access.can('simulateScenarios') && (
                <ScenarioSimulationPanel
                  form={form}
                  onSimulate={handleScenario}
                  result={result}
                  scenarioResult={scenarioResult}
                  loading={scenarioLoading}
                />
              )}
            </>
          ) : (
            <div className={styles.placeholder}>
              Ingresa los datos y presiona "Calcular probabilidad" para ver resultados del modelo.
            </div>
          )}
        </div>
      </div>

      {/* PERMISO: editPredictionParams - Panel de parámetros gerencial - SOLO GERENTE */}
      {managerMode && access.can('editPredictionParams') && (
        <>
          <PredictionParametersPanel
            config={config}
            onSaveRanges={handleSaveRanges}
            error={error}
            setError={setError}
          />
          <ActionParametersDisplay config={config} />
        </>
      )}
    </div>
  );
}

export default Prediction;

import React, { useState } from 'react';
import styles from '../Prediction.module.css';
import { FILTER_FIELDS } from '../../../config/filterFields';

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

export default function ProspectForm({ form, onFormChange, onSubmit, loading, error, step, onStepChange }) {
  const [selectedProfile, setSelectedProfile] = useState(quickProfiles[0].label);

  const wizardSteps = ["Datos básicos", "Crédito", "Campaña y contexto"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ ...form, [name]: value });
  };

  const handleReset = () => {
    onFormChange({
      age: 38, job: "admin.", marital: "single", education: "university.degree",
      hasCreditDefault: "no", hasHousingLoan: "no", hasPersonalLoan: "no",
      contactType: "cellular", contactMonth: "may", contactDayOfWeek: "mon",
      contactDurationSeconds: 180, numberOfContacts: 1, daysSinceLastContact: 999,
      previousContactsCount: 0, previousCampaignOutcome: "unknown",
      employmentVariationRate: -1.8, consumerPriceIndex: 93.9,
      consumerConfidenceIndex: -40, euriborThreeMonthRate: 0.84, numberOfEmployees: 5167
    });
    onStepChange(1);
  };

  return (
    <form className={styles.formCard} onSubmit={onSubmit}>
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
              if (profile) onFormChange({ ...form, ...profile.values });
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
          <button type="button" className={styles.secondary} onClick={() => onStepChange(step - 1)}>
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
  );
}

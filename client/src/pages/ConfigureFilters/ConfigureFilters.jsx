import React, { useState } from "react";
import styles from "./ConfigureFilters.module.css";
import FilterRow from "../../components/filterRow/FilterRow";

function ConfigureFilters({ onClose }) {
    const [filters, setFilters] = useState([
        {
            id: 1,
            active: false,
            field: "Edad",
            type: "range",
            values: { min: "", max: "" }
        },
        {
            id: 2,
            active: false,
            field: "Profesión",
            type: "multiple",
            values: []
        },
        {
            id: 3,
            active: true,
            field: "Estado Civil",
            type: "multiple",
            values: ["Solteros"],
            highlighted: true
        },
        {
            id: 4,
            active: false,
            field: "Edad",
            type: "range",
            values: { min: "", max: "" }
        }
    ]);

    const handleToggleFilter = (id) => {
        setFilters(filters.map(filter => 
            filter.id === id ? { ...filter, active: !filter.active } : filter
        ));
    };

    const handleAddValue = (id, value) => {
        setFilters(filters.map(filter => {
            if (filter.id === id && filter.type === "multiple") {
                return { ...filter, values: [...filter.values, value] };
            }
            return filter;
        }));
    };

    const handleRemoveValue = (id, valueIndex) => {
        setFilters(filters.map(filter => {
            if (filter.id === id && filter.type === "multiple") {
                return { 
                    ...filter, 
                    values: filter.values.filter((_, index) => index !== valueIndex) 
                };
            }
            return filter;
        }));
    };

    const handleRangeChange = (id, field, value) => {
        setFilters(filters.map(filter => {
            if (filter.id === id && filter.type === "range") {
                return { 
                    ...filter, 
                    values: { ...filter.values, [field]: value } 
                };
            }
            return filter;
        }));
    };

    const handleApply = () => {
        console.log("Aplicando filtros:", filters.filter(f => f.active));
        // Aquí iría la lógica para aplicar los filtros
    };

    const handleSave = () => {
        console.log("Guardando filtros:", filters);
        // Aquí iría la lógica para guardar los filtros
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Configurar Filtros</h2>
                    <div className={styles.actionButtons}>
                        <button className={styles.applyButton} onClick={handleApply}>
                            Aplicar
                        </button>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Guardar
                        </button>
                    </div>
                </div>

                <div className={styles.tableHeader}>
                    <div className={styles.columnActivado}>Activado</div>
                    <div className={styles.columnCampo}>Campo</div>
                    <div className={styles.columnValores}>Valores</div>
                </div>

                <div className={styles.filtersContainer}>
                    {filters.map((filter) => (
                        <FilterRow
                            key={filter.id}
                            filter={filter}
                            onToggle={handleToggleFilter}
                            onAddValue={handleAddValue}
                            onRemoveValue={handleRemoveValue}
                            onRangeChange={handleRangeChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ConfigureFilters;

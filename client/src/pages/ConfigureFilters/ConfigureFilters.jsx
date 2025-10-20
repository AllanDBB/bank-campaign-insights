import React, { useState, useEffect } from "react";
import styles from "./ConfigureFilters.module.css";
import FilterRow from "../../components/filterRow/FilterRow";
import FilterSelector from "../../components/filterSelector/FilterSelector";
import ToastContainer from "../../components/toast/ToastContainer";
import filterService from "../../services/filterService";
import { useFilterSchema } from "../../hooks/useFilterSchema";
import { useToast } from "../../hooks/useToast";

function ConfigureFilters({ onClose }) {
    const [mode, setMode] = useState("select");
    const [currentFilterId, setCurrentFilterId] = useState(null);
    const [filterName, setFilterName] = useState("");
    const [filters, setFilters] = useState([]);
    const [originalState, setOriginalState] = useState(null);
    const { fields: availableFields, loading: schemaLoading, error: schemaError } = useFilterSchema();
    const { toasts, removeToast, success, error, warning } = useToast();

    const handleSelectFilter = (filter) => {
        setCurrentFilterId(filter._id);
        setFilterName(filter.filterName);

        const filterArray = [];
        let idCounter = 1;

        const filtersObject = filter.filters instanceof Map
            ? Object.fromEntries(filter.filters)
            : filter.filters;

        for (const [fieldKey, filterData] of Object.entries(filtersObject)) {
            const fieldConfig = availableFields.find(f => f.key === fieldKey);
            if (fieldConfig) {
                filterArray.push({
                    id: idCounter++,
                    active: filterData.active,
                    fieldKey: fieldKey,
                    field: fieldConfig.label,
                    type: filterData.type,
                    values: filterData.values,
                    options: fieldConfig.options
                });
            }
        }

        setFilters(filterArray);
        setOriginalState({
            filterName: filter.filterName,
            filters: JSON.parse(JSON.stringify(filterArray))
        });
        setMode("edit");
    };

    const handleCreateNew = () => {
        setCurrentFilterId(null);
        setFilterName("");
        setFilters([]);
        setOriginalState({
            filterName: "",
            filters: []
        });
        setMode("edit");
    };

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

    const handleFieldChange = (id, newFieldKey) => {
        const fieldConfig = availableFields.find(f => f.key === newFieldKey);
        if (!fieldConfig) return;

        setFilters(filters.map(filter => {
            if (filter.id === id) {
                return {
                    ...filter,
                    fieldKey: newFieldKey,
                    field: fieldConfig.label,
                    type: fieldConfig.type,
                    values: fieldConfig.type === "range" ? { min: "", max: "" } : [],
                    options: fieldConfig.options
                };
            }
            return filter;
        }));
    };

    const handleAddFilterRow = () => {
        if (availableFields.length === 0) return;

        const newId = filters.length > 0 ? Math.max(...filters.map(f => f.id)) + 1 : 1;
        const firstField = availableFields[0];

        setFilters([...filters, {
            id: newId,
            active: true,
            fieldKey: firstField.key,
            field: firstField.label,
            type: firstField.type,
            values: firstField.type === "range" ? { min: "", max: "" } : [],
            options: firstField.options
        }]);
    };

    const handleRemoveFilterRow = (id) => {
        setFilters(filters.filter(filter => filter.id !== id));
    };

    const hasChanges = () => {
        if (!originalState) return false;

        if (filterName !== originalState.filterName) return true;

        if (filters.length !== originalState.filters.length) return true;

        return JSON.stringify(filters) !== JSON.stringify(originalState.filters);
    };

    const handleApply = async () => {
        if (hasChanges()) {
            const saveResult = await handleSave();
            if (saveResult === false) {
                return;
            }
        }
        console.log("Aplicando filtros:", filters.filter(f => f.active));
        onClose();
    };

    const handleSave = async () => {
        if (!hasChanges()) {
            warning("No hay cambios para guardar");
            return false;
        }

        if (!filterName.trim()) {
            warning("Por favor ingrese un nombre para el filtro");
            return false;
        }

        if (filters.length === 0) {
            warning("Por favor agregue al menos un filtro");
            return false;
        }

        // Validate empty range fields
        const emptyRanges = filters.filter(filter => {
            if (filter.type === 'range') {
                return !filter.values.min || !filter.values.max;
            }
            return false;
        });

        if (emptyRanges.length > 0) {
            error("Todos los filtros de rango deben tener valores mínimo y máximo");
            return false;
        }

        // Validate range filters (min < max)
        const invalidRanges = filters.filter(filter => {
            if (filter.type === 'range') {
                const min = parseFloat(filter.values.min);
                const max = parseFloat(filter.values.max);
                return !isNaN(min) && !isNaN(max) && min > max;
            }
            return false;
        });

        if (invalidRanges.length > 0) {
            error("Hay filtros de rango con valores inválidos (min > max)");
            return false;
        }

        // Validate multiple value filters have at least one value
        const emptyMultiple = filters.filter(filter => {
            if (filter.type === 'multiple') {
                return !filter.values || filter.values.length === 0;
            }
            return false;
        });

        if (emptyMultiple.length > 0) {
            error("Los filtros de valores múltiples deben tener al menos un valor");
            return false;
        }

        const filtersMap = {};
        filters.forEach(filter => {
            filtersMap[filter.fieldKey] = {
                active: filter.active,
                type: filter.type,
                values: filter.values
            };
        });

        const payload = {
            filterName,
            filters: filtersMap
        };

        console.log("Saving filter with payload:", JSON.stringify(payload, null, 2));

        try {
            let response;
            if (currentFilterId) {
                console.log("Updating filter ID:", currentFilterId);
                response = await filterService.updateFilter(currentFilterId, payload);
                console.log("Filter updated successfully:", response);
                success("Filtro actualizado correctamente");

                setOriginalState({
                    filterName: filterName,
                    filters: JSON.parse(JSON.stringify(filters))
                });
            } else {
                console.log("Creating new filter");
                response = await filterService.createFilter(payload);
                console.log("Filter created successfully:", response);
                success("Filtro creado correctamente");

                setCurrentFilterId(response.data._id);
                setOriginalState({
                    filterName: filterName,
                    filters: JSON.parse(JSON.stringify(filters))
                });
            }
            return true;
        } catch (err) {
            console.error("Error saving filter:", err);
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            let errorMessage = "Error al guardar el filtro";
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            error(errorMessage);
            return false;
        }
    };

    const handleCancel = () => {
        if (mode === "edit") {
            setMode("select");
        } else {
            onClose();
        }
    };

    if (schemaLoading) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div className={styles.loadingContainer}>
                        <h3>Cargando campos disponibles...</h3>
                    </div>
                </div>
            </div>
        );
    }

    if (schemaError) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div className={styles.errorContainer}>
                        <h3>Error al cargar el schema</h3>
                        <p>{schemaError}</p>
                        <button onClick={onClose} className={styles.closeButton}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === "select") {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Configurar Filtros</h2>
                        <button className={styles.closeButton} onClick={onClose}>
                            ×
                        </button>
                    </div>
                    <FilterSelector
                        onSelectFilter={handleSelectFilter}
                        onCreateNew={handleCreateNew}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {currentFilterId ? "Editar Filtro" : "Crear Nuevo Filtro"}
                    </h2>
                    <button className={styles.closeButton} onClick={handleCancel}>
                        ×
                    </button>
                </div>

                <div className={styles.nameSection}>
                    <label className={styles.nameLabel}>Nombre del Filtro:</label>
                    <input
                        type="text"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        placeholder="Ej: Clientes Mayores de 30"
                        className={styles.nameInput}
                    />
                </div>

                <div className={styles.tableHeader}>
                    <div className={styles.columnActivado}>Activado</div>
                    <div className={styles.columnCampo}>Campo</div>
                    <div className={styles.columnValores}>Valores</div>
                    <div className={styles.columnActions}>Acciones</div>
                </div>

                <div className={styles.filtersContainer}>
                    {filters.length === 0 ? (
                        <div className={styles.emptyFilters}>
                            <p>No hay filtros configurados</p>
                            <button className={styles.addFirstButton} onClick={handleAddFilterRow}>
                                Agregar Primer Filtro
                            </button>
                        </div>
                    ) : (
                        filters.map((filter) => (
                            <FilterRow
                                key={filter.id}
                                filter={filter}
                                availableFields={availableFields}
                                onToggle={handleToggleFilter}
                                onAddValue={handleAddValue}
                                onRemoveValue={handleRemoveValue}
                                onRangeChange={handleRangeChange}
                                onFieldChange={handleFieldChange}
                                onRemove={handleRemoveFilterRow}
                            />
                        ))
                    )}
                </div>

                {filters.length > 0 && (
                    <div className={styles.addRowSection}>
                        <button className={styles.addRowButton} onClick={handleAddFilterRow}>
                            + Agregar Filtro
                        </button>
                    </div>
                )}

                <div className={styles.actionButtons}>
                    <button className={styles.cancelButton} onClick={handleCancel}>
                        {mode === "edit" ? "Volver" : "Cancelar"}
                    </button>
                    <button className={styles.applyButton} onClick={handleApply}>
                        Aplicar
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={!hasChanges()}
                    >
                        Guardar
                    </button>
                </div>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}

export default ConfigureFilters;

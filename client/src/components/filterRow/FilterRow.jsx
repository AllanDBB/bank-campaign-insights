import React, { useState, useRef, useEffect } from "react";
import Portal from "../portal/Portal";
import styles from "./FilterRow.module.css";

function FilterRow({
    filter,
    availableFields = [],
    onToggle,
    onAddValue,
    onRemoveValue,
    onRangeChange,
    onFieldChange,
    onRemove
}) {
    const [newValue, setNewValue] = useState("");
    const [rangeError, setRangeError] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef(null);

    const updateDropdownPosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (showSuggestions) {
            updateDropdownPosition();
            window.addEventListener('scroll', updateDropdownPosition, true);
            window.addEventListener('resize', updateDropdownPosition);

            return () => {
                window.removeEventListener('scroll', updateDropdownPosition, true);
                window.removeEventListener('resize', updateDropdownPosition);
            };
        }
    }, [showSuggestions]);

    const handleAddClick = () => {
        if (newValue.trim()) {
            onAddValue(filter.id, newValue.trim());
            setNewValue("");
            setShowSuggestions(false);
        }
    };

    const handleRangeInputChange = (field, value) => {
        onRangeChange(filter.id, field, value);

        const min = field === 'min' ? parseFloat(value) : parseFloat(filter.values.min);
        const max = field === 'max' ? parseFloat(value) : parseFloat(filter.values.max);

        if (!isNaN(min) && !isNaN(max) && min > max) {
            setRangeError("El valor mínimo debe ser menor que el máximo");
        } else {
            setRangeError("");
        }
    };

    const handleInputChange = (value) => {
        setNewValue(value);

        if (filter.options && filter.options.length > 0 && value.trim()) {
            const filtered = filter.options
                .filter(opt =>
                    !filter.values.includes(opt) &&
                    opt.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 5);

            setFilteredOptions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        onAddValue(filter.id, suggestion);
        setNewValue("");
        setShowSuggestions(false);
    };

    return (
        <div className={`${styles.filterRow} ${filter.highlighted ? styles.highlighted : ''}`}>
            <div className={styles.checkboxContainer}>
                <input
                    type="checkbox"
                    checked={filter.active}
                    onChange={() => onToggle(filter.id)}
                    className={styles.checkbox}
                />
            </div>

            <div className={styles.fieldName}>
                {availableFields.length > 0 && onFieldChange ? (
                    <select
                        value={filter.fieldKey || ""}
                        onChange={(e) => onFieldChange(filter.id, e.target.value)}
                        className={styles.fieldSelect}
                    >
                        {availableFields.map((field) => (
                            <option key={field.key} value={field.key}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span>{filter.field}</span>
                )}
            </div>

            <div className={styles.valuesContainer}>
                {filter.type === "range" ? (
                    <div className={styles.rangeWrapper}>
                        <div className={styles.rangeInputs}>
                            <div className={styles.rangeGroup}>
                                <label>Min:</label>
                                <input
                                    type="number"
                                    value={filter.values.min}
                                    onChange={(e) => handleRangeInputChange('min', e.target.value)}
                                    className={`${styles.rangeInput} ${rangeError ? styles.error : ''}`}
                                    placeholder=""
                                />
                            </div>
                            <div className={styles.rangeGroup}>
                                <label>Max:</label>
                                <input
                                    type="number"
                                    value={filter.values.max}
                                    onChange={(e) => handleRangeInputChange('max', e.target.value)}
                                    className={`${styles.rangeInput} ${rangeError ? styles.error : ''}`}
                                    placeholder=""
                                />
                            </div>
                        </div>
                        {rangeError && (
                            <div className={styles.errorMessage}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" fill="#e74c3c"/>
                                    <path d="M12 7v6M12 16v1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                {rangeError}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.multipleValues}>
                        <div className={styles.addValueContainer}>
                            <label>Añadir:</label>
                            <div className={styles.autocompleteWrapper}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => newValue && setShowSuggestions(filteredOptions.length > 0)}
                                    className={styles.addInput}
                                    placeholder={filter.options?.length > 0 ? "Escribir o seleccionar..." : "Escribir valor..."}
                                />
                                {showSuggestions && (
                                    <Portal>
                                        <div
                                            className={styles.suggestions}
                                            style={{
                                                position: 'absolute',
                                                top: `${dropdownPosition.top}px`,
                                                left: `${dropdownPosition.left}px`,
                                                width: `${dropdownPosition.width}px`,
                                                zIndex: 9999
                                            }}
                                        >
                                            {filteredOptions.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={styles.suggestionItem}
                                                    onClick={() => handleSuggestionClick(option)}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </Portal>
                                )}
                            </div>
                            <button
                                onClick={handleAddClick}
                                className={styles.addButton}
                                disabled={!newValue}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="9" fill="#4A9B9B" stroke="#4A9B9B" strokeWidth="2"/>
                                    <path d="M10 5 L10 15 M5 10 L15 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        {filter.values.length > 0 && (
                            <div className={styles.tagList}>
                                {filter.values.map((value, index) => (
                                    <span key={index} className={styles.tag}>
                                        {value}
                                        <button
                                            onClick={() => onRemoveValue(filter.id, index)}
                                            className={styles.removeTag}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {onRemove && (
                <div className={styles.actionsContainer}>
                    <button
                        onClick={() => onRemove(filter.id)}
                        className={styles.removeButton}
                        title="Eliminar filtro"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}

export default FilterRow;

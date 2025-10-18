import React, { useState } from "react";
import styles from "./FilterRow.module.css";

function FilterRow({ filter, onToggle, onAddValue, onRemoveValue, onRangeChange }) {
    const [newValue, setNewValue] = useState("");

    const handleAddClick = () => {
        if (newValue.trim()) {
            onAddValue(filter.id, newValue.trim());
            setNewValue("");
        }
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
                <span>{filter.field}</span>
            </div>

            <div className={styles.valuesContainer}>
                {filter.type === "range" ? (
                    <div className={styles.rangeInputs}>
                        <div className={styles.rangeGroup}>
                            <label>Min:</label>
                            <input
                                type="text"
                                value={filter.values.min}
                                onChange={(e) => onRangeChange(filter.id, 'min', e.target.value)}
                                className={styles.rangeInput}
                                placeholder=""
                            />
                        </div>
                        <div className={styles.rangeGroup}>
                            <label>Max:</label>
                            <input
                                type="text"
                                value={filter.values.max}
                                onChange={(e) => onRangeChange(filter.id, 'max', e.target.value)}
                                className={styles.rangeInput}
                                placeholder=""
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.multipleValues}>
                        <div className={styles.addValueContainer}>
                            <label>Añadir:</label>
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
                                className={styles.addInput}
                                placeholder=""
                            />
                            <button 
                                onClick={handleAddClick}
                                className={styles.addButton}
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
        </div>
    );
}

export default FilterRow;

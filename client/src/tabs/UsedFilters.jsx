import React, { useState, useEffect } from "react";
import styles from "./UsedFilters.module.css";
import TitleCard from "../components/titleCard/TitleCard";
import filterService from "../services/filterService";
import { translateField } from "../config/fieldTranslations";
import { useActiveFilter } from "../context/FilterContext";
import { CircularProgress } from "@mui/material";

function UsedFilters() {
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { applyFilter } = useActiveFilter();

    useEffect(() => {
        loadFilters();
    }, []);

    const loadFilters = async () => {
        try {
            setLoading(true);
            const response = await filterService.getAllFilters();
            if (response.success && response.data) {
                // Sort by createdAt descending (most recent first)
                const sortedFilters = response.data.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setFilters(sortedFilters);
            }
        } catch (err) {
            console.error("Error loading filters:", err);
            setError("Error al cargar el historial de filtros");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getFilterTags = (filterObj) => {
        const tags = [];
        
        if (filterObj.filters && typeof filterObj.filters === 'object') {
            // Handle Map structure from MongoDB
            const filtersMap = filterObj.filters instanceof Map 
                ? filterObj.filters 
                : new Map(Object.entries(filterObj.filters));

            filtersMap.forEach((value, key) => {
                if (value && value.active) {
                    tags.push(translateField(key));
                }
            });
        }
        
        return tags;
    };

    const getActiveFilterCount = (filterObj) => {
        let count = 0;
        
        if (filterObj.filters && typeof filterObj.filters === 'object') {
            const filtersMap = filterObj.filters instanceof Map 
                ? filterObj.filters 
                : new Map(Object.entries(filterObj.filters));

            filtersMap.forEach((value) => {
                if (value && value.active) {
                    count++;
                }
            });
        }
        
        return count;
    };

    const buildQueryParams = (filterObj) => {
        const params = new URLSearchParams();
        
        if (filterObj.filters && typeof filterObj.filters === 'object') {
            const filtersMap = filterObj.filters instanceof Map 
                ? filterObj.filters 
                : new Map(Object.entries(filterObj.filters));

            filtersMap.forEach((value, key) => {
                if (value && value.active) {
                    if (value.type === 'range') {
                        if (value.values.min !== undefined) {
                            params.append(`${key}_min`, value.values.min);
                        }
                        if (value.values.max !== undefined) {
                            params.append(`${key}_max`, value.values.max);
                        }
                    } else if (value.type === 'multiple' && Array.isArray(value.values)) {
                        value.values.forEach(val => {
                            params.append(key, val);
                        });
                    }
                }
            });
        }
        
        return params;
    };

    const handleApplyFilter = (filter) => {
        const queryParams = buildQueryParams(filter);
        applyFilter(filter._id, filter.filterName, queryParams);
        console.log(`Applied filter: ${filter.filterName}`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.titleSection}>
                    <TitleCard text="Historial de Consultas" width="100%" />
                </div>
                <div className={styles.loadingContainer}>
                    <CircularProgress size={60} style={{ color: '#44A1B4' }} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.titleSection}>
                    <TitleCard text="Historial de Consultas" width="100%" />
                </div>
                <div className={styles.errorContainer}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleSection}>
                <TitleCard text="Historial de Consultas" width="100%" />
            </div>

            {filters.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>📋</div>
                    <div className={styles.emptyStateText}>
                        No hay filtros guardados
                    </div>
                    <div className={styles.emptyStateSubtext}>
                        Los filtros que crees aparecerán aquí
                    </div>
                </div>
            ) : (
                <div className={styles.historyContainer}>
                    {filters.map((filter) => {
                        const tags = getFilterTags(filter);
                        const filterCount = getActiveFilterCount(filter);
                        
                        return (
                            <div key={filter._id} className={styles.filterCard}>
                                <div className={styles.leftSection}>
                                    <div className={styles.dateText}>
                                        {formatDate(filter.createdAt)}
                                    </div>
                                    
                                    <div className={styles.filterNameText}>
                                        {filter.filterName}
                                    </div>
                                    
                                    <div className={styles.filterInfo}>
                                        <div className={styles.filterCountBadge}>
                                            {filterCount}
                                        </div>
                                        <span className={styles.filterCountLabel}>
                                            Filtros:
                                        </span>
                                    </div>

                                    <div className={styles.tagsContainer}>
                                        {tags.map((tag, index) => (
                                            <div key={index} className={styles.filterTag}>
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.rightSection}>
                                    <button 
                                        className={styles.applyButton}
                                        onClick={() => handleApplyFilter(filter)}
                                        title="Aplicar filtro"
                                    >
                                        →
                                    </button>
                                    <div className={styles.applyText}>
                                        Aplicar Filtros
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UsedFilters;
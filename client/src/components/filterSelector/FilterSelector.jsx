import React, { useState, useEffect } from "react";
import styles from "./FilterSelector.module.css";
import ConfirmModal from "../confirmModal/ConfirmModal";
import filterService from "../../services/filterService";

function FilterSelector({ onSelectFilter, onCreateNew }) {
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilterId, setSelectedFilterId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const filtersPerPage = 10;

    useEffect(() => {
        loadFilters();
    }, []);

    const loadFilters = async () => {
        try {
            setLoading(true);
            const response = await filterService.getAllFilters();
            if (response.success) {
                setFilters(response.data || []);
            }
        } catch (error) {
            console.error("Error loading filters:", error);
            setFilters([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFilter = async () => {
        if (!selectedFilterId) return;

        try {
            const response = await filterService.getFilterById(selectedFilterId);
            if (response.success && response.data.length > 0) {
                onSelectFilter(response.data[0]);
            }
        } catch (error) {
            console.error("Error selecting filter:", error);
        }
    };

    const handleDeleteFilter = (filterId, e) => {
        e.stopPropagation();
        setConfirmDelete(filterId);
    };

    const confirmDeleteFilter = async () => {
        if (!confirmDelete) return;

        try {
            await filterService.deleteFilter(confirmDelete);
            loadFilters();
            if (selectedFilterId === confirmDelete) {
                setSelectedFilterId("");
            }
        } catch (error) {
            console.error("Error deleting filter:", error);
        } finally {
            setConfirmDelete(null);
        }
    };

    const filteredFilters = filters.filter(filter =>
        filter.filterName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastFilter = currentPage * filtersPerPage;
    const indexOfFirstFilter = indexOfLastFilter - filtersPerPage;
    const currentFilters = filteredFilters.slice(indexOfFirstFilter, indexOfLastFilter);
    const totalPages = Math.ceil(filteredFilters.length / filtersPerPage);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando filtros...</div>
            </div>
        );
    }

    if (filters.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h3>No hay filtros guardados</h3>
                    <p>Cree su primer filtro para comenzar</p>
                    <button className={styles.createButton} onClick={onCreateNew}>
                        Crear Nuevo Filtro
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Seleccionar Filtro</h3>
                <button className={styles.createButton} onClick={onCreateNew}>
                    + Nuevo
                </button>
            </div>

            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar filtro..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.filterList}>
                {currentFilters.map((filter) => (
                    <div
                        key={filter._id}
                        className={`${styles.filterItem} ${selectedFilterId === filter._id ? styles.selected : ''}`}
                        onClick={() => setSelectedFilterId(filter._id)}
                    >
                        <div className={styles.filterInfo}>
                            <span className={styles.filterName}>{filter.filterName}</span>
                            <span className={styles.filterDate}>
                                {new Date(filter.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <button
                            className={styles.deleteButton}
                            onClick={(e) => handleDeleteFilter(filter._id, e)}
                            title="Eliminar filtro"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={styles.pageButton}
                        title="Primera página"
                    >
                        ««
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={styles.pageButton}
                    >
                        ‹ Anterior
                    </button>
                    <span className={styles.pageInfo}>
                        Página {currentPage} de {totalPages}
                        <span className={styles.totalCount}> ({filteredFilters.length} {filteredFilters.length === 1 ? 'filtro' : 'filtros'})</span>
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={styles.pageButton}
                    >
                        Siguiente ›
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={styles.pageButton}
                        title="Última página"
                    >
                        »»
                    </button>
                </div>
            )}

            <div className={styles.actions}>
                <button
                    className={styles.selectButton}
                    onClick={handleSelectFilter}
                    disabled={!selectedFilterId}
                >
                    Seleccionar Filtro
                </button>
            </div>

            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={confirmDeleteFilter}
                title="Eliminar Filtro"
                message="¿Está seguro que desea eliminar este filtro? Esta acción es permanente y no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
        </div>
    );
}

export default FilterSelector;

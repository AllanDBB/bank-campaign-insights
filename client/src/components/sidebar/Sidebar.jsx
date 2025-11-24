import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import ConfigureFilters from "../../pages/ConfigureFilters/ConfigureFilters";
import { useActiveFilter } from "../../context/FilterContext";

export default function Sidebar() {
    const [showConfigureFilters, setShowConfigureFilters] = useState(false);
    const { activeFilter, clearFilter } = useActiveFilter();

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <h2 className={styles.mainTitle}>Dashboard Bancario</h2>
                </div>

                <nav className={styles.navigation}>
                    <ul className={styles.tabBar}>
                        <li>
                            <NavLink 
                                className={({isActive})=> isActive ? `${styles.tabElement} ${styles.activeTabElement}`: styles.tabElement}
                                to="/app/table">
                                Tabla
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                className={({isActive})=> isActive ? `${styles.tabElement} ${styles.activeTabElement}`: styles.tabElement}
                                to="/app/dashboard">
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                className={({isActive})=> isActive ? `${styles.tabElement} ${styles.activeTabElement}`: styles.tabElement}
                                to="/app/usedFilters">
                                Historial
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                className={({isActive})=> isActive ? `${styles.tabElement} ${styles.activeTabElement}`: styles.tabElement}
                                to="/app/prediction">
                                Modelo predictivo
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className={styles.filterSection}>
                    <h4 className={styles.filterTitle}>Filtro Activo</h4>
                    <div className={styles.filterName}>
                        {activeFilter.name || "Ninguno"}
                    </div>
                    {activeFilter.name && (
                        <button
                            className={styles.clearButton}
                            onClick={clearFilter}
                        >
                            Limpiar Filtro
                        </button>
                    )}
                    <button
                        className={styles.configButton}
                        onClick={() => setShowConfigureFilters(true)}
                    >
                        Configurar Filtros
                    </button>
                </div>
            </div>

            {showConfigureFilters && (
                <ConfigureFilters onClose={() => setShowConfigureFilters(false)} />
            )}
        </>
    );
}

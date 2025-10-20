import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import ConfigureFilters from "../../pages/ConfigureFilters/ConfigureFilters";

export default function Sidebar() {
    const [showConfigureFilters, setShowConfigureFilters] = useState(false);

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
                                to="/app/advanced">
                                Analítica Avanzada
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className={styles.filterSection}>
                    <h4 className={styles.filterTitle}>Filtro Activo</h4>
                    <div className={styles.filterName}>
                        Ninguno
                    </div>
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

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import ConfigureFilters from "../../pages/ConfigureFilters/ConfigureFilters";
import { useActiveFilter } from "../../context/FilterContext";
import { useAccessControl } from "../../hooks/useAccessControl";

export default function Sidebar() {
    const [showConfigureFilters, setShowConfigureFilters] = useState(false);
    const { activeFilter, clearFilter } = useActiveFilter();
    const navigate = useNavigate();
    const access = useAccessControl();

    const handleLogout = () => {
        // Clear all session data
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("permissions");

        // Redirect to login
        navigate("/login");
    };

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <h2 className={styles.mainTitle}>Dashboard Bancario</h2>
                    {access.userRole && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem',
                            paddingTop: '0.8rem',
                            borderTop: '1px solid #333',
                            marginTop: '0.8rem'
                        }}>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    padding: '0.6rem 0.8rem',
                                    fontSize: '0.9rem',
                                    backgroundColor: '#44A1B4',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '0.3rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontWeight: '500'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#2f8a99';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#44A1B4';
                                }}
                            >
                                Cargar Otro Archivo
                            </button>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                fontSize: '0.9rem'
                            }}>
                                <span style={{ color: '#999', flex: 1 }}>
                                    {access.isManager ? 'Gerente' : 'Ejecutivo'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        fontSize: '0.8rem',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #666',
                                        color: '#999',
                                        borderRadius: '0.3rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor = '#e74c3c';
                                        e.target.style.color = '#e74c3c';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = '#666';
                                        e.target.style.color = '#999';
                                    }}
                                >
                                    Salir
                                </button>
                            </div>
                        </div>
                    )}
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

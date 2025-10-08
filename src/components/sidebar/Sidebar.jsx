import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <h3 className={styles.mainTitle}>Dashboard Bancario</h3>
            <ul className={styles.tabBar}>
                <li><NavLink 
                    className={({isActive})=> isActive ? `${styles.tabElement} ${styles.activeTabElement}`: styles.tabElement}
                    to="/app/table">Tabla</NavLink></li>
                <li><NavLink 
                    className={({isActive})=> isActive ? `${styles.tabElement} ${styles.activeTabElement}`: styles.tabElement}
                    to="/app/dashboard">Dashboard</NavLink></li>
                <li><NavLink 
                    className={({isActive})=> isActive ? `${styles.tabElement} ${styles.activeTabElement}`: styles.tabElement}
                    to="/app/usedFilters">Historial</NavLink></li>
            </ul>
            <div>
                <h5>Filtros Activos</h5>
                <div><h5>0</h5></div>
                <NavLink to="#">Configurar Filtros</NavLink>
            </div>
        </div>
    );
}

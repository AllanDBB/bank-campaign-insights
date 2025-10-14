import React, { useState } from "react";
import ExportDashboard from "../pages/ExportDashboard/ExportDashboard";

function Dashboard() {
    const [showExportModal, setShowExportModal] = useState(false);

    return(
        <div style={{
            backgroundColor: "#060606", 
            width: "100%", 
            minHeight: "100%", 
            padding: "2rem",
            boxSizing: "border-box"
        }}>
            <div style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                <h1 style={{color: "white", margin: 0}}>Dashboard</h1>
                <button 
                    onClick={() => setShowExportModal(true)}
                    style={{
                        backgroundColor: "#4A9B9B",
                        color: "white",
                        border: "none",
                        padding: "0.8rem 2rem",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Exportar Dashboard
                </button>
            </div>
            
            {/* Aquí irá el contenido del dashboard */}
            <div style={{color: "white"}}>
                Contenido del dashboard...
            </div>

            {showExportModal && (
                <ExportDashboard onClose={() => setShowExportModal(false)} />
            )}
        </div>
    );
}

export default Dashboard
import React from "react";

function Table() {
    return(
        <div style={{
            backgroundColor: "#060606",
            width: "100%",
            minHeight: "100%",
            padding: "2rem",
            boxSizing: "border-box"
        }}>
            <h1 style={{color: "white"}}>Tabla</h1>
            <div style={{color: "white"}}>
                Contenido de la tabla...
            </div>
        </div>
    );
}

export default Table
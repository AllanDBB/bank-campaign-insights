import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
    ZAxis,
} from "recharts";
import { Typography } from "@mui/material";

/**
 * ScatterPlot component
 * @param {Object[]} data - Datos en formato [{ x: number, y: number, z?: number, name?: string }]
 * @param {string} [title="Diagrama de Dispersión"] - Título del gráfico
 * @param {string} [xLabel="Eje X"] - Etiqueta del eje X
 * @param {string} [yLabel="Eje Y"] - Etiqueta del eje Y
 * @param {string} [color="var(--primaryDark)"] - Color de los puntos
 * @param {boolean} [showGrid=true] - Mostrar u ocultar el grid
 * @param {boolean} [useZ=false] - Si true, el eje Z ajusta el tamaño del punto (para un scatter 3D plano)
 */
export default function ScatterPlot({
    data,
    title = "Diagrama de Dispersión",
    xLabel = "Eje X",
    yLabel = "Eje Y",
    color = "var(--primaryDark)",
    showGrid = true,
    useZ = false,
}) {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
            {title}
        </Typography>
        <div style={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
                margin={{ top: 10, right: 20, left: 40, bottom: 40 }}
            >
                {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
                <XAxis type="number" dataKey="x">
                <Label
                    value={xLabel}
                    position="insideBottom"
                    offset={-10}
                    style={{ fill: "#555", fontSize: 12 }}
                />
                </XAxis>
                <YAxis type="number" dataKey="y">
                <Label
                    value={yLabel}
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle", fill: "#555", fontSize: 12 }}
                />
                </YAxis>
                {useZ && <ZAxis type="number" dataKey="z" range={[50, 400]} />}
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                name="Datos"
                data={data}
                fill={color}
                opacity={0.8}
                shape="circle"
                />
            </ScatterChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}

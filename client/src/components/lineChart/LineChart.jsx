import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
} from "recharts";
import { Typography } from "@mui/material";

/**
 * MultiLineChart component
 * @param {Object[]} data - Ej: [{ name: string, serie1: number, serie2: number, ... }]
 * @param {string[]} lines - Nombres de las claves de las líneas a graficar
 * @param {string[]} [colors] - Colores personalizados para las líneas (si no se dan, se generan automáticamente)
 * @param {string} [title="Gráfico de Líneas"] - Título del gráfico
 * @param {string} [xLabel="Eje X"] - Etiqueta del eje X
 * @param {string} [yLabel="Eje Y"] - Etiqueta del eje Y
 * @param {boolean} [horizontal=false] - Si es true, el gráfico se renderiza horizontalmente
 */
export default function MultiLineChart({
  data,
  lines = [],
  colors = [],
  title = "Gráfico de Líneas",
  xLabel = "Eje X",
  yLabel = "Eje Y",
  horizontal = false,
}) {
    const defaultColors = [
        "#2563eb", 
        "#16a34a", 
        "#dc2626", 
        "#9333ea", 
        "#f59e0b", 
        "#0ea5e9", 
        "#f43f5e", 
        "#6366f1", 
    ];

    const lineColors =
        colors.length > 0
        ? colors
        : lines.map((_, i) => defaultColors[i % defaultColors.length]);

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
            {title}
        </Typography>
        <div style={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                layout={horizontal ? "vertical" : "horizontal"}
                margin={{ top: 10, right: 20, left: 40, bottom: 40 }}
            >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                {horizontal ? (
                <>
                    <XAxis type="number">
                    <Label
                        value={xLabel}
                        position="insideBottom"
                        offset={-10}
                        style={{ fill: "#555", fontSize: 12 }}
                    />
                    </XAxis>
                    <YAxis type="category" dataKey="name">
                    <Label
                        value={yLabel}
                        angle={-90}
                        position="insideLeft"
                        style={{ textAnchor: "middle", fill: "#555", fontSize: 12 }}
                    />
                    </YAxis>
                </>
                ) : (
                <>
                    <XAxis type="category" dataKey="name">
                    <Label
                        value={xLabel}
                        offset={-25}
                        position="insideBottom"
                        style={{ fill: "#555", fontSize: 12 }}
                    />
                    </XAxis>
                    <YAxis type="number">
                    <Label
                        value={yLabel}
                        angle={-90}
                        position="insideLeft"
                        style={{ textAnchor: "middle", fill: "#555", fontSize: 12 }}
                    />
                    </YAxis>
                </>
                )}
                <Tooltip />
                <Legend />
                {lines.map((key, index) => (
                <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={lineColors[index]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
                ))}
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}

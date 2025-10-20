import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Typography } from "@mui/material";

/**
 * GroupedBarChart component (horizontal or vertical)
 * @param {Object[]} data - Array de objetos con cada grupo y sus valores
 * @param {string[]} keys - Nombres de las categorías (ej. ["España", "Colombia", "México"])
 * @param {string[]} colors - Colores para cada categoría
 * @param {string} title - Título del gráfico
 * @param {boolean} [horizontal=false] - Render horizontal or vertical
 */
export default function GroupedBarChart({
    data,
    keys,
    colors = ["#44A1B4", "#0D4A6B", "#710468"],
    title = "Gráfico de Barras Agrupadas",
    horizontal = false,
}) {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <div style={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout={horizontal ? "vertical" : "horizontal"}
                        margin={{ top: 20, right: 20, left: 40, bottom: 40 }}
                    >
                        {horizontal ? (
                            <>
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="group" />
                            </>
                        ) : (
                            <>
                                <XAxis dataKey="group" />
                                <YAxis type="number" tickCount={6} />
                            </>
                        )}
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        {keys.map((key, index) => (
                            <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

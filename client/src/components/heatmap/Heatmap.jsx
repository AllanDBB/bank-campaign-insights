import React from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    XAxis,
    YAxis,
    Tooltip,
    Rectangle,
    CartesianGrid
} from "recharts";
import { Typography } from "@mui/material";

/**
 * Heatmap component
 * @param {Array} data - Array of rows, each row is { name: string, values: number[] }
 * @param {string[]} columns - Labels for columns
 * @param {string} title - Chart title
 * @param {function} colorScale - Function(value) => color
 */
export default function Heatmap({ data, columns, title = "Heatmap", colorScale }) {

    const defaultColorScale = (value) => {
        const max = Math.max(...data.flatMap(d => d.values));
        const intensity = Math.floor((value / max) * 255);
        return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    };

    const scale = colorScale || defaultColorScale;

    return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <Typography variant="body1" align="center" sx={{ mb: 1 }}>
        {title}
    </Typography>
    <div style={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            {columns.map((col, colIndex) =>
            data.map((row, rowIndex) => (
                <Rectangle
                key={`${rowIndex}-${colIndex}`}
                x={(colIndex / columns.length) * 100 + "%"}
                y={rowIndex * (100 / data.length) + "%"}
                width={100 / columns.length + "%"}
                height={100 / data.length + "%"}
                fill={scale(row.values[colIndex])}
                stroke="#fff"
                />
            ))
            )}
        </ComposedChart>
        </ResponsiveContainer>
    </div>
    </div>
    );
}

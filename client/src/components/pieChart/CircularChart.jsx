import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Typography } from "@mui/material";

/**
 * CircularChart component with automatic color generation
 * @param {Object[]} data - [{ name: string, value: number }]
 * @param {string} [title] - Chart title
 * @param {string[]} [colors] - Array of colors for slices (auto-generated if not enough)
 * @param {boolean} [showLegend=true] - Show or hide legend
 * @param {boolean} [isDonut=false] - Make it a donut chart
 */
export default function CircularChart({
    data,
    title = "Circular Chart",
    colors = ["#4f46e5", "#45a8ad", "#8b5cf6", "#f59e0b", "#ef4444"],
    showLegend = true,
    isDonut = false,
}) {
    const generateColors = (num) => {
        const generated = [];
        const step = 360 / num;
        for (let i = 0; i < num; i++) {
            generated.push(`hsl(${i * step}, 70%, 50%)`);
        }
        return generated;
    };

    const finalColors = colors.length >= data.length ? colors : generateColors(data.length);
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
            {title}
        </Typography>
        <div style={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="60%"
                innerRadius={isDonut ? "10%" : 0}
                paddingAngle={2}
                label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={finalColors[index % finalColors.length]} stroke="none" />
                    ))}
                </Pie>
                <Tooltip
                formatter={(value) => `${value}`}
                />
                {showLegend && <Legend verticalAlign="bottom" height={36} />}
            </PieChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}

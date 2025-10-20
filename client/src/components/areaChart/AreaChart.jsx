import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { Typography } from "@mui/material";

/**
 * AreaChartComponent
 * @param {Array} data - Array of objects [{ name: string, value: number }]
 * @param {string} [title] - Chart title
 * @param {string} [xLabel] - Label for X-axis
 * @param {string} [yLabel] - Label for Y-axis
 * @param {string} [areaColor="#4f46e5"] - Fill color of the area
 * @param {string} [strokeColor="#3b82f6"] - Line color
 */
export default function AreaChartComponent({
    data,
    title = "Area Chart",
    xLabel = "X-axis",
    yLabel = "Y-axis",
    areaColor = "rgba(79, 70, 229, 0.3)",
    strokeColor = "#4f46e5",
}) {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
            {title}
        </Typography>
        <div style={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" label={{ value: xLabel, position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 10 }} />
                <Tooltip />
                <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                fill={areaColor}
                fillOpacity={0.6}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}

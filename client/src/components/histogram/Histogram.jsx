import React from "react";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Label,
} from "recharts";
import { Typography } from "@mui/material";

/**
 * Histogram component (vertical or horizontal)
 * @param {Object[]} data - [{ name: string, value: number, lineValue?: number }]
 * @param {string} [title] - Chart title
 * @param {string} [xLabel] - X-axis label
 * @param {string} [yLabel] - Y-axis label
 * @param {string} [barColor="#4f46e5"] - Bar color
 * @param {string} [lineColor="#22c55e"] - Line color
 * @param {boolean} [showLine=true] - Show or hide line
 * @param {boolean} [showBars=true] - Show or hide bars
 * @param {boolean} [horizontal=false] - Render chart horizontally
 */
export default function Histogram({
    data,
    title = "Histograma",
    xLabel = "Eje X",
    yLabel = "Eje Y",
    barColor = "var(--primaryDark)",
    lineColor = "var(--primaryLight)",
    showLine = true,
    showBars = true,
    horizontal = false,
}) {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <div style={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
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
                        {showBars && <Bar dataKey="value" fill={barColor} radius={[5, 5, 0, 0]} />}
                        {showLine && (
                            <Line type="monotone" dataKey="lineValue" stroke={lineColor} strokeWidth={2} dot={{ r: 3 }} />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

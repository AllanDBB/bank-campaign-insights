import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Label,
    Legend
} from "recharts";
import { Typography } from "@mui/material";

/**
 * TimeSeriesChart (Mensual, sin dayjs)
 * Acepta fechas completas o abreviaciones de mes (ene, feb, mar, jul, etc.)
 *
 * @param {Object[]} data - [{ date: string | Date, [seriesKey: string]: number }]
 * @param {string[]} [seriesKeys=["value"]] - Claves de las series a mostrar
 * @param {string[]} [colors] - Colores opcionales para las líneas
 * @param {string} [title="Serie temporal mensual"]
 * @param {string} [yLabel="Valor"]
 * @param {number} [year=2025] - Año que se usará si el valor es un mes abreviado
 */
export default function TimeSeriesChart({
    data,
    seriesKeys = ["value"],
    colors = ["#3b82f6", "#c52261ff", "#f97316", "#a855f7"],
    title = "Serie temporal mensual",
    yLabel = "Valor",
    year = new Date().getFullYear(),
}) {
    const monthMap = {
        ene: 0, jan: 0,
        feb: 1,
        mar: 2,
        abr: 3, apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        ago: 7, aug: 7,
        sep: 8, sept: 8,
        oct: 9,
        nov: 10,
        dic: 11, dec: 11,
    };
    const monthLabels = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    const normalizeDate = (value) => {
        if (value instanceof Date) return value;
        if (typeof value === "string") {
        const lower = value.trim().toLowerCase();
        if (monthMap.hasOwnProperty(lower.slice(0, 3))) {
            const monthIndex = monthMap[lower.slice(0, 3)];
            return new Date(year, monthIndex, 1);
        }
        const match = value.match(/^(\d{4})-(\d{1,2})/);
        if (match) {
            const y = parseInt(match[1]);
            const m = parseInt(match[2]) - 1;
            return new Date(y, m, 1);
        }
        }
        return null;
    };

    const formattedData = data
    .map((d) => {
        const dateObj = normalizeDate(d.date);
        if (!dateObj) return null;
        return {
            ...d,
            dateObj,
            monthLabel: monthLabels[dateObj.getMonth()],
            monthIndex: dateObj.getMonth(),
        };
    })
    .filter(Boolean)
    .sort((a, b) => a.monthIndex - b.monthIndex);

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
            {title}
        </Typography>
        <div style={{ flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={formattedData}
                margin={{ top: 10, right: 30, left: 40, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="monthLabel">
                </XAxis>
                <YAxis
                allowDecimals={true}
                tickCount={12}>
                <Label
                    value={yLabel}
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle", fill: "#555", fontSize: 12 }}
                />
                </YAxis>
                <Tooltip
                labelFormatter={(label) => `Mes: ${label}`}
                formatter={(v, name) => [v, name]}
                />
                <Legend
                verticalAlign="bottom"
                height={36}
                iconType="line"
                wrapperStyle={{ fontSize: 15 }}
                />
                {seriesKeys.map((key, i) => (
                <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[i % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                />
                ))}
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}

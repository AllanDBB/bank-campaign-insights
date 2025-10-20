import React from "react";
import {
  BarChart,
  Bar,
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
 * StackedBarChart component
 * @param {Object[]} data - [{ name: string, serie1: number, serie2: number, ... }]
 * @param {string[]} series - Claves de las series que se apilarán
 * @param {string[]} [colors] - Colores personalizados para las series (si no se dan, se generan automáticamente)
 * @param {string} [title="Gráfico de Barras Apiladas"] - Título del gráfico
 * @param {string} [xLabel="Eje X"] - Etiqueta del eje X
 * @param {string} [yLabel="Eje Y"] - Etiqueta del eje Y
 * @param {boolean} [horizontal=false] - Si true, renderiza las barras horizontalmente
 */
export default function StackedBarChart({
  data,
  series = [],
  colors = [],
  title = "Gráfico de Barras Apiladas",
  xLabel = "",
  yLabel = "Eje Y",
  horizontal = false,
}) {
  const defaultColors = [
    "#2563eb",
    "#196655ff",
    "#771727ff",
    "#dc2626",
    "#9333ea",
    "#f59e0b",
    "#0ea5e9",
    "#6366f1",
  ];

  const seriesColors =
    colors.length > 0
      ? colors
      : series.map((_, i) => defaultColors[i % defaultColors.length]);

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
            {series.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="stack"
                fill={seriesColors[index]}
                radius={horizontal ? [5, 5, 5, 5] : [5, 5, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

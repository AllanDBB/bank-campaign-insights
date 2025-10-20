import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Typography } from "@mui/material";

export default function Heatmap({ data, columns, title = "Heatmap", colorScale }) {
  const defaultColorScale = (value) => {
    const max = Math.max(...data.flatMap(d => d.values));
    const intensity = Math.floor((value / max) * 255);
    return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
  };

  const scale = colorScale || defaultColorScale;

  // Transformamos los datos para que cada columna sea una propiedad
  const transformedData = data.map((row) =>
    columns.reduce(
      (acc, col, i) => ({ ...acc, [col]: row.values[i], name: row.name }),
      {}
    )
  );

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="body1" align="center" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <div style={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            barGap={2}          // separa columnas
            barCategoryGap={0}  // evita espacio extra entre filas
          >
            {/* Ocultamos el eje X ya que vamos a poner labels manuales */}
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" />
            <Tooltip />

            {columns.map((col) => (
              <Bar key={col} dataKey={col} stackId="a" barSize={30}>
                {transformedData.map((row, i) => (
                  <Cell key={i} fill={scale(row[col])} />
                ))}
                {/* Mostrar valor dentro de cada celda */}
                <LabelList dataKey={col} position="inside" fill="#000" />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Labels de columnas debajo del heatmap */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          marginTop: "5px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {columns.map((col) => (
          <div key={col}>{col}</div>
        ))}
      </div>
    </div>
  );
}

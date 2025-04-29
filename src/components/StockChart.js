import React from "react";
import ChartTooltip from "./ChartTooltip";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush
} from "recharts";

const colors = ["#ff7300", "#387908", "#8884d8", "#ffc658", "#82ca9d", "#d0ed57"];
const getColor = (index) => colors[index % colors.length];

export default function Stock_chart({ data, comparisonData, selectedSymbol }) {
    if (!data || data.length === 0) return null;

    return (
      <ResponsiveContainer width="100%">
      <LineChart
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} orientation="right" />
        <Tooltip content={<ChartTooltip />} />

        <Line
          type="monotone"
          data={data}
          dataKey="Normalized"
          stroke="#4ade80"
          strokeWidth={2}
          dot={false}
        />

        {Object.entries(comparisonData || {}).map(([symbol, compData], index) => (
          <Line
            key={symbol}
            type="monotone"
            data={compData}
            dataKey="Normalized"
            stroke={getColor(index)}
            strokeWidth={2}
            dot={false}
          />
        ))}

        <Brush dataKey="Date" height={30} stroke="#10b981" />
      </LineChart>
      </ResponsiveContainer>
    );
}
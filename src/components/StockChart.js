import React from "react";
import ChartTooltip from "./ChartTooltip";
import {
    LineChart, AreaChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush
} from "recharts";

export default function Stock_chart({ data, comparisonData, selectedSymbol }) {
  const colors = ["#ff7300", "#387908", "#8884d8", "#ffc658", "#82ca9d", "#d0ed57"];
  const getColor = (index) => colors[index % colors.length];
    if (!data || data.length === 0) return null;

    return (
      <ResponsiveContainer width="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3"  />
          <XAxis dataKey="Date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} orientation="right" />
          <Tooltip content={<ChartTooltip />}/>  {/* CUSTOM  TOOLTIP */}

          {Object.entries(comparisonData).map(([symbol, compData], index) => 
            symbol !== selectedSymbol && (
            <Area key={symbol} type="monotone" dataKey="Close" stroke={getColor(index)} fill="none" strokeWidth={2} dot={false} />
            )
          )}
          <Brush dataKey="Date" height={30} stroke="#10b981" />
        </AreaChart>
      </ResponsiveContainer>
    );
}
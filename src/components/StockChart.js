import React from "react";
import ChartTooltip from "./ChartTooltip";
import {
    LineChart, AreaChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush
} from "recharts";

export default function Stock_chart({ data }) {
    if (!data || data.length === 0) return null;

    return (
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3"  />
          <XAxis dataKey="Date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
          <Tooltip content={<ChartTooltip />}/>  {/* CUSTOM  TOOLTIP */}
          <Area type="monotone" dataKey="Close" stroke="#4ade80" fill="url(#colorClose)" strokeWidth={2} dot={false} />
          <Brush dataKey="Date" height={30} stroke="#10b981" />
        </AreaChart>
      </ResponsiveContainer>
    );
}
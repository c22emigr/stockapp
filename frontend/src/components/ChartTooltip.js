
const ChartTooltip = ({ active, payload, label}) => {
    if (active && payload && payload.length > 0) {

    const close = payload.find(p => p.dataKey === "Close")?.value;
    const change = payload[0].payload.Pct_Change;

    return (
      <div className="p-2 bg-white dark:bg-gray-800 dark:text-gray-100 rounded shadow text-sm">
        <p><strong>{label}</strong></p>
        <p>Close: {close?.toFixed(2)}</p>
        <p>Change: {change?.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
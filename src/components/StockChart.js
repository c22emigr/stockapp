import React from "react";
import Plot from "react-plotly.js";

export default function StockChart({ data, comparisonData, selectedSymbol, darkMode }) {
  if ((!data || data.length === 0) && (!comparisonData || Object.keys(comparisonData).length === 0)) {
    return <div className="text-white text-sm p-2">Loading chart...</div>;
  }
  const isDarkMode = darkMode;

  const isLoading =
  !data || data.length === 0 || // ensure main stock data is loaded
  (comparisonData &&
    Object.entries(comparisonData).some(
      ([symbol, series]) =>
        symbol !== selectedSymbol && (!series || series.length === 0)
    ));

  if (isLoading) {
    return <div className="text-white text-sm p-2">Loading chart...</div>;
  }

  const traces = [];

  if (data && data.length > 0) {
    traces.push({
      x: data.map(d => d.Date),
      y: data.map(d => d.Normalized),
      name: selectedSymbol,
      type: "scatter",
      mode: "lines",
      line: { color: "#4ade80", width: 2 }
    });
  }

  // Comparison lines
  Object.entries(comparisonData || {}).forEach(([symbol, series], i) => {
    if (!series?.length || symbol === selectedSymbol) return; // skip if symbol already exists
    traces.push({
      x: series.map(d => d.Date),
      y: series.map(d => d.Normalized),
      name: symbol,
      type: "scatter",
      mode: "lines",
      line: {
        color: ["#ff7300", "#387908", "#8884d8", "#ffc658", "#82ca9d", "#deed57"][i % 6],
        width: 2
      }
    });
  });

  const layout = {
    paper_bgcolor: isDarkMode ? '#1d2228' : '#ffffff',
    plot_bgcolor: isDarkMode ? '#1d2228' : '#ffffff' ,
    font: { color: isDarkMode ? '#fff' : '#000' },
    hoverlabel: {
      bgcolor: isDarkMode ? '#1d2228' : '#ffffff',
      font: { color: isDarkMode ? '#000' : '#fff', size: 12 }
    },
    xaxis: {
      gridcolor: isDarkMode ? '#444' : '#ccc',
      tickfont: { size: 12 },
      type: 'date',
    },
    yaxis: {
      gridcolor: isDarkMode ? '#444' : '#ccc',
      tickfont: { size: 12 },
      rangemode: 'tozero',
    },
    margin: { l: 40, r: 20, t: 10, b: 30 },
    showlegend: true,
  };

  if (traces.length === 0) {
    return <div className="text-white text-sm p-2">Loading chart...</div>;
  }

  return (
    <div className="w-full h-[400px] transition-colors duration-300 bg-white dark:bg-[#1d2228]">
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{     
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: [
            "toImage", "sendDataToCloud", "lasso2d", "select2d"
          ],
          scrollZoom: true
        }}
      />
    </div>
  );
}
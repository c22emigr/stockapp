import React from "react";
import Plot from "react-plotly.js";

export default function StockChart({ data, comparisonData, selectedSymbol }) {
  if ((!data || data.length === 0) && (!comparisonData || Object.keys(comparisonData).length === 0)) return null;

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
    autosize: true,
    paper_bgcolor: '#1d2228',
    plot_bgcolor: '#1d2228',
    font: { color: '#fff' },
    margin: { l: 40, r: 20, t: 10, b: 30 },
    xaxis: {
      gridcolor: '#333',
      tickfont: { size: 12 },
      type: 'date'
    },
    yaxis: {
      gridcolor: '#333',
      tickfont: { size: 12 },
      rangemode: 'tozero'
    },
    hoverlabel: {
      bgcolor: '#1d2228',
      font: { color: '#fff', size: 12 }
    },
    showlegend: true
  };

  if (traces.length === 0) return null;

  return (
    <div className="w-full h-[400px]">
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
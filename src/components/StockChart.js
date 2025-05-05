import React, { useState, useRef, useEffect } from "react";
import Plot from "react-plotly.js";
import { Maximize, Minimize } from "lucide-react";

export default function StockChart({ data, comparisonData, selectedSymbol, darkMode }) {
  const chartRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen states

  const toggleFullscreen = () => {
    const el = chartRef.current;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => { // Handle exit (esc)
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if ((!data || data.length === 0) && (!comparisonData || Object.keys(comparisonData).length === 0)) {
    return <div className="text-white text-sm p-2">Select a stock to view chart.</div>;
  }
  const isDarkMode = darkMode;

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
  if (comparisonData && Object.keys(comparisonData).length > 0) {
  Object.entries(comparisonData).forEach(([symbol, series], i) => {
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
}


  const layout = {
    paper_bgcolor: isDarkMode ? '#232a31' : '#ffffff',
    plot_bgcolor: isDarkMode ? '#232a31' : '#ffffff' ,
    font: { color: isDarkMode ? '#fff' : '#000' },
    hoverlabel: {
      bgcolor: isDarkMode ? '#232a31' : '#ffffff',
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
    <div ref={chartRef} className="w-full h-[400px] transition-colors duration-300 bg-white dark:bg-[#1d2228]">
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleFullscreen}
          className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-emerald-400 hover:text-white transition"
        >
          Fullscreen
        </button>
      </div>

      <Plot
        data={traces}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{     
          responsive: true,
          scrollZoom: true,
          displaylogo: false,
          modeBarButtonsToRemove: [
            "toImage", "sendDataToCloud", "lasso2d", "select2d"
          ],
          modeBarButtonsToAdd: ["toggleFullscreen"]
        }}
      />
    </div>
  );
}
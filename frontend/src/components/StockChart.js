import React, { useState, useRef, useEffect } from "react";
import Plot from "react-plotly.js";
import { Maximize, Minimize } from "lucide-react";

export default function StockChart({ data, comparisonData, selectedSymbol, darkMode }) {
  const chartRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen states
  const [hoverData, setHoverData] = useState(null); // State for hovering graph

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
      customdata: data.map(d => d.Close),
      name: selectedSymbol,
      type: "scatter",
      mode: "lines",
      line: { color: "#4ade80", width: 2 },
      hoverinfo: "none", // Disable default tooltip
      hoveron: "points",
    });
  }

  // Comparison lines
  if (comparisonData && Object.keys(comparisonData).length > 0) {
  Object.entries(comparisonData).forEach(([symbol, series], i) => {
    if (!series?.length || symbol === selectedSymbol) return; // skip if symbol already exists

    traces.push({
      x: series.map(d => d.Date),
      y: series.map(d => d.Normalized),
      customdata: series.map(d => d.Close),
      name: symbol,
      type: "scatter",
      mode: "lines",
      line: {
        color: ["#ff7300", "#387908", "#8884d8", "#ffc658", "#82ca9d", "#deed57"][i % 6],
        width: 2
      },
      hoverinfo: "none",
      hoveron: "points",
    });
  });
}


  const layout = {
    paper_bgcolor: isDarkMode ? '#232a31' : '#ffffff',
    plot_bgcolor: isDarkMode ? '#232a31' : '#ffffff' ,
    font: { color: isDarkMode ? '#fff' : '#000' },
    hoverlabel: {
      bgcolor: isDarkMode ? '#1f2937' : '#f3f4f6', // Tailwind gray-800 / gray-100
      bordercolor: isDarkMode ? '#10b981' : '#059669', // emerald-500/600 
      font: {
        color: isDarkMode ? '#fefefe' : '#111827', 
        size: 13,
        family: "'Inter', sans-serif"
      },
      align: 'left',
    },
    xaxis: {
      showgrid: false,
      tickfont: { size: 12 },
      type: 'date',
    },
    yaxis: {
      showgrid: false,
      showticklabels: false,
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
    <div ref={chartRef} className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] transition-colors duration-300 bg-white dark:bg-[#232a31]">
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleFullscreen}
          className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-emerald-400 dark:hover:bg-emerald-400 hover:text-white transition flex items-center gap-1"
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
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
          displayModeBar: false,
        }}
        onHover={(event) => {
          const { points } = event;
          const point = points[0];
          const chartRect = chartRef.current.getBoundingClientRect();
          setHoverData({
            x: point.x,
            y: point.y,
            close: point.customdata,
            symbol: point.data.name,
            color: point.fullData.line.color, // Line color dot for tooltip
            top: event.event.clientY - chartRect.top,
            left: event.event.clientX - chartRect.left
          });
        }}
        onUnhover={() => setHoverData(null)}
      />

      {hoverData && (
        <div
          className="absolute z-50 p-3 bg-gray-800 text-white rounded shadow text-sm pointer-events-none leading-tight"
          style={{
            top: `${hoverData.top + 12}px`,
            left: `${hoverData.left + 12}px`
          }}
        >
          <p className="text-xs text-white font-semibold">
          <span
            className="w-2 h-2 rounded-full mr-1 inline-block"
            style={{ backgroundColor: hoverData.color }}
          ></span>
            {hoverData.symbol}  -  {hoverData.x}
          </p>
          <p className="text-emerald-400 text-base font-bold">
            ${hoverData.close.toFixed(2)}
          </p>
          <p
            className={`text-sm font-medium ${
              hoverData.y >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {(hoverData.y >= 0 ? "+" : "") + hoverData.y.toFixed(2)}%
          </p>     
        </div>
      )}
    </div>
  );
}
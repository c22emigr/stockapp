export default function normalizeData(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  const base = data[0].Close || 1;

  return data.map(point => ({
    ...point,
    Normalized: ((point.Close - base) / base) * 100, // % change
    RawClose: point.Close  // for tooltip
  }));
}
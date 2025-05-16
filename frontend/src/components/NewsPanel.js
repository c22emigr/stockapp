import { useState, useEffect } from "react";

const NEWS_CATEGORIES = [
  "general",
  "forex",
  "crypto",
  "merger",
  "financial",
  "tech",
];

export default function NewsPanel({ selectedStock, fullSymbol }) {
  const [category, setCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      console.log("Selected stock:", selectedStock);
      setLoading(true);
      try {
        let res;
        if (selectedStock && !fullSymbol.includes(".")) {
          res = await fetch(`http://localhost:5000/api/news/${selectedStock}`);
        } else {
          res = await fetch(`http://localhost:5000/api/news?category=${category}`);
        }
        const data = await res.json();
        console.log("Fetched news:", data);
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          setArticles([]);
          console.warn("Unexpected format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedStock, category, fullSymbol]);

  return (
    <div className="p-4 bg-white dark:bg-[#232a31] rounded-lg shadow">
      {(!selectedStock || selectedStock.includes(".")) && (
      <div className="flex flex-wrap gap-2 mb-4">
        {NEWS_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
            category === cat
              ? "bg-emerald-400 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:border-emerald-400"
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
        ))}
      </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading news...</p>
      ) : articles.length > 0 ? (
        <ul className="space-y-4 max-h-[320px] overflow-y-auto pr-1 scrollbar-ultra-thin">
          {articles.slice(0, 20).map((article) => (
            <li
              key={article.id || article.url}
              className="border-l-4 pl-3 border-emerald-400"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-900 dark:text-white hover:underline"
              >
                {article.headline}
              </a>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {article.source} ·{" "}
                {article.datetime
                  ? new Date(article.datetime * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-300">No news found.</p>
      )}
    </div>
  );
}
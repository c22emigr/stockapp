import React, { useState, useEffect } from "react";

const NEWS_CATEGORIES = [
  "general",
  "forex",
  "crypto",
  "merger",
  "financial",
  "tech",
];

export default function NewsPanel() {
  const [category, setCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/news?category=${category}`);
        const data = await res.json();
        console.log("Fetched news:", data); // 🔍 Debugging log
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          setArticles([]);
          console.warn("News API returned unexpected format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [category]);

  return (
    <div className="mt-6 bg-white dark:bg-[#1d2228] p-4 rounded-lg shadow">
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

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading news...</p>
      ) : articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((article) => (
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
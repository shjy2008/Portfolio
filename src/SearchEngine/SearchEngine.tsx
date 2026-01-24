// src/SearchEngine/SearchEngine.tsx

import { useState } from "react";
import "./SearchEngine.css";
import type { PubMedDoc } from "./SearchEngineType";

interface SearchEngineProps {
  backendUrl: string;
}

const SearchEngine: React.FC<SearchEngineProps> = ({ backendUrl }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<PubMedDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${backendUrl}/search?q=${encodeURIComponent(query)}&k=3`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: PubMedDoc[] = await res.json();
      setResults(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-engine">
      <h1 className="search-title">PubMed Search Engine</h1>

      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Enter medical keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p className="search-status">Searching…</p>}
      {error && <p className="search-error">{error}</p>}

      <div className="search-results">
        {results.map((doc) => (
          <div key={doc.docId} className="result-card">
            <div className="result-header">
              <span className="result-docid">doc_id: {doc.docNo}</span>
              {doc.score !== undefined && (
                <span className="result-score">
                  Score: {doc.score.toFixed(2)}
                </span>
              )}
            </div>

            <p className="result-content">{doc.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchEngine;

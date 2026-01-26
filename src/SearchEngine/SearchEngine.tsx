// src/SearchEngine/SearchEngine.tsx

import { useState } from "react";
import "./SearchEngine.css";
import type { PubMedDoc } from "./SearchEngineType";

const ip: string = "127.0.0.1";
const port: string = "8080";
const url: string = "http://" + ip + ":" + port;

const SUGGESTED_QUERIES: string[] = [
  "diabetes treatment",
  "lung cancer diagnosis",
  "covid-19 vaccine",
  "hypertension risk factors",
  "Alzheimer disease biomarker",
];

interface SearchEngineProps {
  // backendUrl: string;
}

const SearchEngine: React.FC<SearchEngineProps> = ({  }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<PubMedDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedQuery, setSearchedQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleSearch = async (searchText?: string): Promise<void> => {
    const q = (searchText ?? query).trim();
    if (!q) return;

    setShowSuggestions(false);
    setLoading(true);
    setError(null);
    setSearchedQuery(q);

    try {
      const res = await fetch(
        `${url}/search?q=${encodeURIComponent(q)}&k=10`
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

  const highlightQuery = (text: string, query: string) => {
    if (!query) return text;

    // Split query into words, filter out empty strings
    const words = query.trim().split(/\s+/);
    if (words.length === 0) return text;

    // Create a regex to match any word, case-insensitive
    const regex = new RegExp(`(${words.join("|")})`, "gi");

    // Split text into parts based on the words
    const parts = text.split(regex);

    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span key={idx} style={{ color: "red", fontWeight: "bold" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-engine">
      <h1 className="search-title">PubMed Search Engine</h1>

      <p className="search-origin">
        <b>Search data origin: </b>
        <a href="https://huggingface.co/datasets/MedRAG/pubmed" target="_blank" rel="noopener noreferrer">MedRAG PubMed Dataset</a>
         - 23.9 million PubMed abstracts, index size: 50GB, stored in AWS EBS
      </p>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Enter medical keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // setTimeout so clicks on suggestions can register
            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          />
          { showSuggestions && (
            <div className="search-suggestions">
              {SUGGESTED_QUERIES.map((suggestion) => (
                <div
                  key={suggestion}
                  className="suggestion-item"
                  onMouseDown={() => {
                    setQuery(suggestion);
                    //setSearchedQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
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

            {/* <p className="result-content">{doc.content}</p> */}
            <p className="result-content">{highlightQuery(doc.content, searchedQuery)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchEngine;

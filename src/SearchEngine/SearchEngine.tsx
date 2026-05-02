// src/SearchEngine/SearchEngine.tsx

"use client";
import { useState, useEffect, useRef } from "react";
import { fetchHealthOnce } from "../lib/client/healthCheck";
import Link from "next/link";
// Styles moved to pages/_app.tsx to satisfy Next.js global CSS rules
import type { PubMedDoc } from "./SearchEngineType";

// local
// const ip: string = "127.0.0.1";
// const port: string = "8080";
// const url: string = "http://" + ip + ":" + port;

// AWS CloudFront -> EC2
// const domainName: string = "d668si04vnfs0.cloudfront.net"; 
// const resourcePath: string = "/api";
// const url: string = "https://" + domainName + resourcePath;

const baseUrl = '';

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

const STOP_WORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves",
  "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself",
  "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves",
  "what", "which", "who", "whom", "this", "that", "these", "those",
  "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having", "do", "does", "did", "doing",
  "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
  "of", "at", "by", "for", "with", "about", "against", "between", "into", "through",
  "during", "before", "after", "above", "below", "to", "from", "up", "down",
  "in", "out", "on", "off", "over", "under",
  "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how",
  "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
  "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "s", "t", "can", "will", "just", "don", "should", "now",
  "ll", "ve", "m", "d", "re"
]);

const SearchEngine: React.FC<SearchEngineProps> = ({ }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<PubMedDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedQuery, setSearchedQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchEngineInitializing, setIsSearchEngineInitializing] = useState<boolean>(true);
  const hasFetchedHealth = useRef(false);

  useEffect(() => {
    if (hasFetchedHealth.current) return;
    hasFetchedHealth.current = true;

    fetchHealthOnce(`${baseUrl}/api/search/health`).then(({ initialized }) => {
      setIsSearchEngineInitializing(!initialized);
    });
  }, []);

  const handleSearch = async (searchText?: string): Promise<void> => {
    const q = (searchText ?? query).trim();
    if (!q || loading) return;

    setShowSuggestions(false);
    setLoading(true);
    setError(null);
    setResults([]);
    setSearchedQuery(q);

    try {
      const res = await fetch(`${baseUrl}/api/search/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: q, top_k: 10 }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        if (payload?.code === 'MODEL_INITIALIZING') {
          setIsSearchEngineInitializing(true);
          throw new Error(payload.message);
        }
        throw new Error(payload?.message || payload?.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      // Handle both pure array responses (old backend) and object-with-results-array (new Modal Python backend)
      const resultsArray = Array.isArray(data) ? data : (data.results || []);

      const mappedResults: PubMedDoc[] = resultsArray.map((item: any) => ({
        docId: item.doc_id ?? item.docId,
        docNo: item.doc_no ?? item.docNo,
        content: item.content,
        score: item.score
      }));

      setResults(mappedResults);
      setIsSearchEngineInitializing(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query) return text;

    const escapedWords = query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .filter(word => !STOP_WORDS.has(word.toLowerCase()))
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    const words = Array.from(new Set(escapedWords));
    if (words.length === 0) return text;

    const pattern = `\\b(${words.join("|")})\\b`;
    const splitRegex = new RegExp(pattern, "gi");
    const matchRegex = new RegExp(pattern, "i");

    const parts = text.split(splitRegex);

    return parts.map((part, idx) =>
      matchRegex.test(part) ? (
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
      <Link href="/?from=projects" className="back-link">← Back to Home</Link>
      <h1 className="search-title">PubMed Search Engine</h1>

      <p className="search-origin">
        <b>Search data source: </b>
        <a href="https://huggingface.co/datasets/MedRAG/pubmed" target="_blank" rel="noopener noreferrer">MedRAG PubMed Dataset</a>
        - <b>23.9 million</b> PubMed abstracts, index size: 50GB, stored in Modal Volume
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
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch(query)}
            disabled={loading}
          />
          {showSuggestions && (
            <div className="search-suggestions">
              {SUGGESTED_QUERIES.map((suggestion) => (
                <div
                  key={suggestion}
                  className="suggestion-item"
                  onMouseDown={() => {
                    setQuery(suggestion);
                    //setSearchedQuery(suggestion);
                    if (!loading) handleSearch(suggestion);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="search-button"
          onClick={() => handleSearch(query)}
          disabled={loading}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {loading && <p className="search-status">Searching…</p>}
      {isSearchEngineInitializing && (
        <div className="status-message" style={{ margin: '1rem 0' }}>
          The search engine is initializing. This can take a few seconds during a cold start.
        </div>
      )}
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

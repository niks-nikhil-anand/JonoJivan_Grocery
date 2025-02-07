"use client"; // Required for useSearchParams

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); // Get search query from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetch(`/api/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {results.map((item) => (
            <li key={item.id} className="p-4 bg-gray-100 rounded-lg">
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;

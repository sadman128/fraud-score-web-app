import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiService from "../services/api";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchInput, setSearchInput] = useState(query);

  const [posts, setPosts] = useState([]);
  const [businessNames, setBusinessNames] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchInput(query);

    if (query.trim()) {
      performSearch(query);
    } else {
      setPosts([]);
      setBusinessNames([]);
    }
  }, [query]);

  const performSearch = async (q) => {
    setLoading(true);
    try {
      const data = await apiService.searchPosts(q); // GET /api/posts/search?query=... [file:315]

      // If backend returns PostDto[]
      if (Array.isArray(data)) {
        setPosts(data);
        setBusinessNames(
            [...new Set(data.map(p => (p?.name || "").trim()).filter(Boolean))]
        );
        return;
      }

      // If backend returns { businessNames, posts }
      setPosts(Array.isArray(data?.posts) ? data.posts : []);
      setBusinessNames(Array.isArray(data?.names) ? data.names : []);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) setSearchParams({ query: searchInput });
  };

  return (
      <div className="space-y-6">
        {/* keep your existing search form UI here, and keep handleSearch + searchInput binding */}

        {loading ? (
            <LoadingSpinner size="lg" text="Searching..." />
        ) : query ? (
            <div className="space-y-6">
              {/* Unique business names (backend calculated) */}
              {businessNames.length > 0 && (
                  <div className="card p-4">
                    <div className="flex flex-wrap gap-2">
                      {businessNames.map((name) => (
                          <Link
                              key={name}
                              to={`/fraud-profile/${encodeURIComponent(name)}`} // route exists [file:317]
                              className="btn btn-secondary"
                              title="Open fraud profile"
                          >
                            {name}
                          </Link>
                      ))}
                    </div>
                  </div>
              )}

              {/* Posts */}
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {posts.length === 0 && (
                    <div className="card p-12 text-center">No Results Found</div>
                )}
              </div>
            </div>
        ) : (
            <div className="card p-12 text-center">Search for Fraud Reports</div>
        )}
      </div>
  );
}

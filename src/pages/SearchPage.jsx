"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { apiService } from "../services/api"
import PostCard from "../components/PostCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { Search, Building2, ChevronRight, AlertTriangle } from "lucide-react"

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("query") || ""
  const [searchInput, setSearchInput] = useState(query)
  const [results, setResults] = useState({ entities: [], posts: [] })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery) => {
    setLoading(true)
    try {
      const data = await apiService.search(searchQuery)
      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ query: searchInput })
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-red-500"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Search Fraud Reports</h1>
        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by business name, email, phone, or address..."
                className="input pl-12 text-lg"
              />
            </div>
            <button type="submit" className="btn btn-primary px-8">
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Searching..." />
      ) : query ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              Found {results.entities.length} entities and {results.posts.length} reports for "{query}"
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("entities")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "entities"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                Entities ({results.entities.length})
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "posts"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                Reports ({results.posts.length})
              </button>
            </div>
          </div>

          {(activeTab === "all" || activeTab === "entities") && results.entities.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Fraud Profiles
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.entities.map((entity) => (
                  <Link
                    key={entity._id}
                    to={`/fraud-entity/${entity._id}`}
                    className="card p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{entity.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{entity.totalReports} reports</p>
                      {entity.email && <p className="text-xs text-gray-400 truncate">{entity.email}</p>}
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(entity.fraudScore)}`}>{entity.fraudScore}%</p>
                      <p className="text-xs text-gray-400">Fraud Score</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeTab === "all" || activeTab === "posts") && results.posts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Related Reports
              </h2>
              <div className="space-y-4">
                {results.posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}

          {results.entities.length === 0 && results.posts.length === 0 && (
            <div className="card p-12 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No Results Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any fraud reports or entities matching "{query}". Try a different search term or check
                the spelling.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="card p-12 text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Search for Fraud Reports</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Enter a business name, email, phone number, or address to find related fraud reports and fraud scores.
          </p>
        </div>
      )}
    </div>
  )
}

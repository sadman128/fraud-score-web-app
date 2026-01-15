"use client"

import { useState, useEffect } from "react"
import { apiService } from "../services/api"
import TrendingCard from "../components/TrendingCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { TrendingUp, Clock } from "lucide-react"

const TIME_FILTERS = [
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
]

export default function TrendingPage() {
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("7d")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await apiService.getTrendingEntities(timeFilter)
        setEntities(data)
      } catch (error) {
        console.error("Error fetching trending:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [timeFilter])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-danger-600 dark:text-danger-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trending Frauds</h1>
              <p className="text-gray-500 dark:text-gray-400">Most reported entities by fraud score</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {TIME_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTimeFilter(filter.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === filter.value
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading trending frauds..." />
      ) : entities.length === 0 ? (
        <div className="card p-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No Trending Data</h3>
          <p className="text-gray-500 dark:text-gray-400">No fraud reports found for this time period.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entities.map((entity, index) => (
            <TrendingCard key={entity._id} entity={entity} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

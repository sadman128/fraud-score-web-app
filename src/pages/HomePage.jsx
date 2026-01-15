"use client"

import { useState, useEffect } from "react"
import PostCard from "../components/PostCard"
import TrendingCard from "../components/TrendingCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { apiService } from "../services/api"
import { Shield, TrendingUp, FileWarning, Users } from "lucide-react"

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [trendingEntities, setTrendingEntities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [postsData, trendingData] = await Promise.all([apiService.getPosts(), apiService.getTrendingEntities()])
        setPosts(postsData)
        setTrendingEntities(trendingData.slice(0, 5))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading fraud reports..." />
  }

  return (
    <div className="space-y-8">
      <section className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 md:p-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">FraudScore</h1>
          </div>
          <p className="text-lg md:text-xl text-primary-100 mb-6">
            Report fraud incidents anonymously and help others stay safe. Search businesses and individuals to check
            their fraud score before making decisions.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5" />
              <span>{posts.length}+ Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Anonymous & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Latest Fraud Reports</h2>
          {posts.length === 0 ? (
            <div className="card p-8 text-center">
              <FileWarning className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No fraud reports yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-danger-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Trending Frauds</h2>
          </div>
          {trendingEntities.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No trending data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trendingEntities.map((entity, index) => (
                <TrendingCard key={entity._id} entity={entity} rank={index + 1} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

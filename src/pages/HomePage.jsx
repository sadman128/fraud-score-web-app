"use client"

import { useState, useEffect } from "react"
import PostCard from "../components/PostCard"
import TrendingCard from "../components/TrendingCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { apiService } from "../services/api"
import { Shield, TrendingUp, FileWarning, Users, ThumbsUp, ThumbsDown } from "lucide-react"

function normalizeName(name) {
  return (name || "").trim().toLowerCase()
}

function calculateTopTrending(posts, limit = 5) {
  const map = new Map()

  for (const post of posts) {
    const rawName = post?.name
    const key = normalizeName(rawName)
    if (!key) continue

    if (!map.has(key)) map.set(key, { name: rawName.trim(), count: 1 })
    else map.get(key).count += 1
  }

  return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
}




export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [trendingEntities, setTrendingEntities] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [trendingLoading, setTrendingLoading] = useState(true)



  useEffect(() => {
    const fetchData = async () => {
      setPostsLoading(true)
      setTrendingLoading(true)

      try {
        const postsData = await apiService.getPosts()

        const validPosts = (postsData || []).filter((post) => post?.id)
        console.log(`Loaded ${validPosts.length} valid posts`)

        setPosts(validPosts)
        setPostsLoading(false)

        setTimeout(() => {
          const top5 = calculateTopTrending(validPosts, 5)
          setTrendingEntities(top5)
          setTrendingLoading(false)
        }, 0)
      } catch (error) {
        console.error("Error fetching data:", error)
        setPosts([])
        setTrendingEntities([])
        setPostsLoading(false)
        setTrendingLoading(false)
      }
    }

    fetchData()
  }, [])



  return (
      <div className="space-y-8">
        {/* HERO */}
        <section className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 md:p-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-9 h-9 md:w-10 md:h-10" />
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">FraudScore</h1>
            </div>

            <p className="text-base md:text-lg text-primary-100 mb-4 leading-relaxed">
              Report fraud anonymously. Check fraud scores before decisions.
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <FileWarning className="w-4 h-4" />
                <span>{posts.length}+ Reports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Anonymous & Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Real-time</span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6 lg:h-[calc(87vh-220px)] lg:overflow-hidden">
          {/* POSTS */}
          <section className="lg:col-span-2 flex flex-col min-h-0 space-y-3">
            <h2 className="shrink-0 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Latest Fraud Reports
            </h2>

            {/* The important part: fixed minimum list height on lg so 3 cards are visible */}
            <div className="min-h-0 lg:min-h-[460px] overflow-y-auto pr-2 scrollbar-nice">
              {posts.length === 0 ? (
                  <div className="card p-8 text-center">
                    <FileWarning className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">No fraud reports yet</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                  </div>
              )}
            </div>
          </section>

          {/* TRENDING */}
          <aside className="flex flex-col min-h-0 space-y-3">
            <div className="shrink-0 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-danger-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Trending Frauds
              </h2>
            </div>

            <div className="min-h-0 overflow-y-auto pr-2 scrollbar-nice">
              {trendingEntities.length === 0 ? (
                  <div className="card p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No trending data</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                    {trendingEntities.map((entity, index) => (
                        <TrendingCard
                            key={`${entity.name}-${index}`}
                            entity={entity}
                            rank={index + 1}
                        />
                    ))}
                  </div>
              )}
            </div>
          </aside>
        </div>
      </div>
  )


}

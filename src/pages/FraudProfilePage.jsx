"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Shield, FileWarning, TrendingUp, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { apiService } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"

/**
 * FraudProfilePage Component
 * Display fraudster profile and related posts
 */
export default function FraudProfilePage() {
  const { name } = useParams()

  // State
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Fetch all posts for this fraudster name
   */
  useEffect(() => {
    const norm = (v) => (v || "").toString().trim().toLowerCase()
    const normPhone = (v) => (v || "").toString().replace(/[^\d+]/g, "").trim()

    const fetchData = async () => {
      if (!name) {
        setError("Invalid fraudster name")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const decodedName = decodeURIComponent(name)

        // 1) Seed: find some posts by name first
        const seed = (await apiService.searchPosts(decodedName)) || []

        // 2) Collect identifiers from seed results
        const names = new Set()
        const emails = new Set()
        const phones = new Set()

        for (const p of seed) {
          if (p?.name) names.add(norm(p.name))
          if (p?.email) emails.add(norm(p.email))
          if (p?.phone) phones.add(normPhone(p.phone))
        }

        // ensure clicked name is included even if seed is empty
        names.add(norm(decodedName))

        // 3) Fetch all posts, then filter by any identifier match
        const all = (await apiService.getPosts()) || []
        const related = all.filter((p) => {
          const pn = norm(p?.name)
          const pe = norm(p?.email)
          const pp = normPhone(p?.phone)
          return (pn && names.has(pn)) || (pe && emails.has(pe)) || (pp && phones.has(pp))
        })

        // 4) Dedupe by id + sort newest first
        const unique = Array.from(
            new Map(related.filter(p => p?.id).map((p) => [p.id, p])).values()
        ).sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))

        setPosts(unique)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError(err.message || "Failed to load posts")
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [name])

  // Loading state
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
    )
  }

  // Error state
  if (error) {
    return (
        <div className="max-w-3xl mx-auto py-12">
          <div className="card p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link to="/home" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
    )
  }

  return (
      <div className="max-w-3xl mx-auto py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
              to="/home"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Profile header */}
        <div className="card p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-danger-600 dark:text-danger-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {decodeURIComponent(name)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Fraud Profile - {posts.length} report(s)
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reports</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {posts.length}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
              <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                {posts.length > 5 ? "High" : posts.length > 2 ? "Medium" : "Low"}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {new Set(posts.map(p => p.category)).size}
              </div>
            </div>
          </div>
        </div>

        {/* Related posts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Related Reports
            </h2>
          </div>

          {posts.length > 0 ? (
              posts.map((post) => (
                  <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      className="card block w-full p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                  <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {post.description?.substring(0, 100)}...
                        </p>
                        <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 rounded">
                      {post.category}
                    </span>
                          <span className="text-gray-500 dark:text-gray-400">
                      {new Date(post.postedAt).toLocaleDateString()}
                    </span>
                        </div>
                      </div>
                      <TrendingUp className="w-4 h-4 text-danger-600 flex-shrink-0" />
                    </div>
                  </Link>
              ))
          ) : (
              <div className="card p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No reports found for this person
                </p>
              </div>
          )}
        </div>
      </div>
  )
}

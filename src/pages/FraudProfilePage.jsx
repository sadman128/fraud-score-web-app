"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { apiService } from "../services/api"
import PostCard from "../components/PostCard"
import FraudScoreMeter from "../components/FraudScoreMeter"
import LoadingSpinner from "../components/LoadingSpinner"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  TrendingUp,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { formatDate } from "../utils/helpers"

export default function FraudProfilePage() {
  const { id } = useParams()
  const [entity, setEntity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [entityData, postsData] = await Promise.all([
          apiService.getFraudEntity(id),
          apiService.getEntityPosts(id),
        ])
        setEntity(entityData)
        setPosts(postsData)
      } catch (error) {
        console.error("Error fetching entity:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading fraud profile..." />
  }

  if (!entity) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-danger-500" />
        <h2 className="text-xl font-semibold mb-2">Entity Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">This fraud profile doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    )
  }

  const patternColors = {
    REFUND_FRAUD: "bg-red-500",
    DELIVERY_SCAM: "bg-orange-500",
    FAKE_PRODUCT: "bg-yellow-500",
    IDENTITY_THEFT: "bg-purple-500",
    PAYMENT_FRAUD: "bg-pink-500",
    OTHER: "bg-gray-500",
  }

  const totalPatternReports = Object.values(entity.fraudPatterns || {}).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      <div className="card p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{entity.name}</h1>
                  {entity.verified && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400">{entity.totalReports} fraud reports submitted</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {entity.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{entity.email}</span>
                </div>
              )}
              {entity.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{entity.phone}</span>
                </div>
              )}
              {entity.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{entity.address}</span>
                </div>
              )}
              {entity.lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDate(entity.lastUpdated)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-48">
            <FraudScoreMeter score={entity.fraudScore} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {entity.aiSummary && (
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">AI Fraud Summary</h3>
                  <p className="text-primary-800 dark:text-primary-200">{entity.aiSummary}</p>
                </div>
              </div>
            </div>
          )}

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger-500" />
              Fraud Reports ({posts.length})
            </h2>
            {posts.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No approved reports yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Fraud Patterns
            </h3>
            {Object.keys(entity.fraudPatterns || {}).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No pattern data available</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(entity.fraudPatterns).map(([pattern, count]) => (
                  <div key={pattern}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{pattern.replace(/_/g, " ")}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${patternColors[pattern] || patternColors.OTHER} rounded-full`}
                        style={{ width: `${(count / totalPatternReports) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Reports</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{entity.totalReports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fraud Score</span>
                <span className="font-semibold text-danger-500">{entity.fraudScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className={`font-semibold ${entity.verified ? "text-green-500" : "text-gray-500"}`}>
                  {entity.verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

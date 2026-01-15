"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { apiService } from "../services/api"
import { useAuth } from "../context/AuthContext"
import CommentSection from "../components/CommentSection"
import ImageGallery from "../components/ImageGallery"
import LoadingSpinner from "../components/LoadingSpinner"
import {
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Flag,
  ExternalLink,
  Building2,
} from "lucide-react"
import { formatDate } from "../utils/helpers"

export default function PostDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userReaction, setUserReaction] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [postData, commentsData] = await Promise.all([apiService.getPost(id), apiService.getComments(id)])
        setPost(postData)
        setComments(commentsData)
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleReaction = async (type) => {
    if (!isAuthenticated) return
    setUserReaction(type)
  }

  const handleAddComment = async (commentText) => {
    const newComment = {
      _id: Date.now().toString(),
      postId: id,
      userId: "current-user",
      comment: commentText,
      createdAt: new Date().toISOString(),
    }
    setComments([newComment, ...comments])
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading report details..." />
  }

  if (!post) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-danger-500" />
        <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          This fraud report may have been removed or doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    )
  }

  const categoryColors = {
    REFUND_FRAUD: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    DELIVERY_SCAM: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    FAKE_PRODUCT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    IDENTITY_THEFT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PAYMENT_FRAUD: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    OTHER: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      <article className="card">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${categoryColors[post.category] || categoryColors.OTHER}`}
                >
                  {post.category?.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h1>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger-500 flex-shrink-0" />
          </div>

          {post.fraudEntity && (
            <Link
              to={`/fraud-entity/${post.fraudEntity._id}`}
              className="flex items-center gap-3 p-4 mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Building2 className="w-10 h-10 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Reported Entity</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{post.fraudEntity.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Fraud Score</p>
                <p className="text-xl font-bold text-danger-500">{post.fraudEntity.fraudScore}%</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </Link>
          )}

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{post.description}</p>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Evidence ({post.images.length})
              </h3>
              <ImageGallery images={post.images} />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleReaction("LIKE")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  userReaction === "LIKE"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{post.likes || 0}</span>
              </button>
              <button
                onClick={() => handleReaction("DISLIKE")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  userReaction === "DISLIKE"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>{post.dislikes || 0}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-secondary flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="btn btn-secondary flex items-center gap-2 text-danger-600 hover:text-danger-700">
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </div>
        </div>
      </article>

      <CommentSection comments={comments} postId={id} onAddComment={handleAddComment} />
    </div>
  )
}

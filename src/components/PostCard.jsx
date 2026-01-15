import { Link } from "react-router-dom"
import { ThumbsUp, ThumbsDown, MessageCircle, Clock, AlertTriangle, ImageIcon } from "lucide-react"
import { formatDate } from "../utils/helpers"

export default function PostCard({ post }) {
  const categoryColors = {
    REFUND_FRAUD: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    DELIVERY_SCAM: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    FAKE_PRODUCT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    IDENTITY_THEFT: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PAYMENT_FRAUD: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    OTHER: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  }

  return (
    <Link to={`/post/${post._id}`} className="card block hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[post.category] || categoryColors.OTHER}`}
              >
                {post.category?.replace(/_/g, " ")}
              </span>
              {post.fraudEntity && (
                <span className="text-xs text-gray-500 dark:text-gray-400">vs {post.fraudEntity.name}</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{post.title}</h3>
          </div>
          <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0" />
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">{post.description}</p>

        {post.images && post.images.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
            <ImageIcon className="w-4 h-4" />
            <span>
              {post.images.length} image{post.images.length > 1 ? "s" : ""} attached
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <ThumbsDown className="w-4 h-4" />
              <span>{post.dislikes || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

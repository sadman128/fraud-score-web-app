import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Calendar, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react"
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

  if (!post || !post.id) {
    console.warn("PostCard: Missing post ID", post)
    return null
  }

  const author = (post?.postedBy ?? "").trim() || "Unknown"


  return (
      <Link to={`/post/${post.id}`}>
        <div className="card p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer group">
          {/* Header: Title + Category + Arrow */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="min-w-0 truncate text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>

                <span className="shrink-0 px-2 py-0.5 bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 text-[11px] font-medium rounded-full">
              {post.category}
            </span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1" />
          </div>

          {/* Description: 80 chars */}
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {(() => {
              const desc = (post.description ?? "").replace(/\s+/g, " ").trim()
              return desc.length > 80 ? `${desc.slice(0, 77)}...` : desc
            })()}
          </p>

          {/* Fraudster Info (compact) */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
            {post.name && (
                <div className="truncate">
                  <span className="font-medium text-gray-700 dark:text-gray-200">Business Name:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-300">{post.name}</span>
                </div>
            )}

            {post.email && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{post.email}</span>
                </div>
            )}

            {post.phone && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{post.phone}</span>
                </div>
            )}

            {post.address && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{post.address}</span>
                </div>
            )}
          </div>

          {/* Bottom bar (short) */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex items-center gap-1 ${post.ownLiked ? "text-green-600 dark:text-green-400" : ""}`}>
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.likedCount || 0}</span>
              </div>

              <div className={`flex items-center gap-1 ${post.ownDisliked ? "text-red-600 dark:text-red-400" : ""}`}>
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{post.dislikedCount || 0}</span>
              </div>

              <div className="truncate">
                <span className="text-gray-400">by</span> <span className="truncate">{author}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.postedAt).toLocaleDateString()}</span>
            </div>
          </div>

        </div>
      </Link>
  )

}
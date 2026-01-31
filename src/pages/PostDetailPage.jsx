"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ThumbsUp,
    ThumbsDown,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  User,
  MessageCircle,
  Send,
} from "lucide-react"
import { Link } from "react-router-dom"
import { apiService } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import CommentSection from "../components/CommentSection";
import toast from "react-hot-toast";

/**
 * PostDetailPage - Full fraud report display with comments
 */
export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [images, setImages] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [failedImages, setFailedImages] = useState(new Set())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)


  // Load post and images
  useEffect(() => {
    const fetchData = async () => {
      if (!id || id === "undefined") {
        setError("Invalid post ID")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("📌 Fetching post:", id)

        // Fetch post data
        const postData = await apiService.getPost(id)
        console.log("✅ Post loaded:", postData)
        setPost(postData)

        // Fetch image filenames
        const imageFilenames = await apiService.getPostImages(id)
        console.log("📸 Image filenames:", imageFilenames)

        if (imageFilenames && imageFilenames.length > 0) {
          // Build full URLs: /api/posts/{id}/images/{filename}
          const imageUrls = imageFilenames.map(
              (filename) =>
                  `${apiService.API_BASE_URL}/posts/${id}/images/${encodeURIComponent(
                      filename
                  )}`
          )
          setImages(imageUrls)
          console.log("🖼️ Image URLs:", imageUrls)
        } else {
          setImages([])
          console.log("ℹ️ No images found")
        }

        // Fetch comments
        const commentsData = await apiService.getComments(id)
        setComments(commentsData || [])
      } catch (err) {
        console.error("❌ Error fetching post:", err)
        setError(err.message || "Failed to load post")
      } finally {
        setLoading(false)
      }

      setIsAuthenticated(apiService.isAuthenticated())

    }

    fetchData()
  }, [id])

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set([...prev, index]))
    console.log(`✅ Image ${index} loaded`)
  }

  const handleImageError = (index) => {
    setFailedImages((prev) => new Set([...prev, index]))
    console.error(`❌ Image ${index} failed to load`)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      console.log("💬 Submitting comment:", commentText)

      const newComment = await apiService.createComment(id, commentText)
      setComments([...comments, newComment])

      setCommentText("")
      toast.success("Successfully submitted comment")
      window.location.reload()
    } catch (err) {
      console.error("Failed to submit comment:", err)
      toast.error(err)
    }
  }


  // Like/Dislike handlers
  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please login to like this post")
      return
    }
    try {
      const updatedPost = await apiService.likePost(id)
      setPost(updatedPost)
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const handleDislike = async () => {
    if (!isAuthenticated) {
      alert("Please login to dislike this post")
      return
    }
    try {
      const updatedPost = await apiService.dislikePost(id)
      setPost(updatedPost)
    } catch (error) {
      console.error("Failed to dislike post:", error)
    }
  }



  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
    )
  }

  if (error) {
    return (
        <div className="max-w-3xl mx-auto py-12">
          <div className="card p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
    )
  }

  if (!post) {
    return (
        <div className="max-w-3xl mx-auto py-12">
          <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Post not found</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
    )
  }
  return (

      <div className="max-w-6xl mx-auto py-3">
        {/*
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        */}

        {/* ================= 70/30 GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">

          {/* ================= POST (70%) ================= */}
          <main>

            {/* Post Card - SAME LOOK */}
            <div className="card p-6 md:p-12 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h1>

              {/* Header info - SAME */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <span className="px-3 py-1 bg-danger-100 dark:bg-danger-900/30 text-danger-700 rounded-full text-xs font-medium">
              {post.category}
            </span>
                {post.postedBy && <span className="flex items-center gap-1"><User className="w-4 h-4" /> <strong>{post.postedBy}</strong></span>}
                {post.postedAt && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(post.postedAt).toLocaleString()}</span>}
              </div>

              {/* Fraudster Info - SAME */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6 space-y-3">
                {post.name && <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-600" /><strong>Name:</strong> {post.name}</div>}
                {post.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-600" /><strong>Email:</strong> {post.email}</div>}
                {post.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-600" /><strong>Phone:</strong> {post.phone}</div>}
                {post.address && <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-600 mt-0.5" /><strong>Address:</strong> {post.address}</div>}
              </div>

              {/* Description - SAME */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Report Details
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{post.description}</p>
              </div>

              {/* Images - UPDATED: show 2, overlay +N on 2nd, click to expand */}
              {images.length > 0 && (() => {
                const extraCount = images.length - 2
                const visibleImages = showAllImages ? images : images.slice(0, 2)

                return (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" /> Evidence ({images.length})
                        </h3>

                        {images.length > 2 && (
                            <button
                                type="button"
                                onClick={() => setShowAllImages((v) => !v)}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              {showAllImages ? "Show less" : "Show all"}
                            </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {visibleImages.map((imageUrl, index) => {
                          const showOverlay = !showAllImages && images.length > 2 && index === 1

                          return (
                              <a
                                  key={index}
                                  href={imageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    if (showOverlay) {
                                      e.preventDefault()
                                      setShowAllImages(true)
                                    }
                                  }}
                                  className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden aspect-video"
                              >
                                <img
                                    src={imageUrl}
                                    alt={`Evidence ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {showOverlay && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">
                    +{extraCount}
                  </span>
                                    </div>
                                )}
                              </a>
                          )
                        })}
                      </div>
                    </div>
                )
              })()}

            </div>

            {/* Reactions - SAME */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      post.ownLiked
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
              >
                <ThumbsUp className={`w-5 h-5 ${post.ownLiked ? "fill-green-500" : ""}`} />
                {post.likedCount || 0}
              </button>

              <button
                  onClick={handleDislike}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      post.ownDisliked
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
              >
                <ThumbsDown
                    className={`w-5 h-5 ${post.ownDisliked ? "fill-red-500" : ""}`}
                />
                {post.dislikedCount || 0}
              </button>
            </div>
          </main>

          {/* ================= COMMENTS (30%) ================= */}
          <aside className="space-y-4">
            <div className="card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Comments ({comments.length})
              </h3>

              {/* Form - SAME */}
              <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your experience..." className="input w-full min-h-[100px]" />
                <button type="submit" disabled={!commentText.trim()} className="btn btn-primary flex items-center gap-2 w-full">
                  <Send className="w-4 h-4" /> Post Comment
                </button>
              </form>
              <CommentSection
                  comments={comments}
                  postId={id}
                  onDeleted={(commentId) =>
                      setComments((prev) => prev.filter((c) => c.id !== commentId))
                  }
              />

            </div>
          </aside>
        </div>
      </div>
  );


}

"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { User, Clock, Flag, Send } from "lucide-react"
import { formatDate } from "../utils/helpers"

export default function CommentSection({ comments, postId, onAddComment }) {
  const { isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Comments ({comments.length})</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience or add information..."
                className="input min-h-[80px] resize-none"
              />
              <div className="flex justify-end mt-2">
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please{" "}
            <a href="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              login
            </a>{" "}
            to add a comment
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No comments yet. Be the first to share your experience!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Anonymous User</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(comment.createdAt)}
                    </span>
                    <button className="text-gray-400 hover:text-danger-500 transition-colors">
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

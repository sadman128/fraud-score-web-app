"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { apiService } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Link, useNavigate } from "react-router-dom"
import { Shield, FileWarning, Users, Building2, CheckCircle, XCircle, Eye, Clock, BarChart3 } from "lucide-react"
import { formatDate } from "../utils/helpers"

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pending")
  const [pendingPosts, setPendingPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      navigate("/login")
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const [pending, statsData] = await Promise.all([apiService.getPendingPosts(), apiService.getAdminStats()])
        setPendingPosts(pending)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAuthenticated, user, navigate])

  const handleApprove = async (postId) => {
    setPendingPosts(pendingPosts.filter((p) => p._id !== postId))
    alert("Post approved successfully!")
  }

  const handleReject = async (postId) => {
    setPendingPosts(pendingPosts.filter((p) => p._id !== postId))
    alert("Post rejected successfully!")
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading admin dashboard..." />
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage fraud reports and users</p>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileWarning className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalPosts}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingPosts}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalEntities}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Entities</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "pending"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Pending Posts ({pendingPosts.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "analytics"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingPosts.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">All Caught Up!</h3>
              <p className="text-gray-500 dark:text-gray-400">No pending posts to review.</p>
            </div>
          ) : (
            pendingPosts.map((post) => (
              <div key={post._id} className="card p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                        PENDING
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.category?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">{post.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {post.fraudEntity?.name || "Unknown Entity"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/post/${post._id}`} className="btn btn-secondary flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      onClick={() => handleApprove(post._id)}
                      className="btn bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button onClick={() => handleReject(post._id)} className="btn btn-danger flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="card p-8 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Analytics Coming Soon</h3>
          <p className="text-gray-500 dark:text-gray-400">Detailed analytics and reporting will be available here.</p>
        </div>
      )}
    </div>
  )
}

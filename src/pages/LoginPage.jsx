"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { apiService } from "../services/api"
import { setCookie } from "../utils/cookieUtils"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.usernameOrEmail || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      // ✅ Call login API
      const response = await apiService.login({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })

      // ✅ SAVE TOKENS TO COOKIES
      if (response.accessToken) {
        setCookie("accessToken", response.accessToken, 0.01) // 15 mins
        apiService.setAuthToken(response.accessToken)
      }

      if (response.refreshToken) {
        setCookie("refreshToken", response.refreshToken, 7) // 7 days if rememberMe
        apiService.setRefreshToken(response.refreshToken)
      }

      // ✅ Set user in context
      if (response.username) {
        login({
          username: response.username,
          email: response.email || "",
          role: response.role || "USER",
          _id: response._id || "",
        })
      }

      toast.success("Login successful!")
      navigate("/home")
    } catch (err) {
      const errorMsg = err.message || "Login failed"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-md mx-auto py-8">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
              <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to report fraud anonymously</p>
          </div>

          {error && (
              <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username or Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={formData.usernameOrEmail}
                    onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                    placeholder="Enter your email or username"
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                    required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link
                    to="/forgot-password"
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 border-gray-300 dark:border-gray-600 rounded text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition text-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
  )
}

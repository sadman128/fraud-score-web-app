"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Turnstile } from "@marsidev/react-turnstile"
import { toast } from "react-toastify"
import { apiService } from "../services/api" // ✅ Import apiService

const TURNSTILE_SITE_KEY = "0x4AAAAAACKpIxDjcBFjPsBA"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    turnstileToken: "",
  })
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState({
    username: "",
    phone: "",
    password: "",
  })

  // ✅ Username: lowercase, numbers only, max 20 chars
  const handleUsernameChange = (e) => {
    const raw = e.target.value
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9_-]/g, "")

    if (cleaned.length > 20) {
      setValidation((prev) => ({
        ...prev,
        username: "Username must be less than 20 characters",
      }))
      return
    }

    setValidation((prev) => ({
      ...prev,
      username: "",
    }))

    setFormData({ ...formData, username: cleaned })
  }

  // ✅ Phone: +88 format with 13 digits total
  const handlePhoneChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, phone: value })

    const phoneRegex = /^\+88\d{11}$/

    if (value && !phoneRegex.test(value)) {
      setValidation((prev) => ({
        ...prev,
        phone: "Phone must start with +88 and contain 13 digits total",
      }))
    } else {
      setValidation((prev) => ({
        ...prev,
        phone: "",
      }))
    }
  }

  // ✅ Password: min 8 chars, 1 uppercase, 1 symbol
  const handlePasswordChange = (e) => {
    const value = e.target.value
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

    if (value && !passwordRegex.test(value)) {
      setValidation((prev) => ({
        ...prev,
        password: "Password must be 8+ chars with 1 uppercase letter and 1 symbol",
      }))
    } else {
      setValidation((prev) => ({
        ...prev,
        password: "",
      }))
    }

    setFormData({ ...formData, password: value })
  }

  // ✅ Step 1: Register
  const handleRegister = async (e) => {
    e.preventDefault()

    // All fields required
    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    // Username validation
    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters")
      return
    }

    if (formData.username.length > 20) {
      toast.error("Username must be less than 20 characters")
      return
    }

    if (!/^[a-z0-9_-]+$/.test(formData.username)) {
      toast.error("Username can only contain lowercase letters, numbers, hyphens, and underscores")
      return
    }

    // Phone validation: +88 format with 13 digits
    const phoneRegex = /^\+88\d{11}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must start with +88 and contain 13 digits total")
      return
    }

    // Password validation: 8+ chars, 1 uppercase, 1 symbol
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be 8+ characters, include 1 uppercase letter and 1 symbol")
      return
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Terms agreement
    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions")
      return
    }

    // CAPTCHA verification
    if (!formData.turnstileToken) {
      toast.error("Please complete the Turnstile verification")
      return
    }

    setLoading(true)
    try {
      // ✅ USE apiService INSTEAD OF HARDCODED FETCH
      const data = await apiService.register({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        turnstileToken: formData.turnstileToken,
      })

      const msg = data.message || "Registration successful! Check your email for OTP"
      toast.success(msg)

      setStep(2)
      setOtp("")
      setFormData((prev) => ({ ...prev, turnstileToken: "" }))
    } catch (err) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    try {
      // ✅ USE apiService
      const data = await apiService.verifyOtp({
        email: formData.email,
        otp,
      })

      if (data.message === "Email verified successfully.") {
        setStep(3)
        toast.success("Account created successfully!")
        setTimeout(() => navigate("/login"), 2000)
      } else {
        toast.error(data.message || "Verification failed")
      }
    } catch (err) {
      if (err.message.includes("404")) {
        toast.error("Email not found")
        setTimeout(() => setStep(1), 3000)
      } else if (err.message.includes("Invalid")) {
        toast.error("Invalid or expired OTP")
      } else {
        toast.error(err.message || "Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Resend OTP
  const resendOtp = async () => {
    setLoading(true)
    try {
      // ✅ USE apiService
      const data = await apiService.resendOtp({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        turnstileToken: formData.turnstileToken,
      })

      toast.success("OTP resent successfully! Check your email")
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-md mx-auto py-8">
        <div className="card p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step >= s ? "bg-primary-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                      }`}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 ${step > s ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"}`} />}
                </div>
            ))}
          </div>

          {/* STEP 1: REGISTRATION */}
          {step === 1 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">FraudScore</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Create your account to start reporting fraud safely
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    ({formData.username.length}/20)
                  </span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                          type="text"
                          value={formData.username}
                          onChange={handleUsernameChange}
                          placeholder="johndoe123"
                          maxLength={20}
                          className={`w-full pl-11 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none transition ${
                              validation.username
                                  ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                          }`}
                          required
                      />
                    </div>
                    {validation.username && (
                        <p className="text-xs text-red-500 mt-1">{validation.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full pl-11 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                          required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">(+88 format)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                          type="tel"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="+88017xxxxxxx"
                          className={`w-full pl-11 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none transition ${
                              validation.phone
                                  ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                          }`}
                          required
                      />
                    </div>
                    {validation.phone && (
                        <p className="text-xs text-red-500 mt-1">{validation.phone}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    (8+ chars, 1 uppercase, 1 symbol)
                  </span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handlePasswordChange}
                          placeholder="Enter password"
                          className={`w-full pl-11 pr-11 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none transition ${
                              validation.password
                                  ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                          }`}
                          required
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {validation.password && (
                        <p className="text-xs text-red-500 mt-1">{validation.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          className="w-full pl-11 pr-11 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                          required
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 border-gray-300 dark:border-gray-600 rounded text-primary-600 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                        <button
                            type="button"
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
                            onClick={() => window.open("/terms.html", "_blank")}
                        >
                      terms &amp; conditions
                    </button>
                  </span>
                    </label>
                  </div>

                  {/* Turnstile CAPTCHA */}
                  <div>
                    <Turnstile
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={(token) => setFormData({ ...formData, turnstileToken: token })}
                        onExpire={() => setFormData({ ...formData, turnstileToken: "" })}
                        onError={() => toast.error("Turnstile error. Please reload and try again.")}
                        options={{ theme: "light" }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                      className="w-full py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                      type="submit"
                      disabled={loading}
                  >
                    {loading ? "Registering..." : "Sign up"}
                  </button>

                  {/* Login Link */}
                  <p className="mt-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                        onClick={() => navigate("/login")}
                    >
                      Sign in instead
                    </button>
                  </p>
                </form>
              </>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verify Email</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    We sent a 6-digit OTP to <strong>{formData.email}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full px-4 py-2 text-center text-2xl tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                        required
                    />
                  </div>

                  <button
                      className="w-full py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                      type="submit"
                      disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>

                  <button
                      className="w-full py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      type="button"
                      disabled={loading}
                      onClick={resendOtp}
                  >
                    Resend OTP
                  </button>
                </form>
              </>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Account Created!</h2>
                <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
              </div>
          )}
        </div>
      </div>
  )
}

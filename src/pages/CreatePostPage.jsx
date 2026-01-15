"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AlertTriangle, Upload, X, ImageIcon, Building2, FileText, Tag, Send, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const CATEGORIES = [
  { value: "REFUND_FRAUD", label: "Refund Fraud" },
  { value: "DELIVERY_SCAM", label: "Delivery Scam" },
  { value: "FAKE_PRODUCT", label: "Fake Product" },
  { value: "IDENTITY_THEFT", label: "Identity Theft" },
  { value: "PAYMENT_FRAUD", label: "Payment Fraud" },
  { value: "OTHER", label: "Other" },
]

export default function CreatePostPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    entityName: "",
    entityEmail: "",
    entityPhone: "",
    entityAddress: "",
  })
  const [images, setImages] = useState([])

  const handleImageAdd = () => {
    if (images.length < 5) {
      setImages([...images, { id: Date.now(), name: `evidence-${images.length + 1}.jpg` }])
    }
  }

  const handleImageRemove = (id) => {
    setImages(images.filter((img) => img.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      alert("Report submitted successfully! It will be reviewed by our moderators.")
      navigate("/")
    }, 1500)
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-danger-500" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Login Required</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You need to be logged in to submit a fraud report. Your identity will remain anonymous publicly.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      <div className="card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-danger-600 dark:text-danger-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Report Fraud</h1>
            <p className="text-gray-500 dark:text-gray-400">Your identity will remain anonymous publicly</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business/Person Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.entityName}
                  onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                  placeholder="Business or person name"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.entityEmail}
                  onChange={(e) => setFormData({ ...formData, entityEmail: e.target.value })}
                  placeholder="Contact email (if known)"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.entityPhone}
                  onChange={(e) => setFormData({ ...formData, entityPhone: e.target.value })}
                  placeholder="Contact phone (if known)"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address/Location
                </label>
                <input
                  type="text"
                  value={formData.entityAddress}
                  onChange={(e) => setFormData({ ...formData, entityAddress: e.target.value })}
                  placeholder="Business address or location"
                  className="input"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Report Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief title describing the fraud"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the fraud incident in detail. Include dates, amounts, and any other relevant information..."
                className="input min-h-[150px] resize-y"
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Evidence Images (Optional)
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400">{img.name}</span>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(img.id)}
                    className="absolute top-2 right-2 p-1 bg-danger-500 text-white rounded-full hover:bg-danger-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Add Image</span>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload up to 5 images as evidence. Screenshots, receipts, or chat logs are helpful.
            </p>
          </section>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Reports are reviewed before publishing</p>
            <button type="submit" disabled={loading} className="btn btn-primary flex items-center gap-2 px-6 py-3">
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

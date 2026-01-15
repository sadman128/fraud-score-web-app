"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn, ImageIcon } from "lucide-react"

export default function ImageGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null)

  if (!images || images.length === 0) {
    return (
      <div className="card p-8 text-center">
        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">No images attached</p>
      </div>
    )
  }

  const openLightbox = (index) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  const goToPrevious = () => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  const goToNext = () => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">{image}</span>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <ImageIcon className="w-24 h-24 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Image: {images[selectedIndex]}</p>
              <p className="text-sm text-gray-500 mt-2">
                {selectedIndex + 1} of {images.length}
              </p>
            </div>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  )
}

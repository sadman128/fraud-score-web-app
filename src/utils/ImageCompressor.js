/**
 * ImageCompressor Service
 *
 * Utility for compressing images before upload to reduce file size
 * Uses Canvas API to resize and re-encode images
 *
 * Benefits:
 * - Reduces file size by 60-80%
 * - Maintains acceptable quality
 * - Prevents server upload size errors
 * - Faster upload times
 */

/**
 * Compress a single image file
 *
 * Process:
 * 1. Read the image file
 * 2. Create canvas and draw image
 * 3. Resize if width/height > max dimensions
 * 4. Reduce quality (JPEG compression)
 * 5. Convert back to blob/file
 *
 * @param {File} file - Original image file
 * @param {number} quality - Compression quality 0-1 (default 0.7)
 * @param {number} maxWidth - Maximum width in pixels (default 1200)
 * @param {number} maxHeight - Maximum height in pixels (default 1200)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = async (file, quality = 0.7, maxWidth = 1200, maxHeight = 1200) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        // Read file as data URL
        reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
                // Calculate new dimensions maintaining aspect ratio
                let width = img.width
                let height = img.height

                if (width > maxWidth || height > maxHeight) {
                    // Scale down proportionally
                    const ratio = Math.min(maxWidth / width, maxHeight / height)
                    width = width * ratio
                    height = height * ratio
                }

                // Create canvas with new dimensions
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                // Draw and compress image on canvas
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                // Convert canvas to blob with reduced quality
                canvas.toBlob(
                    (blob) => {
                        // Create new File object from compressed blob
                        const compressedFile = new File(
                            [blob],
                            file.name,
                            { type: 'image/jpeg', lastModified: Date.now() }
                        )
                        resolve(compressedFile)
                    },
                    'image/jpeg',
                    quality
                )
            }

            img.onerror = () => {
                reject(new Error('Failed to load image'))
            }

            // Set image source to trigger onload
            img.src = e.target.result
        }

        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }

        // Start reading the file
        reader.readAsDataURL(file)
    })
}

/**
 * Compress multiple image files
 *
 * @param {File[]} files - Array of image files
 * @param {number} quality - Compression quality (default 0.7)
 * @returns {Promise<File[]>} Array of compressed files
 */
export const compressMultipleImages = async (files, quality = 0.7) => {
    try {
        // Compress all files in parallel
        const compressedFiles = await Promise.all(
            files.map(file => compressImage(file, quality))
        )
        return compressedFiles
    } catch (error) {
        console.error('Error compressing images:', error)
        throw error
    }
}

/**
 * Format file size for display
 *
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Calculate total size of multiple files
 *
 * @param {File[]} files - Array of files
 * @returns {number} Total size in bytes
 */
export const calculateTotalSize = (files) => {
    return files.reduce((total, file) => total + file.size, 0)
}

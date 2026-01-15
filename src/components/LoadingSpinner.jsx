export default function LoadingSpinner({ size = "md", text }) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primary-600`} />
      {text && <p className="mt-3 text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  )
}

export default function FraudScoreMeter({ score }) {
  const getScoreColor = () => {
    if (score >= 80) return { bg: "bg-red-500", text: "text-red-500", label: "High Risk" }
    if (score >= 60) return { bg: "bg-orange-500", text: "text-orange-500", label: "Medium-High Risk" }
    if (score >= 40) return { bg: "bg-yellow-500", text: "text-yellow-500", label: "Medium Risk" }
    if (score >= 20) return { bg: "bg-green-400", text: "text-green-400", label: "Low Risk" }
    return { bg: "bg-green-500", text: "text-green-500", label: "Very Low Risk" }
  }

  const { bg, text, label } = getScoreColor()

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Fraud Score</h3>
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(score / 100) * 352} 352`}
              className={text}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${text}`}>{score}%</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} text-white`}>
          {label}
        </span>
      </div>
    </div>
  )
}

import { Link } from "react-router-dom"
import { AlertOctagon, ChevronRight } from "lucide-react"

export default function TrendingCard({ entity, rank }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-red-500"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Link
      to={`/fraud-entity/${entity._id}`}
      className="card flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-lg font-bold text-gray-600 dark:text-gray-300">
        #{rank}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{entity.name}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <AlertOctagon className="w-3 h-3" />
          <span>{entity.totalReports} reports</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`text-2xl font-bold ${getScoreColor(entity.fraudScore)}`}>{entity.fraudScore}%</div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  )
}

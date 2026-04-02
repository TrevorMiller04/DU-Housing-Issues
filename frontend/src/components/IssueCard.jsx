import { useState } from 'react'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function IssueCard({
  issue,
  isExpanded = false,
  isSelected = false,
  showSelectMode = false,
  onToggleExpand,
  onToggleSelect,
  onResolve,
}) {
  const [photoOpen, setPhotoOpen] = useState(false)

  return (
    <>
      <div
        className={`border rounded-lg bg-white transition-shadow ${
          isExpanded ? 'shadow-md' : 'hover:shadow-sm'
        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        {/* Collapsed header — always visible */}
        <div
          className="flex items-start gap-3 p-4 cursor-pointer"
          onClick={onToggleExpand}
        >
          {showSelectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                onToggleSelect?.()
              }}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{issue.issue_type}</p>
            <p className="text-sm text-gray-500">
              {issue.floor_label} · {issue.room_label}
            </p>
            <p className="text-sm text-gray-500">
              {issue.submitter_name} · {timeAgo(issue.submitted_at)}
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Expanded detail */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
            {issue.description && (
              <p className="text-sm text-gray-700">{issue.description}</p>
            )}
            {issue.photo_url && (
              <div>
                <img
                  src={issue.photo_url}
                  alt="Issue photo"
                  className="max-h-48 rounded-md cursor-pointer object-cover"
                  onClick={() => setPhotoOpen(true)}
                />
              </div>
            )}
            <button
              onClick={onResolve}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Mark as Resolved
            </button>
          </div>
        )}
      </div>

      {/* Photo lightbox */}
      {photoOpen && issue.photo_url && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPhotoOpen(false)}
        >
          <img
            src={issue.photo_url}
            alt="Issue photo"
            className="max-w-full max-h-full rounded-lg object-contain"
          />
        </div>
      )}
    </>
  )
}

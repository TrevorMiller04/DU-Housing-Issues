import { useState } from 'react'
import IssueCard from '../components/IssueCard'
import { resolveIssue } from '../api'

export default function RoomPanel({ roomLabel, issues, onClose, onIssuesChange }) {
  const [expandedId, setExpandedId] = useState(null)

  async function handleResolve(issue) {
    try {
      await resolveIssue(issue.id)
      onIssuesChange((prev) => prev.filter((i) => i.id !== issue.id))
      if (expandedId === issue.id) setExpandedId(null)
    } catch {
      // silent — could add toast here in V2
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex justify-end" onClick={onClose}>
      <div
        className="relative h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{roomLabel}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {issues.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No issues</p>
          ) : (
            issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isExpanded={expandedId === issue.id}
                onToggleExpand={() =>
                  setExpandedId((id) => (id === issue.id ? null : issue.id))
                }
                onResolve={() => handleResolve(issue)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

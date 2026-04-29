import { useCallback, useEffect, useRef, useState } from 'react'
import IssueCard from '../components/IssueCard'
import UndoToast from '../components/UndoToast'
import { resolveIssue } from '../api'
import { FLOORS } from '../data/rooms'

function groupIssues(issues) {
  const grouped = {}
  for (const floor of FLOORS) {
    const floorIssues = issues.filter((i) => i.floor_id === floor.id)
    if (floorIssues.length === 0) continue

    const byRoom = {}
    for (const issue of floorIssues) {
      if (!byRoom[issue.room_id]) {
        byRoom[issue.room_id] = { label: issue.room_label, issues: [] }
      }
      byRoom[issue.room_id].issues.push(issue)
    }

    grouped[floor.id] = { label: floor.label, rooms: byRoom }
  }
  return grouped
}

export default function ListView({ issues, onIssuesChange }) {
  const [expandedId, setExpandedId] = useState(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState(new Set())
  // pendingDeletes: Map<issueId, { issue, timeoutId }>
  const pendingDeletes = useRef(new Map())
  const [undoCount, setUndoCount] = useState(0)

  // Flush all pending deletes — used on unmount, visibilitychange, and undo expiry.
  // keepalive:true ensures the DELETE requests survive iOS app close/backgrounding.
  function flushPending(keepalive = false) {
    for (const [id, { timeoutId }] of pendingDeletes.current) {
      clearTimeout(timeoutId)
      resolveIssue(id, { keepalive }).catch(() => {})
    }
    pendingDeletes.current.clear()
    setUndoCount(0)
  }

  // Flush on unmount and when app is hidden (iOS PWA close / background)
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') flushPending(true)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      flushPending(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function scheduleDelete(issue) {
    const timeoutId = setTimeout(() => {
      pendingDeletes.current.delete(issue.id)
      setUndoCount(pendingDeletes.current.size)
      resolveIssue(issue.id, { keepalive: true }).catch(() => {})
    }, 10000)

    pendingDeletes.current.set(issue.id, { issue, timeoutId })
    setUndoCount(pendingDeletes.current.size)
  }

  function removeFromUI(issueId) {
    onIssuesChange((prev) => prev.filter((i) => i.id !== issueId))
  }

  function handleResolve(issue) {
    removeFromUI(issue.id)
    if (expandedId === issue.id) setExpandedId(null)
    scheduleDelete(issue)
  }

  function handleResolveSelected() {
    for (const id of selected) {
      const issue = issues.find((i) => i.id === id)
      if (issue) {
        removeFromUI(issue.id)
        scheduleDelete(issue)
      }
    }
    setSelected(new Set())
    setSelectMode(false)
    setExpandedId(null)
  }

  function handleUndo() {
    for (const [id, { issue, timeoutId }] of pendingDeletes.current) {
      clearTimeout(timeoutId)
      onIssuesChange((prev) => {
        if (prev.find((i) => i.id === id)) return prev
        return [...prev, issue].sort(
          (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)
        )
      })
    }
    pendingDeletes.current.clear()
    setUndoCount(0)
  }

  const handleExpire = useCallback(() => {
    // The 10-second timeouts already fire the DELETEs individually
    // This just clears the undo UI
    pendingDeletes.current.clear()
    setUndoCount(0)
  }, [])

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const grouped = groupIssues(issues)

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">✅</p>
        <p className="text-xl font-semibold text-gray-700">No open issues</p>
        <p className="text-gray-400 mt-1">All clear across the house.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{issues.length} open issue{issues.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => {
            setSelectMode((v) => !v)
            setSelected(new Set())
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {selectMode ? 'Cancel' : 'Select'}
        </button>
      </div>

      {/* Grouped list */}
      {Object.entries(grouped).map(([floorId, { label: floorLabel, rooms }]) => (
        <div key={floorId}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {floorLabel}
          </h3>
          <div className="flex flex-col gap-4">
            {Object.entries(rooms).map(([roomId, { label: roomLabel, issues: roomIssues }]) => (
              <div key={roomId}>
                <p className="text-sm font-medium text-gray-600 mb-1">{roomLabel}</p>
                <div className="flex flex-col gap-2">
                  {roomIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      isExpanded={expandedId === issue.id}
                      isSelected={selected.has(issue.id)}
                      showSelectMode={selectMode}
                      onToggleExpand={() =>
                        setExpandedId((id) => (id === issue.id ? null : issue.id))
                      }
                      onToggleSelect={() => toggleSelect(issue.id)}
                      onResolve={() => handleResolve(issue)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Multi-select resolve bar */}
      {selectMode && selected.size > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-40">
          <button
            onClick={handleResolveSelected}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-xl font-semibold text-sm"
          >
            Resolve Selected ({selected.size})
          </button>
        </div>
      )}

      {/* Undo toast */}
      {undoCount > 0 && (
        <UndoToast count={undoCount} onUndo={handleUndo} onExpire={handleExpire} />
      )}
    </div>
  )
}

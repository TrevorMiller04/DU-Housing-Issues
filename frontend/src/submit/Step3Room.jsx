import { useEffect, useState } from 'react'
import FloorPlan from '../components/FloorPlan'
import { getIssues } from '../api'
import { getRoom } from '../data/rooms'

export default function Step3Room({ floor, onSelect }) {
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [activeIssues, setActiveIssues] = useState([])
  const [loadingIssues, setLoadingIssues] = useState(false)

  useEffect(() => {
    if (!selectedRoomId) {
      setActiveIssues([])
      return
    }
    setLoadingIssues(true)
    getIssues({ floorId: floor.id, roomId: selectedRoomId })
      .then(setActiveIssues)
      .catch(() => setActiveIssues([]))
      .finally(() => setLoadingIssues(false))
  }, [selectedRoomId, floor.id])

  function handleRoomClick(roomId) {
    setSelectedRoomId(roomId)
  }

  function handleConfirm() {
    const room = getRoom(selectedRoomId)
    if (room) onSelect(room)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Select the room</h2>
        <p className="text-gray-500 mt-1">Tap the room on the {floor.label} floor plan.</p>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <FloorPlan
          svgKey={floor.svgKey}
          selectedRoomId={selectedRoomId}
          onRoomClick={handleRoomClick}
          mode="select"
        />
      </div>

      {selectedRoomId && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
          <span className="font-medium text-blue-800">
            Selected: {getRoom(selectedRoomId)?.label}
          </span>
        </div>
      )}

      {/* Active issues banner */}
      {activeIssues.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-2">
            Active issue{activeIssues.length > 1 ? 's' : ''} already reported in this room:
          </p>
          <ul className="space-y-1">
            {activeIssues.map((issue) => (
              <li key={issue.id} className="text-sm text-amber-700">
                • {issue.issue_type}
                {issue.description ? ` — ${issue.description.slice(0, 60)}…` : ''}
              </li>
            ))}
          </ul>
          <p className="text-xs text-amber-600 mt-2">
            You can still submit a new issue if it's different.
          </p>
        </div>
      )}

      {loadingIssues && (
        <p className="text-sm text-gray-400 text-center">Checking for existing issues…</p>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedRoomId}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-lg font-medium transition-colors"
      >
        Confirm Room
      </button>
    </div>
  )
}

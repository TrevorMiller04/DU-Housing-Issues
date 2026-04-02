import { useCallback, useMemo, useState } from 'react'
import FloorPlan from '../components/FloorPlan'
import RoomPanel from './RoomPanel'
import { FLOORS } from '../data/rooms'

export default function FloorView({ issues, onIssuesChange }) {
  const [expandedFloorId, setExpandedFloorId] = useState(null)
  const [panelRoom, setPanelRoom] = useState(null)

  // Memoize per-floor Sets so FloorPlan's useEffect doesn't re-run on every render
  const activeRoomIdsMap = useMemo(() => {
    const map = {}
    for (const floor of FLOORS) {
      map[floor.id] = new Set(
        issues.filter((i) => i.floor_id === floor.id).map((i) => i.room_id)
      )
    }
    return map
  }, [issues])

  const issueCountsMap = useMemo(() => {
    const map = {}
    for (const floor of FLOORS) {
      const counts = {}
      for (const issue of issues) {
        if (issue.floor_id !== floor.id) continue
        counts[issue.room_id] = (counts[issue.room_id] || 0) + 1
      }
      map[floor.id] = counts
    }
    return map
  }, [issues])

  const handleRoomClick = useCallback((floorId, roomId) => {
    const activeIds = activeRoomIdsMap[floorId]
    if (!activeIds?.has(roomId)) return
    const roomLabel = issues.find((i) => i.room_id === roomId)?.room_label ?? roomId
    setPanelRoom({ roomId, label: roomLabel, floorId })
  }, [activeRoomIdsMap, issues])

  // Stable callback for the expanded floor — new reference only when the floor
  // or handleRoomClick changes, NOT on every render. Prevents FloorPlan's
  // useEffect from re-running infinitely (same fix as EMPTY_SET/EMPTY_COUNTS).
  const expandedRoomClickHandler = useCallback((roomId) => {
    if (expandedFloorId) handleRoomClick(expandedFloorId, roomId)
  }, [expandedFloorId, handleRoomClick])

  const expandedFloor = FLOORS.find((f) => f.id === expandedFloorId)

  return (
    <div className="flex flex-col gap-4">
      {expandedFloor ? (
        <>
          {/* Thumbnail switcher */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FLOORS.map((floor) => (
              <button
                key={floor.id}
                onClick={() => {
                  setExpandedFloorId(floor.id)
                  setPanelRoom(null)
                }}
                className={`flex-shrink-0 w-28 border-2 rounded-lg overflow-hidden transition-colors ${
                  floor.id === expandedFloorId
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="pointer-events-none scale-[0.4] origin-top-left w-[250%]">
                  <FloorPlan
                    svgKey={floor.svgKey}
                    activeRoomIds={activeRoomIdsMap[floor.id]}
                    mode="overview"
                  />
                </div>
                <p className="text-xs text-center py-1 font-medium text-gray-600 truncate px-1">
                  {floor.label}
                </p>
              </button>
            ))}
          </div>

          {/* Expanded floor */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <FloorPlan
              svgKey={expandedFloor.svgKey}
              activeRoomIds={activeRoomIdsMap[expandedFloor.id]}
              issueCounts={issueCountsMap[expandedFloor.id]}
              onRoomClick={expandedRoomClickHandler}
              mode="expanded"
            />
          </div>

          <button
            onClick={() => setExpandedFloorId(null)}
            className="text-sm text-gray-500 hover:text-gray-900 self-start"
          >
            ← All floors
          </button>
        </>
      ) : (
        /* Overview: 2×2 grid of floor thumbnails */
        <div className="grid grid-cols-2 gap-3">
          {FLOORS.map((floor) => {
            const totalIssues = issues.filter((i) => i.floor_id === floor.id).length

            return (
              <button
                key={floor.id}
                onClick={() => setExpandedFloorId(floor.id)}
                className="flex flex-col border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-colors text-left"
              >
                <div className="pointer-events-none overflow-hidden">
                  <FloorPlan
                    svgKey={floor.svgKey}
                    activeRoomIds={activeRoomIdsMap[floor.id]}
                    mode="overview"
                  />
                </div>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{floor.label}</span>
                  {totalIssues > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                      {totalIssues}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Room detail panel */}
      {panelRoom && (
        <RoomPanel
          roomLabel={panelRoom.label}
          issues={issues.filter(
            (i) => i.room_id === panelRoom.roomId && i.floor_id === panelRoom.floorId
          )}
          onClose={() => setPanelRoom(null)}
          onIssuesChange={(updater) => {
            onIssuesChange(updater)
            const updated = typeof updater === 'function' ? updater(issues) : updater
            const remaining = updated.filter(
              (i) => i.room_id === panelRoom.roomId && i.floor_id === panelRoom.floorId
            )
            if (remaining.length === 0) setPanelRoom(null)
          }}
        />
      )}
    </div>
  )
}

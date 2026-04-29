import { useEffect, useRef, useState } from 'react'
import { getRoom } from '../data/rooms'

import BasementSvg from '../assets/Basement.svg?raw'
import FirstFloorSvg from '../assets/FirstFloor.svg?raw'
import SecondFloorSvg from '../assets/SecondFloor.svg?raw'
import ThirdFloorSvg from '../assets/ThirdFloor.svg?raw'

const SVG_CONTENT = {
  Basement: BasementSvg,
  FirstFloor: FirstFloorSvg,
  SecondFloor: SecondFloorSvg,
  ThirdFloor: ThirdFloorSvg,
}

// Stable defaults outside component — prevents new object references on every render
// which would cause the useEffect to re-run infinitely.
const EMPTY_SET = new Set()
const EMPTY_COUNTS = {}

export default function FloorPlan({
  svgKey,
  activeRoomIds = EMPTY_SET,
  selectedRoomId = null,
  onRoomClick,
  issueCounts = EMPTY_COUNTS,
  mode = 'select',
}) {
  const containerRef = useRef(null)
  const [badges, setBadges] = useState([])
  const svgContent = SVG_CONTENT[svgKey]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const roomEls = container.querySelectorAll('[id^="Room-"]')

    roomEls.forEach((el) => {
      const roomId = el.getAttribute('id')
      const room = getRoom(roomId)
      const label = room?.label ?? roomId

      // Accessibility
      el.setAttribute('role', onRoomClick ? 'button' : 'region')
      el.setAttribute('tabindex', onRoomClick ? '0' : '-1')
      el.setAttribute('aria-label', label)

      // Highlight classes
      el.classList.remove('room--has-issues', 'room--selected')
      if (roomId === selectedRoomId) {
        el.classList.add('room--selected')
      } else if (activeRoomIds.has(roomId)) {
        el.classList.add('room--has-issues')
      }

      // Click / keyboard handlers
      el.onclick = onRoomClick ? () => onRoomClick(roomId) : null
      el.onkeydown = onRoomClick
        ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onRoomClick(roomId)
            }
          }
        : null
    })

    // Compute badge positions in 'expanded' mode
    if (mode === 'expanded' && Object.keys(issueCounts).length > 0) {
      const containerRect = container.getBoundingClientRect()
      const svgEl = container.querySelector('svg')
      const newBadges = []

      roomEls.forEach((el) => {
        const roomId = el.getAttribute('id')
        const count = issueCounts[roomId]
        if (!count) return

        // Find the first filled path in this room group for accurate hit-testing
        const fillPath = Array.from(el.querySelectorAll('path')).find(
          (p) => p.getAttribute('fill') && p.getAttribute('fill') !== 'none'
        )
        const geomEl = fillPath ?? el

        if (svgEl && geomEl.isPointInFill && geomEl.getBBox) {
          const bbox = geomEl.getBBox()
          const centerX = bbox.x + bbox.width / 2
          const centerY = bbox.y + bbox.height / 2
          const pt = svgEl.createSVGPoint()

          // Build candidate offsets: center first, then progressively further out
          const candidates = [[0, 0]]
          const steps = 5
          for (let i = 1; i <= steps; i++) {
            const d = i / steps
            candidates.push(
              [-bbox.width * d / 2, 0], [bbox.width * d / 2, 0],
              [0, -bbox.height * d / 2], [0, bbox.height * d / 2],
              [-bbox.width * d / 2, -bbox.height * d / 2],
              [bbox.width * d / 2, -bbox.height * d / 2],
              [-bbox.width * d / 2, bbox.height * d / 2],
              [bbox.width * d / 2, bbox.height * d / 2],
            )
          }

          let found = null
          for (const [dx, dy] of candidates) {
            pt.x = centerX + dx
            pt.y = centerY + dy
            if (geomEl.isPointInFill(pt)) { found = pt; break }
          }

          if (found) {
            const ctm = geomEl.getCTM()
            const pagePt = found.matrixTransform(ctm)
            newBadges.push({
              roomId,
              count,
              x: pagePt.x - containerRect.left,
              y: pagePt.y - containerRect.top,
            })
            return
          }
        }

        // Fallback: bounding rect center
        const rect = el.getBoundingClientRect()
        newBadges.push({
          roomId,
          count,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        })
      })

      setBadges(newBadges)
    } else {
      setBadges((prev) => (prev.length === 0 ? prev : []))
    }

    return () => {
      roomEls.forEach((el) => {
        el.onclick = null
        el.onkeydown = null
      })
    }
  }, [svgKey, activeRoomIds, selectedRoomId, onRoomClick, mode, issueCounts])

  if (!svgContent) return null

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {badges.map((b) => (
        <div
          key={b.roomId}
          className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: b.x, top: b.y }}
          aria-hidden="true"
        >
          {b.count}
        </div>
      ))}
    </div>
  )
}

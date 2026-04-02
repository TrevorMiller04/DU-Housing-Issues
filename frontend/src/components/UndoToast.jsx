import { useEffect, useState } from 'react'

export default function UndoToast({ count, onUndo, onExpire }) {
  const [seconds, setSeconds] = useState(10)

  useEffect(() => {
    if (seconds <= 0) {
      onExpire()
      return
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds, onExpire])

  if (count === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl text-sm">
      <span>
        {count === 1 ? 'Issue resolved.' : `${count} issues resolved.`}
      </span>
      <button
        onClick={onUndo}
        className="font-semibold text-blue-400 hover:text-blue-300"
      >
        Undo ({seconds}s)
      </button>
    </div>
  )
}

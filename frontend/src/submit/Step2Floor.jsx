import { FLOORS } from '../data/rooms'

const FLOOR_ICONS = {
  B: '🏚',
  '1': '1️⃣',
  '2': '2️⃣',
  '3': '3️⃣',
}

export default function Step2Floor({ onSelect }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Which floor?</h2>
        <p className="text-gray-500 mt-1">Select the floor where the issue is located.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {FLOORS.map((floor) => (
          <button
            key={floor.id}
            onClick={() => onSelect(floor)}
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <span className="text-3xl">{FLOOR_ICONS[floor.id]}</span>
            <span className="font-semibold text-gray-900">{floor.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

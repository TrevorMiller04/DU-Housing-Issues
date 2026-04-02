import { useRef, useState } from 'react'

export default function Step5Details({ onSubmit, loading }) {
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileRef = useRef()

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function handleRemovePhoto() {
    setPhoto(null)
    setPhotoPreview(null)
    fileRef.current.value = ''
  }

  function handleSubmit() {
    onSubmit({ description: description.trim() || null, photo })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Any details?</h2>
        <p className="text-gray-500 mt-1">Both fields are optional.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe the issue…"
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Photo (optional)</label>
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full max-h-48 object-cover rounded-xl border border-gray-200"
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-900"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
          >
            Tap to add a photo
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-lg font-medium transition-colors"
      >
        {loading ? 'Submitting…' : 'Submit Request'}
      </button>
    </div>
  )
}

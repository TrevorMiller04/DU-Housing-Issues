import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Step1Name from './Step1Name'
import Step2Floor from './Step2Floor'
import Step3Room from './Step3Room'
import Step4IssueType from './Step4IssueType'
import Step5Details from './Step5Details'
import ConfirmationScreen from './ConfirmationScreen'
import { submitIssue } from '../api'

const VALID_SLUG = import.meta.env.VITE_SUBMISSION_SLUG

const STEPS = ['Name', 'Floor', 'Room', 'Issue', 'Details']

export default function SubmitPage() {
  const { slug } = useParams()

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [floor, setFloor] = useState(null)   // { id, label, svgKey }
  const [room, setRoom] = useState(null)     // { floorId, roomId, label, issueTypes }
  const [issueType, setIssueType] = useState('')
  const [submittedIssue, setSubmittedIssue] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (slug !== VALID_SLUG) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
          <p className="text-gray-500 mt-2">This link is not valid.</p>
        </div>
      </div>
    )
  }

  async function handleSubmit({ description, photo }) {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('slug', VALID_SLUG)
      formData.append('submitter_name', name)
      formData.append('floor_id', floor.id)
      formData.append('floor_label', floor.label)
      formData.append('room_id', room.roomId)
      formData.append('room_label', room.label)
      formData.append('issue_type', issueType)
      if (description) formData.append('description', description)
      if (photo) formData.append('photo', photo)

      const issue = await submitIssue(formData)
      setSubmittedIssue(issue)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep(1)
    setName('')
    setFloor(null)
    setRoom(null)
    setIssueType('')
    setSubmittedIssue(null)
    setError(null)
  }

  if (submittedIssue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
          <ConfirmationScreen issue={submittedIssue} onReset={reset} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-6">
        {/* Progress */}
        <div className="flex items-center gap-1">
          {STEPS.map((label, i) => {
            const stepNum = i + 1
            const done = step > stepNum
            const active = step === stepNum
            return (
              <div key={label} className="flex items-center gap-1 flex-1 last:flex-none">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    done
                      ? 'bg-blue-600 text-white'
                      : active
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  aria-label={`Step ${stepNum}: ${label}${done ? ' (completed)' : active ? ' (current)' : ''}`}
                  role="status"
                >
                  {done ? '✓' : stepNum}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Back button */}
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="self-start text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            ← Back
          </button>
        )}

        {/* Steps */}
        {step === 1 && (
          <Step1Name name={name} onChange={setName} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2Floor
            onSelect={(f) => {
              setFloor(f)
              setRoom(null)
              setStep(3)
            }}
          />
        )}
        {step === 3 && floor && (
          <Step3Room
            floor={floor}
            onSelect={(r) => {
              setRoom(r)
              setStep(4)
            }}
          />
        )}
        {step === 4 && room && (
          <Step4IssueType
            room={room}
            onSelect={(type) => {
              setIssueType(type)
              setStep(5)
            }}
          />
        )}
        {step === 5 && (
          <Step5Details onSubmit={handleSubmit} loading={loading} />
        )}

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}

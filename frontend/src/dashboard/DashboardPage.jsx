import { useEffect, useState } from 'react'
import ListView from './ListView'
import FloorView from './FloorView'
import { getIssues, subscribePush } from '../api'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

function isIosSafariNotPwa() {
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent)
  const isStandalone =
    'standalone' in navigator
      ? navigator.standalone
      : window.matchMedia('(display-mode: standalone)').matches
  return isIos && !isStandalone
}

export default function DashboardPage() {
  const [tab, setTab] = useState('list')
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showA2HS, setShowA2HS] = useState(false)
  const [pushStatus, setPushStatus] = useState('idle') // idle | prompting | subscribed | denied | unsupported

  // Load issues on mount
  useEffect(() => {
    getIssues()
      .then(setIssues)
      .catch(() => setError('Failed to load issues.'))
      .finally(() => setLoading(false))
  }, [])

  // A2HS prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('a2hs-dismissed')
    if (!dismissed && isIosSafariNotPwa()) {
      setShowA2HS(true)
    }
  }, [])

  // Push notification setup
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushStatus('unsupported')
      return
    }

    const permission = Notification.permission
    if (permission === 'granted') {
      setPushStatus('subscribed')
    } else if (permission === 'denied') {
      setPushStatus('denied')
    } else {
      // Check if we've already asked
      const asked = localStorage.getItem('push-asked')
      if (!asked) setPushStatus('prompting')
    }
  }, [])

  async function handleSubscribePush() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
      await subscribePush(subscription.toJSON())
      localStorage.setItem('push-asked', '1')
      setPushStatus('subscribed')
    } catch {
      localStorage.setItem('push-asked', '1')
      setPushStatus('denied')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-bold text-gray-900">Maintenance</h1>
          </div>
          {/* Tabs */}
          <div className="flex border-b border-gray-100 -mb-px">
            {[
              { id: 'list', label: 'List' },
              { id: 'floor', label: 'Floor Plans' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* A2HS prompt */}
        {showA2HS && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-1">Enable push notifications</p>
            <p className="text-blue-700">
              To receive alerts for new issues, add this page to your Home Screen:
            </p>
            <ol className="list-decimal list-inside text-blue-700 mt-2 space-y-1">
              <li>Tap the Share button in Safari (box with arrow)</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
              <li>Open the app from your Home Screen</li>
            </ol>
            <button
              onClick={() => {
                localStorage.setItem('a2hs-dismissed', '1')
                setShowA2HS(false)
              }}
              className="mt-3 text-blue-600 underline text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Push notification prompt */}
        {pushStatus === 'prompting' && VAPID_PUBLIC_KEY && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm flex items-center justify-between gap-4">
            <p className="text-yellow-800">Get notified when new issues are submitted.</p>
            <button
              onClick={handleSubscribePush}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg font-medium text-sm flex-shrink-0"
            >
              Enable
            </button>
          </div>
        )}

        {pushStatus === 'unsupported' && (
          <div className="mb-4 bg-gray-100 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-semibold mb-1">Push notifications not available</p>
            <p>
              Your browser doesn't support Web Push. For iOS push notifications, use Safari
              and add this page to your Home Screen (requires iOS 16.4+).
            </p>
          </div>
        )}

        {/* Main content */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 py-12">{error}</p>
        )}

        {!loading && !error && tab === 'list' && (
          <ListView issues={issues} onIssuesChange={setIssues} />
        )}

        {!loading && !error && tab === 'floor' && (
          <FloorView issues={issues} onIssuesChange={setIssues} />
        )}
      </div>
    </div>
  )
}

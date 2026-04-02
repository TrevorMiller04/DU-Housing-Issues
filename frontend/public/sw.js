// Service Worker — handles push notifications for the manager dashboard

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}

  const title = data.title ?? 'New Maintenance Request'
  const options = {
    body: data.body ?? 'A new issue has been submitted.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: { url: data.url ?? '/dashboard' },
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url ?? '/dashboard'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        const existing = windowClients.find((c) => c.url.includes('/dashboard'))
        if (existing) return existing.focus()
        return clients.openWindow(targetUrl)
      })
  )
})

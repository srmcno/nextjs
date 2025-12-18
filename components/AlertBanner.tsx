'use client'

interface Alert {
  id: string
  level: 'info' | 'warning' | 'critical'
  message: string
  waterBody: string
}

interface AlertBannerProps {
  alerts: Alert[]
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) return null

  const criticalAlerts = alerts.filter(a => a.level === 'critical')
  const warningAlerts = alerts.filter(a => a.level === 'warning')
  const infoAlerts = alerts.filter(a => a.level === 'info')

  const alertsToShow = criticalAlerts.length > 0 ? criticalAlerts :
                       warningAlerts.length > 0 ? warningAlerts : infoAlerts

  if (alertsToShow.length === 0) return null

  const level = criticalAlerts.length > 0 ? 'critical' :
                warningAlerts.length > 0 ? 'warning' : 'info'

  const levelStyles = {
    critical: {
      bg: 'bg-red-600',
      text: 'text-white',
      icon: '🚨'
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-slate-900',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-sky-500',
      text: 'text-white',
      icon: 'ℹ️'
    }
  }

  const style = levelStyles[level]

  return (
    <div className={`${style.bg} ${style.text} border-b-4 border-slate-900/20`}>
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{style.icon}</span>
          <div className="flex-1">
            <div className="font-bold">
              {level === 'critical' && 'CRITICAL WATER LEVEL ALERT'}
              {level === 'warning' && 'Water Level Warning'}
              {level === 'info' && 'Water Level Information'}
            </div>
            <div className="mt-1 space-y-1">
              {alertsToShow.slice(0, 3).map((alert) => (
                <div key={alert.id} className="text-sm">
                  <span className="font-semibold">{alert.waterBody}:</span> {alert.message}
                </div>
              ))}
              {alertsToShow.length > 3 && (
                <div className="text-sm opacity-90">
                  + {alertsToShow.length - 3} more alert{alertsToShow.length - 3 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

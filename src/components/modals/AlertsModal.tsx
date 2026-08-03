import { useState } from 'react'
import { X, Bell, Plus, Trash2, Check, AlertCircle } from 'lucide-react'

interface Alert {
  id: string
  symbol: string
  type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'VOLUME' | 'NEWS'
  value: string
  status: 'ACTIVE' | 'TRIGGERED'
  timestamp: string
}

interface AlertsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'PRICE_ABOVE',
      value: '155.00',
      status: 'ACTIVE',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      symbol: 'MSFT',
      type: 'PRICE_BELOW',
      value: '375.00',
      status: 'ACTIVE',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      symbol: 'TSLA',
      type: 'VOLUME',
      value: '50M shares',
      status: 'TRIGGERED',
      timestamp: '30 minutes ago'
    },
    {
      id: '4',
      symbol: 'GOOGL',
      type: 'NEWS',
      value: 'Earnings',
      status: 'ACTIVE',
      timestamp: '1 day ago'
    }
  ])

  const [newAlert, setNewAlert] = useState<{
    symbol: string
    type: Alert['type']
    value: string
  }>({
    symbol: 'AAPL',
    type: 'PRICE_ABOVE',
    value: ''
  })

  const [showForm, setShowForm] = useState(false)

  const handleAddAlert = () => {
    if (newAlert.symbol && newAlert.value) {
      const alert: Alert = {
        id: Math.random().toString(),
        symbol: newAlert.symbol,
        type: newAlert.type,
        value: newAlert.value,
        status: 'ACTIVE',
        timestamp: 'Just now'
      }
      setAlerts([alert, ...alerts])
      setNewAlert({ symbol: 'AAPL', type: 'PRICE_ABOVE', value: '' })
      setShowForm(false)
    }
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  const getAlertTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'PRICE_ABOVE':
        return 'Price Above'
      case 'PRICE_BELOW':
        return 'Price Below'
      case 'VOLUME':
        return 'High Volume'
      case 'NEWS':
        return 'News Alert'
    }
  }

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length
  const triggeredCount = alerts.filter((a) => a.status === 'TRIGGERED').length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Price & News Alerts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 text-center">
              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">Total Alerts</p>
              <p className="text-3xl font-bold text-blue-600">{alerts.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 text-center">
              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">Active</p>
              <p className="text-3xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200 text-center">
              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">Triggered</p>
              <p className="text-3xl font-bold text-orange-600">{triggeredCount}</p>
            </div>
          </div>

          {/* New Alert Form */}
          {showForm ? (
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 space-y-4">
              <h3 className="font-bold text-gray-900">Create New Alert</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Symbol</label>
                  <select
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold"
                  >
                    {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NFLX', 'META', 'NVDA'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as Alert['type'] })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold"
                  >
                    <option value="PRICE_ABOVE">Price Above</option>
                    <option value="PRICE_BELOW">Price Below</option>
                    <option value="VOLUME">High Volume</option>
                    <option value="NEWS">News Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {newAlert.type === 'NEWS' ? 'Keywords' : newAlert.type === 'VOLUME' ? 'Volume Threshold' : 'Price'}
                </label>
                <input
                  type={newAlert.type === 'NEWS' ? 'text' : 'number'}
                  placeholder={newAlert.type === 'NEWS' ? 'e.g., earnings, acquisition' : newAlert.type === 'VOLUME' ? 'e.g., 50M' : 'e.g., 150.00'}
                  value={newAlert.value}
                  onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  step="0.01"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddAlert}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Alert
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-blue-400 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Alert
            </button>
          )}

          {/* Alerts List */}
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold">No alerts yet</p>
                <p className="text-sm text-gray-500">Create an alert to monitor prices and news</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 flex items-start justify-between ${
                    alert.status === 'TRIGGERED'
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  } transition-all`}
                >
                  <div className="flex gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.status === 'TRIGGERED' ? 'bg-orange-200' : 'bg-blue-200'
                      }`}
                    >
                      {alert.status === 'TRIGGERED' ? (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Bell className="w-5 h-5 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{alert.symbol}</h4>
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {getAlertTypeLabel(alert.type)}
                        </span>
                        {alert.status === 'TRIGGERED' && (
                          <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            TRIGGERED
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700">
                        {getAlertTypeLabel(alert.type)}: <span className="font-semibold">{alert.value}</span>
                      </p>

                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {alert.status === 'TRIGGERED' && (
                      <button
                        onClick={() => {
                          const updated = alerts.map((a) =>
                            a.id === alert.id ? { ...a, status: 'ACTIVE' as const } : a
                          )
                          setAlerts(updated)
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as resolved"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function TebexLogs() {
  const [logs, setLogs] = useState([])
  const [error, setError] = useState(null)

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/tebex-logs')
      setLogs(res.data.logs)
    } catch (err) {
      console.error(err)
      setError('Failed to load logs.')
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-red-500">💰 Tebex Logs</h2>

      {error && <p className="text-red-400">{error}</p>}
      <button
        onClick={fetchLogs}
        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded mb-4"
      >
        Refresh Logs
      </button>

      <div className="bg-neutral-900 border border-neutral-700 rounded p-4 max-h-[500px] overflow-y-auto text-sm whitespace-pre-wrap">
        {logs.length > 0 ? (
          logs.map((line, i) => <p key={i}>{line}</p>)
        ) : (
          <p className="text-neutral-500">No logs found.</p>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ConfigEditor() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    axios.get('/api/config').then((res) => {
      setConfig(res.data)
      setLoading(false)
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/config', config)
      setStatus('✅ Config saved!')
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to save config.')
    }
  }

  if (loading) return <p>Loading config...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-red-500">🛠 Config Editor</h2>

      {status && <p className="mb-4">{status}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {['logChannel', 'ticketCategory', 'verifiedRole', 'unverifiedRole'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize text-sm">{field}</label>
            <input
              type="text"
              name={field}
              value={config[field] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 text-sm">Verify Cooldown (seconds)</label>
          <input
            type="number"
            name="cooldowns.verify"
            value={config.cooldowns?.verify || ''}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                cooldowns: { ...prev.cooldowns, verify: parseInt(e.target.value) },
              }))
            }
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
        >
          Save Config
        </button>
      </form>
    </div>
  )
}

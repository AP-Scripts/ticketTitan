import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProtectedUsers() {
  const [config, setConfig] = useState(null)
  const [newId, setNewId] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    axios.get('/api/config').then((res) => {
      setConfig(res.data)
    })
  }, [])

  const addUser = () => {
    if (!newId || config.protectedUsers.includes(newId)) return
    const updated = [...config.protectedUsers, newId]
    save(updated)
  }

  const removeUser = (id) => {
    const updated = config.protectedUsers.filter((uid) => uid !== id)
    save(updated)
  }

  const save = async (updatedList) => {
    const updatedConfig = { ...config, protectedUsers: updatedList }
    try {
      await axios.post('/api/config', updatedConfig)
      setConfig(updatedConfig)
      setNewId('')
      setStatus('✅ Changes saved.')
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to update config.')
    }
  }

  if (!config) return <p>Loading config...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-red-500">🛡️ Protected Users</h2>

      {status && <p className="mb-2">{status}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          placeholder="Enter Discord User ID"
          className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white w-full"
        />
        <button
          onClick={addUser}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {config.protectedUsers.length > 0 ? (
          config.protectedUsers.map((id) => (
            <div key={id} className="flex items-center justify-between bg-neutral-800 px-4 py-2 rounded">
              <span className="text-sm text-white">{id}</span>
              <button
                onClick={() => removeUser(id)}
                className="text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-neutral-500">No protected users set.</p>
        )}
      </div>
    </div>
  )
}

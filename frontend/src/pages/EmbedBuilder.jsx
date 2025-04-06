import { useState } from 'react'
import axios from 'axios'

export default function EmbedBuilder() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [footer, setFooter] = useState('')
  const [channelId, setChannelId] = useState('')
  const [status, setStatus] = useState(null)

  const handleSend = async () => {
    try {
      await axios.post('/api/embed', {
        title,
        description,
        footer,
        channelId,
      })
      setStatus('✅ Embed sent successfully!')
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to send embed.')
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-red-500">🎨 Embed Builder</h2>

      <div className="space-y-4">
        <input
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded"
          type="text"
          placeholder="Channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded"
          type="text"
          placeholder="Embed Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded"
          rows={5}
          placeholder="Embed Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded"
          type="text"
          placeholder="Footer (optional)"
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
        />
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-white"
          onClick={handleSend}
        >
          Send Embed
        </button>

        {status && <p className="text-sm mt-3">{status}</p>}
      </div>

      {/* Live Preview */}
      <div className="mt-8 p-4 rounded bg-neutral-800 border border-neutral-700">
        <h3 className="text-xl font-bold text-red-400">{title || 'Preview Title'}</h3>
        <p className="text-white mt-2 whitespace-pre-line">{description || 'Preview description...'}</p>
        {footer && (
          <p className="text-sm text-neutral-400 mt-4 border-t border-neutral-600 pt-2">{footer}</p>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
    return (
      <div className="text-white">
        <h2 className="text-3xl font-bold mb-4 text-red-500">🎟️ Ticket Titan Dashboard</h2>
  
        <div className="space-y-4">
          <p>Welcome to your bot admin panel. From here you can:</p>
  
          <ul className="list-disc list-inside ml-4">
            <li>⚙️ Edit your <strong>config.json</strong> live</li>
            <li>🎨 Build and send custom embeds</li>
            <li>🧑‍💼 Manage protected users</li>
            <li>📜 View ticket transcripts (coming soon)</li>
            <li>💰 Track Tebex order logs</li>
          </ul>
  
          <p className="text-neutral-400 text-sm mt-6">
            Built with ❤️ by you + ChatGPT. 
          </p>
        </div>
      </div>
    )
  }
  
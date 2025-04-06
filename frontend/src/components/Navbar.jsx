import { NavLink } from 'react-router-dom'

export default function Navbar({ user }) {
  const baseLink =
    'text-white hover:text-red-500 px-4 py-2 transition-all duration-150'
  const activeLink =
    'text-red-500 font-semibold border-b-2 border-red-500'

  return (
    <nav className="bg-neutral-800 border-b border-neutral-700 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-500">Ticket Titan Admin</h1>

        <div className="flex gap-4 text-sm items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${baseLink} ${activeLink}` : baseLink
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/config"
            className={({ isActive }) =>
              isActive ? `${baseLink} ${activeLink}` : baseLink
            }
          >
            Config
          </NavLink>
          <NavLink
            to="/embed"
            className={({ isActive }) =>
              isActive ? `${baseLink} ${activeLink}` : baseLink
            }
          >
            Embed
          </NavLink>
          <NavLink
            to="/tebex"
            className={({ isActive }) =>
              isActive ? `${baseLink} ${activeLink}` : baseLink
            }
          >
            Tebex Logs
          </NavLink>
          <NavLink
            to="/protection"
            className={({ isActive }) =>
              isActive ? `${baseLink} ${activeLink}` : baseLink
            }
          >
            Protection
          </NavLink>

          {/* User Avatar + Logout */}
          <div className="flex items-center gap-2 ml-4">
            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm">{user.username}</span>
            <a
              href="/logout"
              className="text-red-500 hover:underline text-sm ml-2"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

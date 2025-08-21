import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LogOut, User, History, Home } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center text-xl font-bold text-blue-600">
              <Home className="h-6 w-6 mr-2" />
              Upivot
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Drills
              </Link>
              <Link
                to="/history"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <History className="h-4 w-4 inline mr-1" />
                History
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 p-2 rounded-md"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
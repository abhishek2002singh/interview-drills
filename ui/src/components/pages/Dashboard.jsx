import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Clock, BarChart3, Tag } from 'lucide-react'
import { BASE_URL } from '../../utils/constant'

const Dashboard = () => {
  const [drills, setDrills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDrills()
  }, [])

  const fetchDrills = async () => {
    try {
      const response = await axios.get(BASE_URL+'/api/drills')
      setDrills(response.data)
    } catch (error) {
      setError('Failed to fetch drills')
      console.error('Error fetching drills:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Interview Drills</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill) => (
          <div key={drill._id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{drill.title}</h3>
              
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(drill.difficulty)}`}>
                  {drill.difficulty}
                </span>
                <div className="flex items-center ml-4 text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">5 questions</span>
                </div>
              </div>

              {drill.tags && drill.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Tag className="h-4 w-4 mr-1" />
                    <span className="text-sm">Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {drill.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {drill.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{drill.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Link
                to={`/drill/${drill._id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded 
                         transition-colors duration-200 flex items-center justify-center"
              >
                Start Drill
                <BarChart3 className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {drills.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>No drills available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
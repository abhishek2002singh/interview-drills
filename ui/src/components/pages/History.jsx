import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Calendar, Clock, BarChart3, ArrowRight } from 'lucide-react'
import { BASE_URL } from '../../utils/constant'

const History = () => {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAttempts()
  }, [])

  const fetchAttempts = async () => {
    try {
      const response = await axios.get(BASE_URL+'/api/attempts?limit=5', { withCredentials: true })
      setAttempts(response.data)
    } catch (error) {
      setError('Failed to fetch attempt history')
      console.error('Error fetching attempts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Attempt History</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Attempt History</h1>
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Attempt History</h1>

      {attempts.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">You haven't completed any drills yet.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white 
                     px-6 py-3 rounded-lg transition-colors"
          >
            Start Your First Drill
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div key={attempt._id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {attempt.drillId?.title || 'Unknown Drill'}
                </h3>
                <span className={`text-xl font-bold ${getScoreColor(attempt.score)}`}>
                  {attempt.score}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(attempt.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(attempt.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {attempt.drillId && (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    to={`/drill/${attempt.drillId._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Retry this drill
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {attempts.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">Showing last {attempts.length} attempts</p>
        </div>
      )}
    </div>
  )
}

export default History
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { BASE_URL } from '../../utils/constant'

const Drill = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [drill, setDrill] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDrill()
  }, [id])

  const fetchDrill = async () => {
    try {
      const response = await axios.get(BASE_URL+`/api/drills/${id}`)
      setDrill(response.data)
      // Initialize answers object
      const initialAnswers = {}
      response.data.questions.forEach((question, index) => {
        initialAnswers[index] = ''
      })
      setAnswers(initialAnswers)
    } catch (error) {
      setError('Failed to fetch drill')
      console.error('Error fetching drill:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }))
  }

  const handleSubmit = async () => {
    if (Object.values(answers).some(answer => !answer.trim())) {
      alert('Please answer all questions before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const formattedAnswers = Object.entries(answers).map(([index, text]) => ({
        questionId: drill.questions[parseInt(index)]._id,
        text
      }))

      const response = await axios.post(BASE_URL+'/api/attempts', {
        drillId: id,
        answers: formattedAnswers
      }, { withCredentials: true })

      setResult(response.data)
    } catch (error) {
      setError('Failed to submit answers')
      console.error('Error submitting answers:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n}>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center 
                          ${result.score >= 80 ? 'bg-green-100 text-green-600' : 
                            result.score >= 60 ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-red-100 text-red-600'}`}>
            {result.score >= 80 ? (
              <CheckCircle className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Drill Completed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            You scored {result.score}% on {drill.title}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.score}%</div>
                <div className="text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{drill.questions.length}</div>
                <div className="text-gray-600">Total Questions</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/history')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              View History
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Another Drill
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{drill.title}</h1>
        <p className="text-gray-600 mb-6">Answer all 5 questions to complete this drill.</p>

        <div className="space-y-8">
          {drill.questions.map((question, index) => (
            <div key={question._id} className="border-b pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Question {index + 1}: {question.prompt}
              </h3>
              
              <textarea
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white 
                     font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Drill
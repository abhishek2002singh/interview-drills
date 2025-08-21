import { useAuth } from '../../hooks/useAuth'
import { ArrowRight, Brain } from 'lucide-react'

const Landing = () => {
  const { login } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-8">
          <Brain className="h-16 w-16 text-blue-600" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Master Your Interview Skills
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Practice with realistic interview drills, get instant feedback, and track your progress. 
          Prepare for your dream job with Upivot.
        </p>

        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg 
                   transition-colors duration-200 flex items-center justify-center mx-auto 
                   text-lg shadow-lg hover:shadow-xl"
        >
          Sign in with Google
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-3">Realistic Drills</h3>
            <p className="text-gray-600">Practice with questions from top companies</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-3">Instant Feedback</h3>
            <p className="text-gray-600">Get scored immediately with keyword matching</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-3">Progress Tracking</h3>
            <p className="text-gray-600">Monitor your improvement over time</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
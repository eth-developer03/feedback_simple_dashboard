import Link from 'next/link'
import { Star, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Fynd AI Feedback System
          </h1>
          <p className="text-xl text-gray-600">
            Production-grade AI-powered customer feedback management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/user">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                User Dashboard
              </h2>
              <p className="text-gray-600 text-center mb-4">
                Submit your feedback and receive instant AI-powered responses
              </p>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <span className="text-blue-700 font-medium">Public Access</span>
              </div>
            </div>
          </Link>

          <Link href="/admin">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <BarChart3 className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 text-center mb-4">
                View all submissions with AI-generated insights and recommendations
              </p>
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <span className="text-indigo-700 font-medium">Internal Access</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Built for Fynd AI Intern Assessment | Production-Ready Architecture
          </p>
        </div>
      </div>
    </div>
  )
}

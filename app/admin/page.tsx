'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, Filter, Home, RefreshCw, Clock } from 'lucide-react'
import Link from 'next/link'
import { Review } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const fetchReviews = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch('/api/reviews')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch reviews')
      }

      setReviews(data.data)
      setError('')
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchReviews, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews

  const stats = {
    total: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
    byRating: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((r) => r.rating === rating).length,
    })),
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <button
            onClick={fetchReviews}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Auto-refreshes every 10s
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900">{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.averageRating}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <div>
                <p className="text-sm text-green-600 font-medium mb-2">Distribution</p>
                <div className="space-y-1">
                  {stats.byRating.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center text-sm">
                      <span className="w-8 text-green-900">{rating}★</span>
                      <div className="flex-1 bg-green-200 rounded-full h-2 ml-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%',
                          }}
                        ></div>
                      </div>
                      <span className="w-8 text-right text-green-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterRating === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filterRating === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {rating}★
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews found</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating}/5
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">USER REVIEW</p>
                      <p className="text-gray-800">{review.review_text}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">USER RESPONSE</p>
                      <p className="text-gray-800 italic">{review.user_response}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-blue-600 mb-2">AI SUMMARY</p>
                        <p className="text-sm text-gray-700">{review.admin_summary}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-600 mb-2">
                          RECOMMENDED ACTIONS
                        </p>
                        <ul className="space-y-1">
                          {review.recommended_actions.map((action, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

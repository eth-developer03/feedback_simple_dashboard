import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateFeedbackResponse } from '@/lib/llm'
import { reviewSubmissionSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = reviewSubmissionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { rating, review_text } = validation.data

    // Handle empty reviews gracefully
    const effectiveReviewText = review_text.trim() || 'No additional comments provided'

    // Generate AI responses (server-side only)
    const llmResponse = await generateFeedbackResponse(rating, effectiveReviewText)

    // Store in database
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          rating,
          review_text: effectiveReviewText,
          user_response: llmResponse.userResponse,
          admin_summary: llmResponse.adminSummary,
          recommended_actions: llmResponse.recommendedActions,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save review' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        user_response: data.user_response,
      },
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

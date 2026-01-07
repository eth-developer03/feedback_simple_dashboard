// FREE Groq API Integration - Super fast and reliable!
// Get key from: https://console.groq.com/keys

export type LLMResponse = {
  userResponse: string
  adminSummary: string
  recommendedActions: string[]
}

export async function generateFeedbackResponse(
  rating: number,
  reviewText: string
): Promise<LLMResponse> {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not found')
    }

    // Generate user-facing response
    const userPrompt = `You are a customer service AI for an e-commerce platform. A customer has left a ${rating}-star review: "${reviewText}".

Generate a professional, empathetic response that:
1. Acknowledges their feedback
2. Addresses their sentiment appropriately
3. Is brief (2-3 sentences)
4. Matches the tone to their rating (grateful for 4-5 stars, apologetic for 1-3 stars)

Response:`

    const userResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and free!
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.7,
        max_tokens: 150,
      }),
    })

    const userData = await userResponse.json()
    const userText = userData.choices?.[0]?.message?.content || 
      'Thank you for your feedback. We appreciate you taking the time to share your experience with us.'

    // Generate admin summary and actions
    const adminPrompt = `Analyze this customer review for internal operations:
Rating: ${rating}/5
Review: "${reviewText}"

Provide:
1. A brief summary (1 sentence) highlighting the key issue or praise
2. Exactly 3 recommended actions for the team

Format your response as JSON:
{
  "summary": "one sentence summary",
  "actions": ["action 1", "action 2", "action 3"]
}`

    const adminResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: adminPrompt }],
        temperature: 0.5,
        max_tokens: 200,
        response_format: { type: 'json_object' }
      }),
    })

    const adminData = await adminResponse.json()
    const adminContent = adminData.choices?.[0]?.message?.content || '{}'
    
    // Clean up JSON (remove markdown if present)
    const cleanedContent = adminContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const adminParsed = JSON.parse(cleanedContent)

    return {
      userResponse: userText.trim(),
      adminSummary: adminParsed.summary || 'Review received and logged.',
      recommendedActions: adminParsed.actions || [
        'Review customer feedback',
        'Follow up if necessary',
        'Monitor similar issues'
      ]
    }
  } catch (error) {
    console.error('LLM Error:', error)
    
    // Graceful fallback
    const fallbackResponse = rating >= 4 
      ? 'Thank you for your positive feedback! We\'re thrilled to hear you had a great experience.'
      : 'Thank you for your feedback. We apologize for any inconvenience and are committed to improving your experience.'
    
    return {
      userResponse: fallbackResponse,
      adminSummary: `${rating}-star review requiring attention`,
      recommendedActions: [
        'Review customer feedback in detail',
        'Assign to appropriate team',
        rating <= 2 ? 'Priority follow-up required' : 'Monitor for trends'
      ]
    }
  }
}
import { NextRequest, NextResponse } from 'next/server'

// Mock Gemini API integration
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { message: 'Query is required' },
        { status: 400 }
      )
    }

    // In production, this would call the actual Gemini API
    const response = await callGeminiAPI(query)

    return NextResponse.json({
      response: response,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Query Bot Error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to process query' },
      { status: 500 }
    )
  }
}

// Mock function - replace with actual Gemini API call
async function callGeminiAPI(query: string): Promise<string> {
  // For demo purposes, we'll return mock responses
  // In production, integrate with Gemini API:
  // const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  const mockResponses: { [key: string]: string } = {
    'dsa': 'Top DSA topics for placements:\n\n1. Arrays & Strings - 20%\n2. Linked Lists - 15%\n3. Trees & Graphs - 25%\n4. Dynamic Programming - 20%\n5. Hash Tables - 10%\n6. Stacks & Queues - 10%\n\nFocus on implementation and time/space complexity analysis.',
    'system design': 'System Design Interview Tips:\n\n1. Clarify requirements first\n2. Discuss trade-offs\n3. Design high-level architecture\n4. Deep dive into components\n5. Discuss scalability\n6. Handle edge cases\n\nPractice on platforms like LeetCode and SystemDesignInterview.',
    'resume': 'Resume Optimization Tips:\n\n1. Use action verbs (Built, Designed, Optimized)\n2. Quantify achievements (improved by 40%)\n3. Keep it concise (1-2 pages)\n4. Highlight relevant skills\n5. Include projects with impact\n6. Use ATS-friendly format\n\nTailor your resume for each role.',
    'stress': 'Handling Interview Stress:\n\n1. Practice deep breathing\n2. Mock interviews to build confidence\n3. Get adequate sleep before\n4. Positive self-talk\n5. Remember: interviewers want you to succeed\n6. Take pauses when needed\n\nYou\'ve got this! Good luck!'
  };

  // Find matching response
  const lowerQuery = query.toLowerCase()
  for (const [key, response] of Object.entries(mockResponses)) {
    if (lowerQuery.includes(key)) {
      return response
    }
  }

  // Default response
  return `Thank you for your question: "${query}"\n\nBased on placement interview preparation best practices:\n\n1. Break down the problem\n2. Think out loud\n3. Ask clarifying questions\n4. Optimize your solution\n5. Test with examples\n\nFor more detailed guidance, consult the official Gemini API documentation or interview prep resources.`
}

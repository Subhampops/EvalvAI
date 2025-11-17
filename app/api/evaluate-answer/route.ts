import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer, category } = await request.json()

    // Simple evaluation logic - in production, use Gemini API for smart evaluation
    const userAnswerLower = userAnswer.toLowerCase()
    const correctAnswerLower = correctAnswer.toLowerCase()

    // Check for key terms presence
    const correctTerms = correctAnswerLower.split(' ').filter(w => w.length > 3)
    const matchedTerms = correctTerms.filter(term => userAnswerLower.includes(term))
    const matchPercentage = matchedTerms.length / correctTerms.length

    const isCorrect = matchPercentage > 0.6
    const feedback = isCorrect
      ? 'Correct! Your answer demonstrates good understanding of the concept.'
      : 'Good attempt! Your answer has some correct elements, but review the complete solution above.'

    return NextResponse.json({
      isCorrect,
      feedback,
      matchPercentage: Math.round(matchPercentage * 100)
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to evaluate answer' },
      { status: 500 }
    )
  }
}

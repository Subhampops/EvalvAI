import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { testId, userResponse, testType } = await request.json()

    // In production, use Gemini API for intelligent evaluation
    const mockResult = {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      communication: Math.floor(Math.random() * 25) + 75,
      confidence: Math.floor(Math.random() * 20) + 70,
      engagement: Math.floor(Math.random() * 30) + 65,
      feedback: testType === 'GD'
        ? 'Excellent participation! You presented balanced perspectives and actively listened to others. Your points were well-articulated and relevant to the topic. Work on being more concise while maintaining depth.'
        : 'Great response! You used the STAR method effectively and provided specific examples. Your explanation was clear and demonstrated problem-solving skills. Try to add more metrics about the impact of your actions.',
      improvements: [
        'Add more specific metrics and data points to support your claims',
        'Work on managing speaking time - aim for clear and concise responses',
        'Engage more with counterarguments and show flexibility in thinking',
        'Practice active listening - acknowledge others\' points before responding'
      ]
    }

    return NextResponse.json(mockResult)
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to evaluate mock test' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      )
    }

    // In production, you would:
    // 1. Use Gemini API to extract and analyze resume text
    // 2. Parse the resume with ML
    // 3. Generate job recommendations

    const mockAnalysis = {
      score: 78,
      suggestedRoles: [
        'Software Engineer',
        'Full Stack Developer',
        'Backend Engineer'
      ],
      strengths: [
        'Strong technical skills in React and Node.js',
        'Clear project experience with measurable impact',
        'Good educational background from reputable institution',
        'Relevant internship experience',
        'Clear project descriptions with technologies used'
      ],
      improvements: [
        'Add quantifiable metrics to achievements (e.g., "Improved performance by 40%")',
        'Include leadership or team collaboration examples',
        'Add certifications or specialized training',
        'Better formatting to make it ATS-friendly',
        'Add more technical depth to project descriptions'
      ],
      missingSkills: [
        'System Design',
        'AWS/Cloud',
        'Docker',
        'Kubernetes',
        'GraphQL',
        'Microservices'
      ],
      overallFeedback: `Your resume shows good technical foundation! You've got solid experience with modern technologies. Here's how to make it even better:\n\n1. Quantify your achievements - Use numbers to show impact\n2. Add leadership experience - Show team collaboration\n3. Highlight problem-solving - Focus on challenges you overcame\n4. ATS Optimization - Use standard section headers\n5. Tailor for roles - Customize for each job application\n\nWith these improvements, you'll be in the top 20% of candidates!`
    }

    return NextResponse.json(mockAnalysis)
  } catch (error: any) {
    console.error('Resume Analysis Error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}

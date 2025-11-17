import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // In a real app, you'd verify against a database
    const user = {
      id: 'user-' + Date.now(),
      email,
      name: email.split('@')[0],
      signedInAt: new Date().toISOString(),
    }

    const response = NextResponse.json(
      { message: 'Sign in successful', user },
      { status: 200 }
    )

    response.cookies.set('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

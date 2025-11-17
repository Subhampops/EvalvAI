import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a real app, you'd hash the password and store in a database
    // For now, we'll just create a simple in-memory session
    const user = {
      id: 'user-' + Date.now(),
      name,
      email,
      createdAt: new Date().toISOString(),
    }

    const response = NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
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

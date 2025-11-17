'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function GuestLogin() {
  const router = useRouter()

  useEffect(() => {
    const guestSession = {
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@interviewai.local',
      isGuest: true,
    }

    localStorage.setItem('guestSession', JSON.stringify(guestSession))
    sessionStorage.setItem('guestSession', JSON.stringify(guestSession))
  }, [])

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Guest Access</CardTitle>
          <CardDescription>Explore InterviewAI without creating an account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>As a guest, you can:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Try all features without restrictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Practice with AI tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Take mock tests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">✗</span>
                <span>Your data will not be saved after you close the browser</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={handleContinue} className="w-full">
              Continue as Guest
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>

          <div className="text-center text-sm">
            Want to save your progress?{' '}
            <a href="/sign-up" className="text-primary hover:text-primary/80 font-semibold">
              Create an account
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

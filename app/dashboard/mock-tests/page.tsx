'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader, Clock, Users, BarChart3, Play, RotateCw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MockTest {
  id: string
  name: string
  description: string
  duration: number
  participants: number
  difficulty: string
  topics: string[]
}

interface TestResult {
  score: number
  feedback: string
  improvements: string[]
  communication: number
  confidence: number
  engagement: number
}

const mockTests: MockTest[] = [
  {
    id: '1',
    name: 'Google Mock Interview',
    description: 'Full-length technical interview simulation based on Google\'s interview pattern',
    duration: 90,
    participants: 234,
    difficulty: 'Hard',
    topics: ['System Design', 'DSA', 'Coding']
  },
  {
    id: '2',
    name: 'Amazon Leadership Principles',
    description: 'Behavioral interview focusing on Amazon\'s 14 leadership principles',
    duration: 60,
    participants: 189,
    difficulty: 'Medium',
    topics: ['Behavioral', 'Leadership']
  },
  {
    id: '3',
    name: 'Group Discussion - Tech Trends',
    description: 'Simulate a group discussion on latest technology trends and their impact',
    duration: 45,
    participants: 156,
    difficulty: 'Medium',
    topics: ['GD', 'Communication', 'Tech Knowledge']
  },
  {
    id: '4',
    name: 'Product Manager Interview',
    description: 'PM-specific interview with product design and strategy questions',
    duration: 120,
    participants: 98,
    difficulty: 'Hard',
    topics: ['Product Design', 'Strategy', 'Analytics']
  },
  {
    id: '5',
    name: 'Quick DSA Challenge',
    description: 'Rapid-fire DSA problems to test your problem-solving speed',
    duration: 30,
    participants: 412,
    difficulty: 'Easy',
    topics: ['DSA', 'Coding']
  },
]

export default function MockTests() {
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null)
  const [testActive, setTestActive] = useState(false)
  const [testPhase, setTestPhase] = useState<'intro' | 'active' | 'result'>('intro')
  const [gdTopic, setGdTopic] = useState('')
  const [userResponse, setUserResponse] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const gdTopics = [
    'Impact of AI on employment',
    'Remote vs Office working culture',
    'Climate change and business responsibility',
    'Work-life balance in tech industry',
    'Cryptocurrency regulation',
    'Impact of automation in India',
  ]

  const handleStartTest = async (test: MockTest) => {
    setSelectedTest(test)
    setTestPhase('active')
    setTimeRemaining(test.duration * 60)
    setUserResponse('')
    setTestActive(true)

    // Start countdown
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmitTest = async () => {
    setLoading(true)
    setTestActive(false)

    try {
      const response = await fetch('/api/mock-test-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: selectedTest?.id,
          userResponse,
          testType: selectedTest?.topics.includes('GD') ? 'GD' : 'Interview'
        })
      })

      if (!response.ok) throw new Error('Failed to evaluate test')

      const data = await response.json()
      setResult(data)
      setTestPhase('result')
    } catch (error) {
      console.error('Error submitting test:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (testPhase === 'active' && selectedTest) {
    return (
      <div className="p-8 max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedTest.name}</h1>
            <p className="text-sm text-muted-foreground">Time remaining: {formatTime(timeRemaining)}</p>
          </div>
          <div className={`text-3xl font-bold ${timeRemaining < 300 ? 'text-destructive' : 'text-primary'}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Instructions */}
        <Card className="border-border mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3">Instructions:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Speak clearly and concisely</li>
              <li>• Think out loud - explain your thought process</li>
              <li>• Ask clarifying questions if needed</li>
              <li>• Manage your time effectively</li>
            </ul>
          </CardContent>
        </Card>

        {/* Test Area */}
        <div className="flex-1 flex flex-col space-y-6">
          {selectedTest.topics.includes('GD') ? (
            <>
              <Card className="border-primary border-2 flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Group Discussion Topic</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary mb-4">{gdTopics[Math.floor(Math.random() * gdTopics.length)]}</p>
                      <p className="text-muted-foreground">Share your thoughts, listen to others, and engage in constructive discussion</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Your Response</label>
                    <Textarea
                      placeholder="Type your thoughts here. Think about multiple perspectives on the topic..."
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="border-primary border-2 flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Interview Questions</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary">
                    <p className="text-lg font-semibold text-foreground">Tell me about a challenging project you worked on and how you overcame obstacles.</p>
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-semibold text-foreground">Your Answer</label>
                    <Textarea
                      placeholder="Speak naturally as if in a real interview. Use the STAR method (Situation, Task, Action, Result)..."
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Button onClick={handleSubmitTest} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader size={18} className="mr-2 animate-spin" />
                Evaluating...
              </>
            ) : (
              'Submit Test'
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (testPhase === 'result' && result) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Test Results</h1>
          <p className="text-muted-foreground">Detailed analysis of your performance</p>
        </div>

        {/* Score Card */}
        <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                <p className="text-5xl font-bold text-primary">{result.score}/100</p>
              </div>
              <div className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/20 border-4 border-primary">
                <span className="text-3xl font-bold text-primary">{result.score}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{result.communication}%</p>
              <p className="text-sm text-muted-foreground mt-2">Clarity and articulation</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{result.confidence}%</p>
              <p className="text-sm text-muted-foreground mt-2">Poise and assurance</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{result.engagement}%</p>
              <p className="text-sm text-muted-foreground mt-2">Active participation</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{result.feedback}</p>
          </CardContent>
        </Card>

        {/* Improvements */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">→</span>
                  <span className="text-foreground">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={() => {
            setTestPhase('intro')
            setSelectedTest(null)
            setResult(null)
          }} className="flex-1">
            Back to Tests
          </Button>
          <Button variant="outline" className="flex-1">
            Download Report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mock Tests & GDs</h1>
        <p className="text-muted-foreground">Simulate real interviews and group discussions with AI analysis</p>
      </div>

      {/* Test Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {mockTests.map((test) => (
          <Card key={test.id} className="border-border hover:border-primary transition cursor-pointer overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle>{test.name}</CardTitle>
                  <CardDescription className="mt-2">{test.description}</CardDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getDifficultyColor(test.difficulty)}`}>
                  {test.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span>{test.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users size={16} />
                  <span>{test.participants} took</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart3 size={16} />
                  <span>{test.topics.length} topics</span>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {test.topics.map((topic, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Start Button */}
              <Button onClick={() => handleStartTest(test)} className="w-full gap-2">
                <Play size={18} />
                Start Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Past Tests Summary */}
      <Card className="border-border mt-8">
        <CardHeader>
          <CardTitle>Your Test History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Google Mock Interview</p>
                <p className="text-sm text-muted-foreground">Completed 3 days ago</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">82</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Group Discussion - Climate Change</p>
                <p className="text-sm text-muted-foreground">Completed 1 week ago</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">76</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

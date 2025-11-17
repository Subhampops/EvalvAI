'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader, RotateCw, ThumbsUp, ThumbsDown, Volume2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Question {
  id: string
  text: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  hint: string
  sampleAnswer: string
}

export default function QuestionGenerator() {
  const [category, setCategory] = useState('DSA')
  const [difficulty, setDifficulty] = useState('Medium')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [stats, setStats] = useState({ attempted: 0, correct: 0 })

  const categories = [
    { label: 'Data Structures & Algorithms', value: 'DSA' },
    { label: 'Reasoning & Logic', value: 'Reasoning' },
    { label: 'Quantitative', value: 'Quant' },
    { label: 'System Design', value: 'SystemDesign' },
    { label: 'Behavioral', value: 'Behavioral' },
  ]

  const difficulties = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Hard', value: 'Hard' },
  ]

  const handleGenerateQuestions = async () => {
    setLoading(true)
    setQuestions([])
    setCurrentIndex(0)
    setUserAnswer('')
    setFeedback('')
    setShowHint(false)
    setShowAnswer(false)

    try {
      const response = await fetch('/api/question-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          difficulty,
          count: 10
        })
      })

      if (!response.ok) throw new Error('Failed to generate questions')

      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion?.text,
          userAnswer,
          correctAnswer: currentQuestion?.sampleAnswer,
          category
        })
      })

      const data = await response.json()
      setFeedback(data.feedback)
      setStats(prev => ({
        ...prev,
        attempted: prev.attempted + 1,
        correct: prev.correct + (data.isCorrect ? 1 : 0)
      }))
    } catch (error) {
      setFeedback('Error evaluating answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer('')
      setFeedback('')
      setShowHint(false)
      setShowAnswer(false)
    }
  }

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setUserAnswer('')
      setFeedback('')
      setShowHint(false)
      setShowAnswer(false)
    }
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Question Generator</h1>
        <p className="text-muted-foreground">Practice with AI-generated interview questions across multiple categories</p>
      </div>

      {questions.length === 0 ? (
        // Setup Screen
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Generate Practice Questions</CardTitle>
            <CardDescription>Choose category and difficulty to start practicing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGenerateQuestions} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader size={18} className="mr-2 animate-spin" />
                  Generating 10 Questions...
                </>
              ) : (
                'Generate Questions'
              )}
            </Button>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="border-border bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary mb-2">10-20</p>
                  <p className="text-sm text-foreground">Questions per session</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary mb-2">5</p>
                  <p className="text-sm text-foreground">Different categories</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary mb-2">3</p>
                  <p className="text-sm text-foreground">Difficulty levels</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Practice Screen
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="font-bold text-foreground">{currentIndex + 1} / {questions.length}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="font-bold text-foreground">
                {stats.attempted === 0 ? '-' : `${Math.round((stats.correct / stats.attempted) * 100)}%`}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="font-bold text-primary">{stats.correct}/{stats.attempted}</p>
            </div>
          </div>

          {/* Question Card */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold mr-2">
                    {currentQuestion?.category}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    currentQuestion?.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    currentQuestion?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentQuestion?.difficulty}
                  </span>
                </div>
              </div>
              <CardTitle className="text-2xl">{currentQuestion?.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hint */}
              {!showHint ? (
                <Button variant="outline" onClick={() => setShowHint(true)} className="w-full gap-2">
                  Show Hint
                </Button>
              ) : (
                <Alert className="bg-primary/10 border-primary">
                  <AlertDescription className="text-foreground">
                    <strong>Hint:</strong> {currentQuestion?.hint}
                  </AlertDescription>
                </Alert>
              )}

              {/* User Answer */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Your Answer</label>
                <Textarea
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="min-h-32"
                  disabled={feedback !== ''}
                />
              </div>

              {/* Feedback */}
              {feedback && (
                <Alert className={feedback.includes('Correct') ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'}>
                  <AlertDescription className={feedback.includes('Correct') ? 'text-green-800' : 'text-yellow-800'}>
                    {feedback}
                  </AlertDescription>
                </Alert>
              )}

              {/* Sample Answer */}
              {showAnswer && (
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">Sample Answer:</p>
                  <p className="text-foreground whitespace-pre-wrap text-sm">{currentQuestion?.sampleAnswer}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!feedback && (
                  <Button onClick={handleSubmitAnswer} disabled={loading || !userAnswer.trim()} className="flex-1">
                    {loading ? <Loader size={18} className="animate-spin" /> : 'Submit Answer'}
                  </Button>
                )}
                {feedback && !showAnswer && (
                  <Button onClick={() => setShowAnswer(true)} variant="outline" className="flex-1">
                    Show Answer
                  </Button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0 || loading}
                  variant="outline"
                  className="flex-1"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentIndex === questions.length - 1 || loading}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>

              {/* Reset */}
              <Button
                onClick={() => {
                  setQuestions([])
                  setCurrentIndex(0)
                  setStats({ attempted: 0, correct: 0 })
                }}
                variant="outline"
                className="w-full"
              >
                Start Over
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

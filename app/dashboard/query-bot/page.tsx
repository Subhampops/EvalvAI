'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader, Send, Trash2, Copy, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Message {
  id: string
  query: string
  response: string
  timestamp: Date
}

export default function QueryBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setError('')
    setLoading(true)
    const userQuery = input

    try {
      const response = await fetch('/api/query-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to get response')
      }

      const data = await response.json()

      const newMessage: Message = {
        id: 'msg-' + Date.now(),
        query: userQuery,
        response: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newMessage])
      setInput('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(''), 2000)
  }

  const handleClear = () => {
    setMessages([])
    setError('')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Query Bot</h1>
        <p className="text-muted-foreground">Ask placement-related questions and get AI-powered answers powered by Gemini API</p>
      </div>

      {/* Messages Container */}
      <Card className="border-border mb-6 h-96 overflow-y-auto">
        <CardContent className="p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-muted-foreground">
              <div>
                <p className="text-lg font-semibold">No queries yet</p>
                <p className="text-sm">Ask your first placement question to get started</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-3 border-b border-border pb-4 last:border-b-0">
                {/* User Query */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg max-w-xs">
                    <p className="text-sm">{msg.query}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-lg max-w-xs">
                    <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleCopy(msg.response, msg.id)}
                        className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <><Check size={14} /> Copied</>
                        ) : (
                          <><Copy size={14} /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Your Question</label>
          <Textarea
            placeholder="Ask anything about placements, interviews, DSA, or career guidance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="min-h-24"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="gap-2 flex-1"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Getting Answer...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Query
              </>
            )}
          </Button>

          {messages.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={loading}
              className="gap-2"
            >
              <Trash2 size={18} />
              Clear Chat
            </Button>
          )}
        </div>
      </form>

      {/* Sample Questions */}
      <div className="mt-12 grid md:grid-cols-2 gap-4">
        <Card className="border-border bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Sample Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="text-foreground font-medium cursor-pointer hover:text-primary"
                onClick={() => setInput('What are the top DSA topics for placement interviews?')}>
                → Top DSA topics for placements
              </p>
              <p className="text-foreground font-medium cursor-pointer hover:text-primary"
                onClick={() => setInput('How do I prepare for a system design interview?')}>
                → System design interview prep
              </p>
              <p className="text-foreground font-medium cursor-pointer hover:text-primary"
                onClick={() => setInput('What resume tips should I follow?')}>
                → Resume optimization tips
              </p>
              <p className="text-foreground font-medium cursor-pointer hover:text-primary"
                onClick={() => setInput('How to handle stress during interviews?')}>
                → Handling interview stress
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Be specific with your questions</p>
              <p className="text-muted-foreground">The more details you provide, the better answers you'll get</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Ask follow-up questions</p>
              <p className="text-muted-foreground">Get clarification on any point you don't understand</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

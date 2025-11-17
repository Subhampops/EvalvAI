'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MessageSquare, FileText, Brain, Users, TrendingUp, Award } from 'lucide-react'

export default function DashboardHome() {
  const features = [
    {
      id: 'query-bot',
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: 'Query Bot',
      description: 'Ask placement-related questions and get AI-powered answers',
      stats: '12 queries answered',
      href: '/dashboard/query-bot',
    },
    {
      id: 'resume',
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: 'Resume Analyzer',
      description: 'Upload your resume and get detailed feedback',
      stats: '3 analyses performed',
      href: '/dashboard/resume-analyzer',
    },
    {
      id: 'questions',
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: 'Question Generator',
      description: 'Practice with AI-generated interview questions',
      stats: '45 questions practiced',
      href: '/dashboard/question-generator',
    },
    {
      id: 'mock-tests',
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Mock Tests',
      description: 'Simulate real interviews and GDs',
      stats: '8 mock tests completed',
      href: '/dashboard/mock-tests',
    },
  ]

  const stats = [
    { label: 'Total Practice', value: '67 hours', icon: <TrendingUp className="w-6 h-6 text-primary" /> },
    { label: 'Accuracy Rate', value: '78%', icon: <Award className="w-6 h-6 text-primary" /> },
    { label: 'Streak', value: '12 days', icon: <TrendingUp className="w-6 h-6 text-primary" /> },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground">Let's prepare you for your dream interview</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-border hover:border-primary transition">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link key={feature.id} href={feature.href}>
              <Card className="border-border hover:border-primary transition cursor-pointer h-full hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-semibold">{feature.stats}</span>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <Card className="border-border bg-primary/5">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>New to InterviewAI? Here's how to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-foreground">Upload your resume to the Resume Analyzer for personalized feedback</li>
            <li className="text-foreground">Use the Query Bot to clarify your placement doubts</li>
            <li className="text-foreground">Practice DSA and reasoning with the Question Generator</li>
            <li className="text-foreground">Take mock tests to simulate real interview scenarios</li>
            <li className="text-foreground">Track your progress and improve weak areas</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Loader, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface AnalysisResult {
  score: number
  suggestedRoles: string[]
  strengths: string[]
  improvements: string[]
  missingSkills: string[]
  overallFeedback: string
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [analyzed, setAnalyzed] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.type.includes('pdf') && !selectedFile.type.includes('word') && !selectedFile.name.endsWith('.txt')) {
        setError('Please upload a PDF, Word document, or text file')
        return
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setFile(selectedFile)
      setError('')
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a resume file')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/resume-analyzer', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Analysis failed')
      }

      const data = await response.json()
      setResult(data)
      setAnalyzed(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Resume Analyzer</h1>
        <p className="text-muted-foreground">Upload your resume and get AI-powered analysis with role suggestions and improvement tips</p>
      </div>

      {!analyzed ? (
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>Supported formats: PDF, Word, Text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                id="resume-input"
              />
              <label htmlFor="resume-input" className="cursor-pointer block">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, Word, or Text file (Max 5MB)
                </p>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* File Selected */}
            {file && (
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary">
                <div>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  onClick={() => { setFile(null); setError('') }}
                  className="text-destructive hover:text-destructive/80 font-semibold"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader size={18} className="mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                'Analyze Resume'
              )}
            </Button>
          </CardContent>
        </Card>
      ) : result ? (
        // Results Display
        <div className="space-y-6">
          {/* Score Card */}
          <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                  <p className="text-5xl font-bold text-primary">{result.score}/100</p>
                </div>
                <div className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/20 border-4 border-primary">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-1" />
                    <span className="text-lg font-bold text-primary">{result.score}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Roles */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Suggested Job Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {result.suggestedRoles.map((role, idx) => (
                  <div key={idx} className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="font-semibold text-foreground">{role}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Your Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <span className="text-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvement Areas */}
          <Card className="border-border">
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

          {/* Missing Skills */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Skills to Add</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Feedback */}
          <Card className="border-border bg-primary/5">
            <CardHeader>
              <CardTitle>Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{result.overallFeedback}</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setAnalyzed(false)
                setResult(null)
                setFile(null)
              }}
              variant="outline"
              className="flex-1"
            >
              Analyze Another Resume
            </Button>
            <Button className="flex-1">
              Download Report
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

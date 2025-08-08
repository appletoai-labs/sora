"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Brain, MessageCircle, BarChart, Lightbulb, Book, ClipboardList, Zap, Download, FileText, X, Loader2, Check, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import { useNavigate } from "react-router-dom" // Import useNavigate

interface StatItemProps {
  number: number
  label: string
}

const StatItem: React.FC<StatItemProps> = ({ number, label }) => (
  <div className="text-center p-4 bg-sora-muted rounded-lg border border-sora-teal/20">
    <div className="text-sora-teal text-3xl font-bold">{number}</div>
    <div className="text-gray-400 text-sm mt-1">{label}</div>
  </div>
)

interface FeatureListItemProps {
  children: React.ReactNode
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({ children }) => (
  <li className="flex items-start py-2 border-b border-sora-muted last:border-b-0">
    <Check className="w-5 h-5 text-sora-teal mr-3 flex-shrink-0 mt-1" />
    <span className="text-gray-300">{children}</span>
  </li>
)

interface Insight {
  _id: string
  summary: string
  mainConcern?: string
  moodInsight?: string
  tags?: string[]
  createdAt: string
}

interface Pattern {
  _id: string
  patternsText: string
  createdAt: string
}

const Research: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate() // Initialize useNavigate
  const API_BASE = import.meta.env.REACT_APP_BACKEND_URL

  const [conversationCount, setConversationCount] = useState(0)
  const [insightCount, setInsightCount] = useState(0)
  const [checkinCount, setCheckinCount] = useState(0)
  const [patternCount, setPatternCount] = useState(0)
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false)
  const [isPatternsModalOpen, setIsPatternsModalOpen] = useState(false)
  const [insights, setInsights] = useState<Insight[]>([])
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [isLoadingPatterns, setIsLoadingPatterns] = useState(false)

  const token = localStorage.getItem("authToken")
  useEffect(() => {
    if (user && token) {
      fetchResearchStats()
    }
  }, [user, token])

  const fetchResearchStats = async () => {
    try {
        const token = localStorage.getItem("authToken")
      const [chatRes, insightRes, checkinRes, patternRes] = await Promise.all([
        axios.get(`${API_BASE}/api/research/stats/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/research/stats/insights`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/research/stats/checkins`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/research/stats/patterns`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      setConversationCount(chatRes.data.count)
      setInsightCount(insightRes.data.count)
      setCheckinCount(checkinRes.data.count)
      setPatternCount(patternRes.data.count)
    } catch (error) {
      console.error("Error fetching research stats:", error)
      toast({
        title: "Error",
        description: "Failed to load research statistics.",
        variant: "destructive",
      })
    }
  }

  const fetchInsights = async () => {
    setIsLoadingInsights(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/insights`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInsights(response.data)
      setIsInsightsModalOpen(true)
    } catch (error) {
      console.error("Error fetching insights:", error)
      toast({
        title: "Error",
        description: "Failed to load insights.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingInsights(false)
    }
  }

  const fetchPatterns = async () => {
    setIsLoadingPatterns(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/patterns`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPatterns(response.data)
      setIsPatternsModalOpen(true)
    } catch (error) {
      console.error("Error fetching patterns:", error)
      toast({
        title: "Error",
        description: "Failed to load patterns.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPatterns(false)
    }
  }

  const handleGenerateCodexReport = async () => {
    setIsLoadingReport(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/generate-codex-report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for downloading files
      })

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `SORA_Neurodivergent_Codex_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Report Generated",
        description: "Your Personal Neurodivergent Codex has been downloaded!",
      })
    } catch (error) {
      console.error("Error generating codex report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingReport(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6 text-white">
      {/* Loading Overlay for Report Generation */}
      {isLoadingReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-sora-card border border-sora-teal/30 rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-sora-teal animate-spin" />
            <p className="text-white text-lg font-medium">Generating your Personal Codex Report...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              My Research Profile
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Building your personalized neurodivergent blueprint
          </p>
          <div className="bg-gradient-to-r from-sora-orange to-sora-teal text-sora-dark font-semibold py-3 px-6 rounded-lg mt-6 inline-block shadow-lg">
            🚀 Enhanced research features launching soon! Start building your foundation today.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Conversation Foundation */}
          <Card className="bg-sora-card border border-sora-teal/20 available-card">
            <CardHeader className="flex-row items-center">
              <div className="w-10 h-10 bg-sora-teal text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                💬
              </div>
              <CardTitle className="text-sora-teal text-xl">Conversation Foundation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Every chat with SORA contributes your unique neurodivergent profile.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <StatItem number={conversationCount} label="Conversations" />
                <StatItem number={insightCount} label="Insights" />
              </div>
              <p className="text-gray-400 text-sm mt-4">
                <strong>Start chatting to begin building your research!</strong>
              </p>
              <Button
                onClick={fetchInsights}
                className="w-full mt-4 bg-sora-teal text-sora-dark hover:bg-sora-teal/80"
                disabled={isLoadingInsights || insightCount === 0}
              >
                {isLoadingInsights ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Lightbulb className="w-4 h-4 mr-2" />
                )}
                View Insights
              </Button>
            </CardContent>
          </Card>

          {/* Clarity Log Integration */}
          <Card className="bg-sora-card border border-sora-teal/20 available-card">
            <CardHeader className="flex-row items-center">
              <div className="w-10 h-10 bg-sora-teal text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                📊
              </div>
              <CardTitle className="text-sora-teal text-xl">Clarity Log Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Your daily check-ins provide structured data for pattern recognition.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <StatItem number={checkinCount} label="Check-ins" />
                <StatItem number={patternCount} label="Patterns" />
              </div>
              <p className="text-gray-400 text-sm mt-4">
                <strong>Complete daily check-ins to track your patterns!</strong>
              </p>
              <Button
                onClick={fetchPatterns}
                className="w-full mt-4 bg-sora-teal text-sora-dark hover:bg-sora-teal/80"
                disabled={isLoadingPatterns || patternCount === 0}
              >
                {isLoadingPatterns ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ClipboardList className="w-4 h-4 mr-2" />
                )}
                View Patterns
              </Button>
            </CardContent>
          </Card>

          {/* Brain Insights Dashboard (Now Available) */}
          <Card className="bg-sora-card border border-sora-teal/20 available-card">
            <CardHeader className="flex-row items-center">
              <div className="w-10 h-10 bg-sora-teal text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                🧠
              </div>
              <CardTitle className="text-sora-teal text-xl">Brain Insights Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Personalized insights about your optimal times, sensory preferences, and communication patterns.
              </p>
              <ul className="space-y-2">
                <FeatureListItem>Optimal energy times analysis</FeatureListItem>
                <FeatureListItem>Sensory profile mapping</FeatureListItem>
                <FeatureListItem>Communication style insights</FeatureListItem>
                <FeatureListItem>Focus pattern recognition</FeatureListItem>
              </ul>
              <Button
                onClick={() => navigate("/app/dashboard")}
                className="w-full mt-4 bg-sora-teal text-sora-dark hover:bg-sora-teal/80"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>


          {/* Personal Codex Report (Now Available) */}
          <Card className="bg-sora-card border border-sora-teal/20 available-card">
            <CardHeader className="flex-row items-center">
              <div className="w-10 h-10 bg-sora-teal text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                📋
              </div>
              <CardTitle className="text-sora-teal text-xl">Personal Codex Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Comprehensive research document about your neurodivergent profile.
              </p>
              <ul className="space-y-2">
                <FeatureListItem>Personalized strategies document</FeatureListItem>
                <FeatureListItem>Communication preference guide</FeatureListItem>
                <FeatureListItem>Accommodation recommendations</FeatureListItem>
                <FeatureListItem>Academic research connections</FeatureListItem>
              </ul>
              <Button
                onClick={handleGenerateCodexReport}
                className="w-full mt-4 bg-sora-teal text-sora-dark hover:bg-sora-teal/80"
                disabled={isLoadingReport}
              >
                {isLoadingReport ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Personal Codex Report
              </Button>
            </CardContent>
          </Card>

          {/* Academic Connections (Coming Soon) */}
          <Card className="bg-sora-card border border-sora-muted opacity-70 relative">
            <div className="absolute top-4 right-4 bg-sora-orange text-sora-dark px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </div>
            <CardHeader className="flex-row items-center">
              <div className="w-10 h-10 bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                📚
              </div>
              <CardTitle className="text-gray-400 text-xl">Academic Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Research papers and studies connected to your unique patterns and interests.
              </p>
              <ul className="space-y-2">
                <FeatureListItem>Personalized research recommendations</FeatureListItem>
                <FeatureListItem>Academic paper summaries</FeatureListItem>
                <FeatureListItem>Evidence-based strategy suggestions</FeatureListItem>
                <FeatureListItem>Research bookmark system</FeatureListItem>
              </ul>
            </CardContent>
          </Card>

        </div>

        <div className="cta-section bg-gradient-to-r from-sora-teal to-sora-orange text-sora-dark p-8 rounded-xl text-center mt-10 shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Start Building Your Research Today</h3>
          <p className="text-lg mb-6 opacity-90">
            Every conversation and check-in contributes to your personalized neurodivergent profile. The more you
            engage, the more insights SORA ALLY can provide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => window.location.href = "/app/chat"} // Assuming /app/chat is the chat page route
              className="bg-sora-dark text-sora-teal hover:bg-gray-800"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Talk to SORA ALLY
            </Button>
            <Button
              onClick={() => window.location.href = "/app/dailycheckin"} // Assuming /app/dailycheckin is the check-in page route
              className="bg-sora-dark text-sora-teal hover:bg-gray-800"
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Complete Daily Check-in
            </Button>
            {/* This button is now also present in the card above */}
            <Button
              onClick={handleGenerateCodexReport}
              className="bg-sora-dark text-sora-orange hover:bg-gray-800"
              disabled={isLoadingReport}
            >
              {isLoadingReport ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              Personal Codex Report
            </Button>
          </div>
        </div>
      </div>

      {/* Insights Modal */}
      <Dialog open={isInsightsModalOpen} onOpenChange={setIsInsightsModalOpen}>
        <DialogContent className="sm:max-w-[800px] bg-sora-card text-white border-sora-teal/30">
          <DialogHeader>
            <DialogTitle className="text-sora-teal">Your Insights</DialogTitle>
            <DialogDescription className="text-gray-400">
              Key takeaways and observations from your conversations.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            {insights.length === 0 ? (
              <p className="text-gray-400">No insights found yet. Keep chatting with SORA!</p>
            ) : (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <Card key={insight._id} className="bg-sora-muted border border-sora-teal/20">
                    <CardContent className="p-4">
                      <p className="text-gray-300 font-medium mb-2">{insight.summary}</p>
                      {insight.mainConcern && (
                        <p className="text-gray-400 text-sm">
                          <span className="font-semibold">Main Concern:</span> {insight.mainConcern}
                        </p>
                      )}
                      {insight.moodInsight && (
                        <p className="text-gray-400 text-sm">
                          <span className="font-semibold">Mood Insight:</span> {insight.moodInsight}
                        </p>
                      )}
                      {insight.tags && insight.tags.length > 0 && (
                        <p className="text-gray-400 text-sm">
                          <span className="font-semibold">Tags:</span> {insight.tags.join(", ")}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        Generated on: {new Date(insight.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
          <Button onClick={() => setIsInsightsModalOpen(false)} className="mt-4 bg-sora-teal text-sora-dark">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Patterns Modal */}
      <Dialog open={isPatternsModalOpen} onOpenChange={setIsPatternsModalOpen}>
        <DialogContent className="sm:max-w-[800px] bg-sora-card text-white border-sora-teal/30">
          <DialogHeader>
            <DialogTitle className="text-sora-teal">Your Patterns</DialogTitle>
            <DialogDescription className="text-gray-400">
              Recurring themes and behaviors identified from your check-ins.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            {patterns.length === 0 ? (
              <p className="text-gray-400">No patterns found yet. Complete daily check-ins!</p>
            ) : (
              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <Card key={pattern._id} className="bg-sora-muted border border-sora-teal/20">
                    <CardContent className="p-4">
                      <p className="text-gray-300 font-medium mb-2 whitespace-pre-wrap">{pattern.patternsText}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Generated on: {new Date(pattern.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
          <Button onClick={() => setIsPatternsModalOpen(false)} className="mt-4 bg-sora-teal text-sora-dark">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Research

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Brain, MessageCircle, BarChart, Lightbulb, Book, ClipboardList, Zap, Download, FileText, X, Loader2, Check, ArrowRight, Clock, Eye, ArrowLeft, Search, Bookmark, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import { useNavigate } from "react-router-dom"

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

interface AcademicReference {
  _id?: string // For saved items
  title: string
  authors: string[]
  summary: string
  sourceUrl?: string
  saved?: boolean // Indicate if it's a saved item
}

const Research: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const API_BASE = import.meta.env.REACT_APP_BACKEND_URL

  const [conversationCount, setConversationCount] = useState(0)
  const [insightCount, setInsightCount] = useState(0)
  const [checkinCount, setCheckinCount] = useState(0)
  const [patternCount, setPatternCount] = useState(0)

  const [showInsightsList, setShowInsightsList] = useState(false)
  const [showPatternsList, setShowPatternsList] = useState(false)
  const [showAcademicConnections, setShowAcademicConnections] = useState(false) // New state for academic connections view

  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)
  const [selectedAcademicRef, setSelectedAcademicRef] = useState<AcademicReference | null>(null)

  const [insights, setInsights] = useState<Insight[]>([])
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [academicSearchResults, setAcademicSearchResults] = useState<AcademicReference[]>([])
  const [savedAcademicConnections, setSavedAcademicConnections] = useState<AcademicReference[]>([])

  const [academicSearchQuery, setAcademicSearchQuery] = useState("")
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [isLoadingPatterns, setIsLoadingPatterns] = useState(false)
  const [isLoadingAcademicSearch, setIsLoadingAcademicSearch] = useState(false)
  const [isLoadingSavedConnections, setIsLoadingSavedConnections] = useState(false)

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

  const handleViewInsightsList = async () => {
    setIsLoadingInsights(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/insights`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInsights(response.data)
      setShowInsightsList(true)
      setShowPatternsList(false)
      setShowAcademicConnections(false)
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

  const handleViewPatternsList = async () => {
    setIsLoadingPatterns(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/patterns`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPatterns(response.data)
      setShowPatternsList(true)
      setShowInsightsList(false)
      setShowAcademicConnections(false)
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

  const handleOpenInsightDetail = (insight: Insight) => {
    setSelectedInsight(insight)
  }

  const handleOpenPatternDetail = (pattern: Pattern) => {
    setSelectedPattern(pattern)
  }

  const handleGenerateCodexReport = async () => {
    setIsLoadingReport(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/generate-codex-report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for downloading files
      })

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

  const handleViewAcademicConnections = async () => {
    setShowAcademicConnections(true)
    setShowInsightsList(false)
    setShowPatternsList(false)
    await fetchSavedAcademicConnections()
  }

  const handleAcademicSearch = async () => {
    if (!academicSearchQuery.trim()) {
      toast({
        title: "Search Empty",
        description: "Please enter a query to search for academic references.",
        variant: "default",
      })
      return
    }

    setIsLoadingAcademicSearch(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/academic-search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: academicSearchQuery },
      })
      setAcademicSearchResults(response.data)
      if (response.data.length === 0) {
        toast({
          title: "No Results",
          description: "No academic references found for your query. Try a different search.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error fetching academic search results:", error)
      toast({
        title: "Error",
        description: "Failed to search academic references. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAcademicSearch(false)
    }
  }

  const fetchSavedAcademicConnections = async () => {
    setIsLoadingSavedConnections(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`${API_BASE}/api/research/academic-connections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSavedAcademicConnections(response.data)
    } catch (error) {
      console.error("Error fetching saved academic connections:", error)
      toast({
        title: "Error",
        description: "Failed to load your saved academic connections.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingSavedConnections(false)
    }
  }

  const handleSaveAcademicConnection = async (ref: AcademicReference) => {
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.post(`${API_BASE}/api/research/academic-connections`, ref, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSavedAcademicConnections(prev => [...prev, response.data])
      toast({
        title: "Saved",
        description: `"${ref.title}" has been saved to your connections.`,
      })
      // Mark the item as saved in search results if it was clicked from there
      setAcademicSearchResults(prev =>
        prev.map(item => (item.title === ref.title && item.summary === ref.summary ? { ...item, saved: true } : item))
      )
    } catch (error) {
      console.error("Error saving academic connection:", error)
      toast({
        title: "Error",
        description: "Failed to save academic connection. It might already be saved.",
        variant: "destructive",
      })
    }
  }

  const handleOpenAcademicRefDetail = (ref: AcademicReference) => {
    setSelectedAcademicRef(ref)
  }

  const renderMainResearchView = () => (
    <>
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
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
            <div className="w-10 h-10 text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
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
              onClick={handleViewInsightsList}
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
            <div className="w-10 h-10 text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
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
              onClick={handleViewPatternsList}
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
            <div className="w-10 h-10 text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
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
              onClick={() => navigate("/app/brain-dashboard")}
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
            <div className="w-10 h-10 text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
              📋
            </div>
            <CardTitle className="text-sora-teal text-xl">Personal Codex Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Comprehensive research document about your neurodivergent profile.
            </p>
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

        {/* Academic Connections */}
        <Card className="bg-sora-card border border-sora-teal/20 available-card">
          <CardHeader className="flex-row items-center">
            <div className="w-10 h-10 text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
              📚
            </div>
            <CardTitle className="text-sora-teal text-xl">Academic Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Explore and save relevant research papers and studies.
            </p>
            <Button
              onClick={handleViewAcademicConnections}
              className="w-full mt-4 bg-sora-teal text-sora-dark hover:bg-sora-teal/80"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Academic Connections
            </Button>
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
            onClick={() => navigate("/app/chat")}
            className="bg-sora-dark text-sora-teal hover:bg-gray-800"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Talk to SORA ALLY
          </Button>
          <Button
            onClick={() => navigate("/app/dailycheckin")}
            className="bg-sora-dark text-sora-teal hover:bg-gray-800"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Complete Daily Check-in
          </Button>
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
    </>
  )

  const renderInsightsList = () => (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => setShowInsightsList(false)}
        className="text-sora-teal hover:text-sora-teal/80 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Research Profile
      </Button>
      <h2 className="text-3xl font-bold text-sora-teal mb-6">Your Insights</h2>
      <p className="text-gray-300 mb-8">Key takeaways and observations from your conversations.</p>
      {insights.length === 0 ? (
        <p className="text-gray-400">No insights found yet. Keep chatting with SORA!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <Card key={insight._id} className="bg-sora-card border border-sora-teal/20">
              <CardContent className="p-6">
                <p className="text-gray-300 font-medium mb-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: insight.summary }}></p>
                <p className="text-gray-500 text-xs mt-3">
                  Generated on: {new Date(insight.createdAt).toLocaleDateString()}
                </p>
                <Button
                  onClick={() => handleOpenInsightDetail(insight)}
                  className="w-full mt-4 bg-sora-teal text-sora-dark hover:bg-sora-teal/80"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Insight Modal */}
      <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="sm:max-w-[800px] bg-sora-card text-white border-sora-teal/30">
          <DialogHeader>
            <DialogTitle className="text-sora-teal">Insight Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              A deeper look into this specific insight.
            </DialogDescription>
          </DialogHeader>
          {selectedInsight && (
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-4">
                {/* Render summary with HTML */}
                <div
                  className="text-gray-300 font-medium text-lg"
                  dangerouslySetInnerHTML={{ __html: selectedInsight.summary }}
                ></div>

                {selectedInsight.mainConcern && (
                  <p className="text-gray-400">
                    <span className="font-semibold text-sora-teal">Main Concern:</span> {selectedInsight.mainConcern}
                  </p>
                )}
                {selectedInsight.moodInsight && (
                  <p className="text-gray-400">
                    <span className="font-semibold text-sora-teal">Mood Insight:</span> {selectedInsight.moodInsight}
                  </p>
                )}
                {selectedInsight.tags && selectedInsight.tags.length > 0 && (
                  <p className="text-gray-400">
                    <span className="font-semibold text-sora-teal">Tags:</span> {selectedInsight.tags.join(", ")}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-4">
                  Generated on: {new Date(selectedInsight.createdAt).toLocaleDateString()}
                </p>
              </div>
            </ScrollArea>
          )}

          <Button onClick={() => setSelectedInsight(null)} className="mt-4 bg-sora-teal text-sora-dark">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderPatternsList = () => (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => setShowPatternsList(false)}
        className="text-sora-teal hover:text-sora-teal/80 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Research Profile
      </Button>
      <h2 className="text-3xl font-bold text-sora-teal mb-6">Your Patterns</h2>
      <p className="text-gray-300 mb-8">Recurring themes and behaviors identified from your check-ins.</p>
      {patterns.length === 0 ? (
        <p className="text-gray-400">No patterns found yet. Complete daily check-ins!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns.map((pattern) => (
            <Card key={pattern._id} className="bg-sora-card border border-sora-teal/20">
              <CardContent className="p-6">
                <p className="text-gray-300 font-medium mb-3 line-clamp-3 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pattern.patternsText }}></p>

                <p className="text-gray-500 text-xs mt-3">
                  Generated on: {new Date(pattern.createdAt).toLocaleDateString()}
                </p>
                <Button
                  onClick={() => handleOpenPatternDetail(pattern)}
                  className="w-full mt-4 bg-sora-teal text-sora-dark hover:bg-sora-teal/80"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Pattern Modal */}
      <Dialog open={!!selectedPattern} onOpenChange={() => setSelectedPattern(null)}>
        <DialogContent className="sm:max-w-[800px] bg-sora-card text-white border-sora-teal/30">
          <DialogHeader>
            <DialogTitle className="text-sora-teal">Pattern Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              A deeper look into this specific pattern.
            </DialogDescription>
          </DialogHeader>
          {selectedPattern && (
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-4">
                {/* Render patterns with HTML */}
                <div
                  className="text-gray-300 font-medium text-lg"
                  dangerouslySetInnerHTML={{ __html: selectedPattern.patternsText }}
                ></div>

                <p className="text-gray-500 text-sm mt-4">
                  Generated on: {new Date(selectedPattern.createdAt).toLocaleDateString()}
                </p>
              </div>
            </ScrollArea>
          )}

          <Button onClick={() => setSelectedPattern(null)} className="mt-4 bg-sora-teal text-sora-dark">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderAcademicConnectionsView = () => (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => setShowAcademicConnections(false)}
        className="text-sora-teal hover:text-sora-teal/80 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Research Profile
      </Button>
      <h2 className="text-3xl font-bold text-sora-teal mb-6">Academic Connections</h2>
      <p className="text-gray-300 mb-8">Search for academic papers and manage your saved connections.</p>

      {/* Search Bar */}
      <div className="flex w-full max-w-lg items-center space-x-2 mb-10">
        <Input
          type="text"
          placeholder="Search academic papers..."
          value={academicSearchQuery}
          onChange={(e) => setAcademicSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAcademicSearch()
            }
          }}
          className="flex-1 bg-sora-muted border-sora-teal/30 text-white placeholder:text-gray-500 focus-visible:ring-sora-teal"
        />
        <Button onClick={handleAcademicSearch} disabled={isLoadingAcademicSearch} className="bg-sora-teal text-sora-dark hover:bg-sora-teal/80">
          {isLoadingAcademicSearch ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="ml-2">Search</span>
        </Button>
      </div>

      {/* Search Results */}
      {academicSearchResults.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-200 mb-4">Search Results</h3>
          <p className="text-gray-400 mb-4">
            Note: These are AI-generated conceptual references for demonstration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicSearchResults.map((ref, index) => (
              <Card key={`search-${index}`} className="bg-sora-card border border-sora-orange/20">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-sora-orange cursor-pointer hover:underline"
                    onClick={() => handleOpenAcademicRefDetail(ref)}>
                    {ref.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1 mb-2">
                    {ref.authors.join(", ")}
                  </p>
                  <div className="flex justify-end gap-2">
                    {ref.sourceUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(ref.sourceUrl, "_blank")}
                        className="text-gray-400 hover:text-sora-teal"
                        title="Open Source"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveAcademicConnection(ref)}
                      disabled={ref.saved}
                      className={`text-gray-400 ${ref.saved ? 'cursor-not-allowed opacity-50' : 'hover:text-sora-teal'}`}
                      title={ref.saved ? "Already Saved" : "Save Connection"}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Your Academic Connections */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-200 mb-4">Your Saved Academic Connections</h3>
        {isLoadingSavedConnections ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-sora-teal animate-spin" />
            <p className="text-gray-400 ml-3">Loading your connections...</p>
          </div>
        ) : savedAcademicConnections.length === 0 ? (
          <p className="text-gray-400">You haven't saved any academic connections yet. Search and save some!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAcademicConnections.map((ref) => (
              <Card key={ref._id} className="bg-sora-card border border-sora-teal/20">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-sora-teal cursor-pointer hover:underline"
                    onClick={() => handleOpenAcademicRefDetail(ref)}>
                    {ref.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1 mb-2">
                    {ref.authors.join(", ")}
                  </p>
                  <div className="flex justify-end gap-2">
                    {ref.sourceUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(ref.sourceUrl, "_blank")}
                        className="text-gray-400 hover:text-sora-teal"
                        title="Open Source"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Academic Reference Detail Modal */}
      <Dialog open={!!selectedAcademicRef} onOpenChange={() => setSelectedAcademicRef(null)}>
        <DialogContent className="sm:max-w-[800px] bg-sora-card text-white border-sora-teal/30">
          <DialogHeader>
            <DialogTitle className="text-sora-teal">{selectedAcademicRef?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Authors: {selectedAcademicRef?.authors.join(", ")}
            </DialogDescription>
          </DialogHeader>
          {selectedAcademicRef && (
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-4">
                <p className="text-gray-300 font-medium text-lg">{selectedAcademicRef.summary}</p>
                {selectedAcademicRef.sourceUrl && (
                  <p className="text-gray-400 text-sm">
                    <span className="font-semibold text-sora-teal">Source:</span>{" "}
                    <a href={selectedAcademicRef.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sora-orange hover:underline">
                      {selectedAcademicRef.sourceUrl}
                    </a>
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
          <div className="flex justify-end gap-2 mt-4">
            {selectedAcademicRef && !selectedAcademicRef.saved && selectedAcademicRef._id === undefined && ( // Only show save button for new search results
              <Button onClick={() => handleSaveAcademicConnection(selectedAcademicRef)} className="bg-sora-teal text-sora-dark">
                <Bookmark className="w-4 h-4 mr-2" /> Save Connection
              </Button>
            )}
            <Button onClick={() => setSelectedAcademicRef(null)} className="bg-gray-700 text-white hover:bg-gray-600">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )


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
        {showInsightsList ? renderInsightsList() :
          showPatternsList ? renderPatternsList() :
            showAcademicConnections ? renderAcademicConnectionsView() :
              renderMainResearchView()}
      </div>
    </div>
  )
}

export default Research

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Brain, Clock, Eye, MessageCircle, ArrowLeft, Loader2, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface BrainInsightsData {
  optimalTimes: string[]
  sensoryProfile: string[]
  communicationPatterns: string[]
}

const BrainInsights: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const API_BASE = import.meta.env.REACT_APP_BACKEND_URL

  const [brainInsights, setBrainInsights] = useState<BrainInsightsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBrainInsights = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")
      if (!user || !token) {
        setIsLoading(false)
        toast({
          title: "Authentication Error",
          description: "Please log in to view your brain insights.",
          variant: "destructive",
        })
        return
      }

      try {
        const response = await axios.get(`${API_BASE}/api/research/brain-insights`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBrainInsights(response.data)
      } catch (error) {
        console.error("Error fetching brain insights:", error)
        toast({
          title: "Error",
          description: "Failed to load brain insights. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrainInsights()
  }, [user, toast, API_BASE])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-sora-teal animate-spin" />
          <p className="text-white text-lg font-medium">Loading your Brain Insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/research")}
          className="text-sora-teal hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Research Profile
        </Button>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-sora-teal" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Brain Insights Dashboard
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            What SORA has learned about your unique neurodivergent profile
          </p>
        </div>

        {!brainInsights ? (
          <div className="text-center text-gray-400 text-lg mt-12">
            <p className="mb-4">No brain insights available yet.</p>
            <p>Keep interacting with SORA through chats and check-ins to build your profile!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Optimal Times */}
            <Card className="bg-sora-card border border-sora-teal/20">
              <CardHeader className="flex-row items-center">
                <div className="w-10 h-10 bg-sora-teal text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle className="text-sora-teal text-xl">Your Optimal Times</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {brainInsights.optimalTimes.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <Check className="w-5 h-5 text-sora-teal mr-3 flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Sensory Profile */}
            <Card className="bg-sora-card border border-sora-teal/20">
              <CardHeader className="flex-row items-center">
                <div className="w-10 h-10 bg-sora-teal text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                  <Eye className="w-6 h-6" />
                </div>
                <CardTitle className="text-sora-teal text-xl">Your Sensory Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {brainInsights.sensoryProfile.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <Check className="w-5 h-5 text-sora-teal mr-3 flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Communication Patterns */}
            <Card className="bg-sora-card border border-sora-teal/20">
              <CardHeader className="flex-row items-center">
                <div className="w-10 h-10 bg-sora-teal text-sora-dark rounded-lg flex items-center justify-center mr-4 text-xl font-bold">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-sora-teal text-xl">Your Communication Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {brainInsights.communicationPatterns.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <Check className="w-5 h-5 text-sora-teal mr-3 flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrainInsights

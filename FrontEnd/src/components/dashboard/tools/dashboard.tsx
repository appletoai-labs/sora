"use client"

import type React from "react"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import {
  Star,
  Coins,
  Target,
  CheckCircle,
  Plus,
  Flame,
  Award,
  TrendingUp,
  Calendar,
  Brain,
  Heart,
  Lightbulb,
  BarChart3,
  Activity,
} from "lucide-react"
import SoraLogo from "@/components/SoraLogo"

interface UserProgress {
  level: number
  totalXP: number
  coins: number
  dayStreak: number
  goalsCompleted: number
  xpToNextLevel: number
  currentLevelXP: number
}

interface Goal {
  _id: string
  title: string
  description: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  isCompleted: boolean
  xpReward: number
  coinReward: number
  createdAt: string
}

interface Achievement {
  _id: string
  title: string
  description: string
  isUnlocked: boolean
  unlockedAt?: string
}

interface DashboardStats {
  totalCheckins: number
  totalChatSessions: number
  totalClarityEntries: number
  recentActivity: number
  wellnessScore: number
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth()
  const { toast } = useToast()
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    totalXP: 0,
    coins: 100,
    dayStreak: 0,
    goalsCompleted: 0,
    xpToNextLevel: 100,
    currentLevelXP: 0,
  })
  const [recentGoals, setRecentGoals] = useState<Goal[]>([])
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalCheckins: 0,
    totalChatSessions: 0,
    totalClarityEntries: 0,
    recentActivity: 0,
    wellnessScore: 7.5,
  })
  const [loading, setLoading] = useState(true)

  const API_BASE = "http://localhost:5000/api"

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

const fetchDashboardData = async () => {
  try {
    setLoading(true)
    const token = localStorage.getItem("authToken")

    // Fetch recent goals
    const goalsResponse = await fetch(`${API_BASE}/goals/usergoals`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const goalsData = await goalsResponse.json()

    // Fetch achievements
    const achievementsResponse = await fetch(`${API_BASE}/goals/achievements`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const achievementsData = await achievementsResponse.json()

    // Fetch analytics data
    const analyticsResponse = await fetch(`${API_BASE}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const analyticsData = await analyticsResponse.json()
    console.log("Analytics Data:", analyticsData)

    // Fetch user progress
    const progressResponse = await fetch(`${API_BASE}/goals/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const progressData = await progressResponse.json()

    setUserProgress(progressData.progress || userProgress)
    setRecentGoals(goalsData.goals?.slice(0, 3) || [])
    setRecentAchievements(
      achievementsData.achievements?.filter((a: Achievement) => a.isUnlocked).slice(0, 3) || []
    )

    const wellnessScore = goalsData.wellnessScore ?? 0



    if (analyticsData.insights) {
      setDashboardStats({
        totalCheckins: analyticsData.insights.totalCheckins,
        totalChatSessions: analyticsData.insights.totalChatSessions,
        totalClarityEntries: analyticsData.insights.totalClarityEntries,
        recentActivity: analyticsData.insights.recentActivity,
        wellnessScore,
      })
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    toast({
      title: "Error",
      description: "Failed to load dashboard data",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-600"
      case "MEDIUM":
        return "bg-yellow-600"
      case "HARD":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getWellnessColor = (score: number) => {
    if (score >= 8) return "text-green-400"
    if (score >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sora-teal mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <SoraLogo/>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Your personalized neurodivergent support hub with insights, progress tracking, and tools
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-sora-teal" />
                <span className="text-2xl font-bold text-sora-teal">{userProgress.totalXP}</span>
              </div>
              <p className="text-gray-300 text-sm">Total XP</p>
              <Badge className="bg-sora-teal text-sora-dark font-semibold mt-2">Level {userProgress.level}</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-orange/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-6 h-6 text-sora-orange" />
                <span className="text-2xl font-bold text-sora-orange">{userProgress.coins}</span>
              </div>
              <p className="text-gray-300 text-sm">Coins</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-6 h-6 text-red-500" />
                <span className="text-2xl font-bold text-red-500">{userProgress.dayStreak}</span>
              </div>
              <p className="text-gray-300 text-sm">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-2xl font-bold text-green-500">{userProgress.goalsCompleted}</span>
              </div>
              <p className="text-gray-300 text-sm">Goals Done</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Progress</h2>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getWellnessColor(dashboardStats.wellnessScore)}`}>
                    {dashboardStats.wellnessScore.toFixed(1)}
                  </div>
                  <p className="text-gray-400 text-sm">Wellness Score</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Progress to Level {userProgress.level + 1}</span>
                <span className="text-sora-teal font-semibold">
                  {userProgress.currentLevelXP}/{userProgress.xpToNextLevel} XP
                </span>
              </div>
              <Progress
                value={(userProgress.currentLevelXP / userProgress.xpToNextLevel) * 100}
                className="h-3 bg-sora-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Goals */}
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Target className="w-6 h-6 text-sora-teal" />
                Recent Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGoals.length > 0 ? (
                  recentGoals.map((goal) => (
                    <div key={goal._id} className="p-4 bg-sora-muted rounded-lg border border-sora-teal/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">{goal.title}</h4>
                        <Badge className={`${getDifficultyColor(goal.difficulty)} text-white text-xs`}>
                          {goal.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-xs mb-3">{goal.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <Star className="w-3 h-3 text-sora-teal" />
                          <span className="text-sora-teal">+{goal.xpReward} XP</span>
                        </div>
                        {goal.isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No goals yet</p>
                    <Button size="sm" className="mt-3 bg-sora-teal hover:bg-sora-teal/80 text-sora-dark">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Goal
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Award className="w-6 h-6 text-sora-orange" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.length > 0 ? (
                  recentAchievements.map((achievement) => (
                    <div key={achievement._id} className="p-4 bg-sora-muted rounded-lg border border-sora-orange/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
                          <p className="text-gray-300 text-xs">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.unlockedAt && (
                        <p className="text-sora-orange text-xs">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No achievements yet</p>
                    <p className="text-gray-500 text-sm">Complete goals to unlock achievements!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Activity className="w-6 h-6 text-green-500" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-sora-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-sora-teal" />
                    <span className="text-white text-sm">Check-ins</span>
                  </div>
                  <span className="text-sora-teal font-semibold">{dashboardStats.totalCheckins}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-sora-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-white text-sm">Chat Sessions</span>
                  </div>
                  <span className="text-red-400 font-semibold">{dashboardStats.totalChatSessions}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-sora-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <span className="text-white text-sm">Clarity Tools</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">{dashboardStats.totalClarityEntries}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-sora-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm">Recent Activity</span>
                  </div>
                  <span className="text-green-400 font-semibold">{dashboardStats.recentActivity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
        <CardDescription className="text-gray-300">
          Jump into your most-used tools and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/app/checkin')}
            className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Daily Check-in</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/app/goals')}
            className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
          >
            <Target className="w-6 h-6" />
            <span className="text-sm">Goals</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/app/clarity')}
            className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
          >
            <Lightbulb className="w-6 h-6" />
            <span className="text-sm">Clarity Tools</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/app/dashboard')}
            className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm">Analytics</span>
          </Button>
        </div>
      </CardContent>
    </Card>
      </div>
    </div>
  )
}

export default Dashboard

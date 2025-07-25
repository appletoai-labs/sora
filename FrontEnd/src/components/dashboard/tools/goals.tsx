"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { Trophy, Star, Coins, Target, CheckCircle, Plus, Lock, Flame, Award } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Goal {
  _id: string
  userId: string
  title: string
  description: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  priority: "HIGH" | "MEDIUM" | "LOW"
  xpReward: number
  coinReward: number
  isCompleted: boolean
  isActive: boolean
  createdAt: string
  completedAt?: string
  category: string
}

interface Achievement {
  _id: string
  title: string
  description: string
  requirement: number
  icon: string
  isUnlocked: boolean
  unlockedAt?: string
}

interface UserProgress {
  level: number
  totalXP: number
  coins: number
  dayStreak: number
  goalsCompleted: number
  xpToNextLevel: number
  currentLevelXP: number
}

const Goals: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeView, setActiveView] = useState<"main" | "achievements" | "createGoal">("main")
  const [goals, setGoals] = useState<Goal[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    totalXP: 0,
    coins: 0,
    dayStreak: 0,
    goalsCompleted: 0,
    xpToNextLevel: 100,
    currentLevelXP: 0,
  })
  const [loading, setLoading] = useState(true)
  const [createGoalOpen, setCreateGoalOpen] = useState(false)

  // Create Goal Form State
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD",
    priority: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW",
    category: "personal",
    type: "Daily Check-in" as string,
  })

  const predefinedGoalTypes = {
    "Daily Check-in": {
      title: "Complete Daily Check-in",
      description: "Track your daily mood, energy, and wellness through SORA's check-in system",
      difficulty: "EASY" as const,
      priority: "HIGH" as const,
      category: "wellness",
      xpReward: 10,
      coinReward: 5,
    },
    "Chat with SORA": {
      title: "Have a Chat Session",
      description: "Engage with SORA's AI support for guidance and conversation",
      difficulty: "EASY" as const,
      priority: "MEDIUM" as const,
      category: "support",
      xpReward: 15,
      coinReward: 8,
    },
    "Sensory Break": {
      title: "Take a Sensory Break",
      description: "Use SORA's sensory tools to regulate and recharge for 10 minutes",
      difficulty: "EASY" as const,
      priority: "HIGH" as const,
      category: "self-care",
      xpReward: 12,
      coinReward: 6,
    },
    "Task Breakdown": {
      title: "Break Down a Task",
      description: "Use SORA's clarity tools to break down an overwhelming task into manageable steps",
      difficulty: "MEDIUM" as const,
      priority: "MEDIUM" as const,
      category: "productivity",
      xpReward: 20,
      coinReward: 12,
    },
    "Community Engagement": {
      title: "Engage with Community",
      description: "Participate in SORA's community features or connect with others",
      difficulty: "MEDIUM" as const,
      priority: "LOW" as const,
      category: "social",
      xpReward: 18,
      coinReward: 10,
    },
  }

  const API_BASE = "http://localhost:5000/api"

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      // Fetch goals
      const goalsResponse = await fetch(`${API_BASE}/goals/usergoals`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const goalsData = await goalsResponse.json()

      // Fetch achievements
      const achievementsResponse = await fetch(`${API_BASE}/goals/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const achievementsData = await achievementsResponse.json()

      // Fetch user progress
      const progressResponse = await fetch(`${API_BASE}/goals/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const progressData = await progressResponse.json()

      setGoals(goalsData.goals || [])
      setAchievements(achievementsData.achievements || [])
      setUserProgress(progressData.progress || userProgress)
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load goals data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async () => {
    let goalData

    if (newGoal.type === "Custom Goal") {
      if (!newGoal.title.trim() || !newGoal.description.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const rewards = getRewardsByDifficulty(newGoal.difficulty)
      goalData = {
        title: newGoal.title,
        description: newGoal.description,
        difficulty: newGoal.difficulty,
        priority: newGoal.priority,
        category: newGoal.category,
        xpReward: rewards.xp,
        coinReward: rewards.coins,
      }
    } else {
      const template = predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes]
      if (!template) {
        toast({
          title: "Error",
          description: "Invalid goal type selected",
          variant: "destructive",
        })
        return
      }

      goalData = {
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        priority: template.priority,
        category: template.category,
        xpReward: template.xpReward,
        coinReward: template.coinReward,
      }
    }

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${API_BASE}/goals/creategoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      })

      if (response.ok) {
        const data = await response.json()
        setGoals([...goals, data.goal])
        setCreateGoalOpen(false)
        setNewGoal({
          title: "",
          description: "",
          difficulty: "EASY",
          priority: "MEDIUM",
          category: "personal",
          type: "Daily Check-in",
        })
        toast({
          title: "Success",
          description: "Goal created successfully!",
        })
      }
    } catch (error) {
      console.error("Error creating goal:", error)
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      })
    }
  }

  const completeGoal = async (goalId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${API_BASE}/goals/${goalId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setGoals(
          goals.map((goal) =>
            goal._id === goalId ? { ...goal, isCompleted: true, completedAt: new Date().toISOString() } : goal,
          ),
        )
        setUserProgress(data.progress)

        toast({
          title: "Goal Completed! 🎉",
          description: `You earned ${data.xpEarned} XP and ${data.coinsEarned} coins!`,
        })

        // Check for new achievements
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach((achievement: Achievement) => {
            toast({
              title: "Achievement Unlocked! 🏆",
              description: achievement.title,
            })
          })
        }
      }
    } catch (error) {
      console.error("Error completing goal:", error)
      toast({
        title: "Error",
        description: "Failed to complete goal",
        variant: "destructive",
      })
    }
  }

  const addSuggestedGoal = async (goalData: Partial<Goal>) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${API_BASE}/goals/addgoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      })

      if (response.ok) {
        const data = await response.json()
        setGoals([...goals, data.goal])
        toast({
          title: "Success",
          description: "Goal added successfully!",
        })
      }
    } catch (error) {
      console.error("Error adding suggested goal:", error)
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-600"
      case "MEDIUM":
        return "bg-sora-orange"
      case "HARD":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-600"
      case "MEDIUM":
        return "bg-sora-orange"
      case "LOW":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRewardsByDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return { xp: 10, coins: 5 }
      case "MEDIUM":
        return { xp: 25, coins: 15 }
      case "HARD":
        return { xp: 50, coins: 30 }
      default:
        return { xp: 10, coins: 5 }
    }
  }

  const predefinedAchievements = [
    {
      title: "Getting Started",
      description: "Complete your first micro-goal",
      requirement: 1,
      icon: "🎯",
    },
    {
      title: "Building Momentum",
      description: "Complete goals for 3 days in a row",
      requirement: 3,
      icon: "🔥",
    },
    {
      title: "Week Warrior",
      description: "Complete goals for 7 days in a row",
      requirement: 7,
      icon: "⚡",
    },
    {
      title: "Rising Star",
      description: "Reach level 5",
      requirement: 5,
      icon: "⭐",
    },
    {
      title: "Goal Achiever",
      description: "Reach level 10",
      requirement: 10,
      icon: "🏆",
    },
    {
      title: "Community Friend",
      description: "Make 5 community posts or comments",
      requirement: 5,
      icon: "👥",
    },
    {
      title: "Self-Care Champion",
      description: "Complete 10 sensory break goals",
      requirement: 10,
      icon: "💚",
    },
    {
      title: "Task Master",
      description: "Complete 20 task breakdown goals",
      requirement: 20,
      icon: "📋",
    },
  ]

  const suggestedGoals = [
    {
      title: "Daily Check-in",
      description: "Build a healthy routine with daily mood tracking",
      difficulty: "EASY" as const,
      priority: "HIGH" as const,
      category: "wellness",
    },
    {
      title: "Chat Session",
      description: "Explore SORA's support features",
      difficulty: "EASY" as const,
      priority: "MEDIUM" as const,
      category: "exploration",
    },
    {
      title: "Task Breakdown",
      description: "Practice breaking down overwhelming tasks",
      difficulty: "MEDIUM" as const,
      priority: "MEDIUM" as const,
      category: "productivity",
    },
    {
      title: "Sensory Break",
      description: "Take a 10-minute sensory break",
      difficulty: "EASY" as const,
      priority: "HIGH" as const,
      category: "self-care",
    },
    {
      title: "Mindfulness Practice",
      description: "Complete a 5-minute mindfulness exercise",
      difficulty: "EASY" as const,
      priority: "MEDIUM" as const,
      category: "wellness",
    },
    {
      title: "Social Connection",
      description: "Reach out to a friend or family member",
      difficulty: "MEDIUM" as const,
      priority: "MEDIUM" as const,
      category: "social",
    },
  ]

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-sora-teal" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              Goals & Achievements
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Build momentum with achievable micro-goals designed for neurodivergent minds
          </p>
        </div>

        {/* Progress Section */}
        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Your Progress</h2>
              <Badge className="bg-sora-teal text-sora-dark font-semibold px-4 py-2 text-lg">
                Level {userProgress.level}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-sora-teal/20 to-sora-teal/10 border border-sora-teal/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-sora-teal" />
                  <span className="text-2xl font-bold text-sora-teal">{userProgress.totalXP}</span>
                </div>
                <p className="text-gray-300">Total XP</p>
              </div>

              <div className="bg-gradient-to-br from-sora-orange/20 to-sora-orange/10 border border-sora-orange/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="w-6 h-6 text-sora-orange" />
                  <span className="text-2xl font-bold text-sora-orange">{userProgress.coins}</span>
                </div>
                <p className="text-gray-300">Coins</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-6 h-6 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">{userProgress.dayStreak}</span>
                </div>
                <p className="text-gray-300">Day Streak</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">{userProgress.goalsCompleted}</span>
                </div>
                <p className="text-gray-300">Goals Completed</p>
              </div>
            </div>

            {/* Progress Bar */}
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

        {/* Active Goals Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Active Goals</h2>
          <Button
            onClick={() => setCreateGoalOpen(true)}
            className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Goal
          </Button>
        </div>

        {/* Active Goals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {goals
            .filter((goal) => goal.isActive && !goal.isCompleted)
            .map((goal) => (
              <Card key={goal._id} className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    <Badge className={`${getDifficultyColor(goal.difficulty)} text-white`}>{goal.difficulty}</Badge>
                  </div>

                  <p className="text-gray-300 mb-6">{goal.description}</p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-sora-teal" />
                      <span className="text-sora-teal">+{goal.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-sora-orange" />
                      <span className="text-sora-orange">+{goal.coinReward} coins</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => completeGoal(goal._id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Goal
                  </Button>

                  <p className="text-gray-400 text-sm mt-4">Created: {new Date(goal.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}

          {goals.filter((goal) => goal.isActive && !goal.isCompleted).length === 0 && (
            <div className="col-span-full text-center py-12">
              <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No active goals yet</p>
              <p className="text-gray-500">Create your first goal to get started!</p>
            </div>
          )}
        </div>

        {/* Suggested Goals */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Suggested Goals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedGoals.map((suggestedGoal, index) => {
              const rewards = getRewardsByDifficulty(suggestedGoal.difficulty)
              return (
                <Card key={index} className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={`${getPriorityColor(suggestedGoal.priority)} text-white mb-4`}>
                        {suggestedGoal.priority} PRIORITY
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{suggestedGoal.title}</h3>
                    <p className="text-gray-300 mb-6">{suggestedGoal.description}</p>

                    <Button
                      onClick={() =>
                        addSuggestedGoal({
                          ...suggestedGoal,
                          xpReward: rewards.xp,
                          coinReward: rewards.coins,
                          isActive: true,
                        })
                      }
                      variant="outline"
                      className="w-full border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add This Goal
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* View Achievements Button */}
        <div className="text-center">
          <Button
            onClick={() => setActiveView("achievements")}
            variant="outline"
            className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
          >
            <Award className="w-5 h-5 mr-2" />
            View All Achievements
          </Button>
        </div>
      </div>

      {/* Create Goal Dialog */}
      <Dialog open={createGoalOpen} onOpenChange={setCreateGoalOpen}>
        <DialogContent className="bg-sora-card border-sora-teal/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-sora-teal">Create New Goal</DialogTitle>
            <DialogDescription className="text-gray-300">
              Set up a new micro-goal to help build momentum in your journey.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Goal Type</label>
              <Select value={newGoal.type} onValueChange={(value) => setNewGoal({ ...newGoal, type: value })}>
                <SelectTrigger className="bg-sora-muted border-sora-teal/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-sora-card border-sora-teal/20">
                  {Object.keys(predefinedGoalTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                  <SelectItem value="Custom Goal">Custom Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newGoal.type === "Custom Goal" && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">Goal Title</label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Enter goal title..."
                    className="bg-sora-muted border-sora-teal/30 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <Textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal..."
                    className="bg-sora-muted border-sora-teal/30 text-white min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Difficulty</label>
                    <Select
                      value={newGoal.difficulty}
                      onValueChange={(value: "EASY" | "MEDIUM" | "HARD") =>
                        setNewGoal({ ...newGoal, difficulty: value })
                      }
                    >
                      <SelectTrigger className="bg-sora-muted border-sora-teal/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-sora-card border-sora-teal/20">
                        <SelectItem value="EASY">Easy (10 XP, 5 coins)</SelectItem>
                        <SelectItem value="MEDIUM">Medium (25 XP, 15 coins)</SelectItem>
                        <SelectItem value="HARD">Hard (50 XP, 30 coins)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Priority</label>
                    <Select
                      value={newGoal.priority}
                      onValueChange={(value: "HIGH" | "MEDIUM" | "LOW") => setNewGoal({ ...newGoal, priority: value })}
                    >
                      <SelectTrigger className="bg-sora-muted border-sora-teal/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-sora-card border-sora-teal/20">
                        <SelectItem value="HIGH">High Priority</SelectItem>
                        <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {newGoal.type !== "Custom Goal" &&
              predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes] && (
                <div className="bg-sora-muted/30 border border-sora-teal/20 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">
                    {predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes].title}
                  </h4>
                  <p className="text-gray-300 mb-3">
                    {predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes].description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge
                      className={`${getDifficultyColor(predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes].difficulty)} text-white`}
                    >
                      {predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes].difficulty}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-sora-teal" />
                      <span className="text-sora-teal">
                        +{predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes].xpReward} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-sora-orange" />
                      <span className="text-sora-orange">
                        +{predefinedGoalTypes[newGoal.type as keyof typeof predefinedGoalTypes].coinReward} coins
                      </span>
                    </div>
                  </div>
                </div>
              )}

            <div className="flex gap-4">
              <Button
                onClick={createGoal}
                className="flex-1 bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold"
              >
                Create Goal
              </Button>
              <Button
                onClick={() => setCreateGoalOpen(false)}
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderAchievementsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveView("main")}
            className="text-sora-teal hover:text-sora-teal/80"
          >
            ← Back to Goals
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="w-8 h-8 text-sora-teal" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              All Achievements
            </h1>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predefinedAchievements.map((achievement, index) => {
            const userAchievement = achievements.find((a) => a.title === achievement.title)
            const isUnlocked = userAchievement?.isUnlocked || false

            return (
              <Card
                key={index}
                className={`bg-gradient-to-br from-sora-card to-sora-muted ${isUnlocked ? "border-sora-teal/40" : "border-gray-600/20"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">
                      {isUnlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-500" />}
                    </div>
                    {isUnlocked && <Badge className="bg-sora-teal text-sora-dark">Unlocked</Badge>}
                  </div>

                  <h3 className={`text-xl font-bold mb-3 ${isUnlocked ? "text-white" : "text-gray-500"}`}>
                    {achievement.title}
                  </h3>

                  <p className={`mb-4 ${isUnlocked ? "text-gray-300" : "text-gray-500"}`}>{achievement.description}</p>

                  <p className={`text-sm ${isUnlocked ? "text-gray-400" : "text-gray-600"}`}>
                    Requirement: {achievement.requirement}
                  </p>

                  {isUnlocked && userAchievement?.unlockedAt && (
                    <p className="text-sora-teal text-sm mt-2">
                      Unlocked: {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sora-teal mx-auto mb-4"></div>
          <p className="text-gray-300">Loading goals...</p>
        </div>
      </div>
    )
  }

  // Render based on active view
  switch (activeView) {
    case "achievements":
      return renderAchievementsView()
    default:
      return renderMainView()
  }
}

export default Goals

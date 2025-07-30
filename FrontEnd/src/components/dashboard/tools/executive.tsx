"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
    List,
    Calendar,
    Clock,
    Brain,
    Lightbulb,
    Timer,
    Shuffle,
    Grid3X3,
    Save,
    Printer,
    Plus,
    Loader2,
    CheckCircle,
    AlertCircle,
    Home,
    Battery,
    RotateCcw,
    Zap,
    Target,
    Users,
    Briefcase,
    Heart,
    Sparkles,
    Moon,
    Coffee,
    Dumbbell,
    Pause,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface RoutineStep {
    time: string
    duration: string
    title: string
    description: string
    flexibility_options: string[]
    sensory_breaks?: string[]
    tips?: string[]
}

interface GeneratedRoutine {
    routine_title: string
    routine_type: string
    steps: RoutineStep[]
    sensory_breaks: string[]
    tips_for_success: string[]
}

interface SavedRoutine {
    _id: string
    title: string
    type: string
    steps: RoutineStep[]
    sensory_breaks: string[]
    tips_for_success: string[]
    createdAt: string
}

const Executive = () => {
    const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`
    const [activeView, setActiveView] = useState<"main" | "routineBuilder" | "routineResult">("main")
    const [selectedRoutineType, setSelectedRoutineType] = useState<string>("")
    const [preferences, setPreferences] = useState<string>("")
    const [brainDumpText, setBrainDumpText] = useState<string>("")
    const [generatedRoutine, setGeneratedRoutine] = useState<GeneratedRoutine | null>(null)
    const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showBrainDump, setShowBrainDump] = useState<boolean>(false)
    const [showRoutineModal, setShowRoutineModal] = useState<boolean>(false)
    const [selectedSavedRoutine, setSelectedSavedRoutine] = useState<SavedRoutine | null>(null)
    const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60)
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)

    const routineTypes = [
        { value: "morning", label: "Morning Routine", icon: Coffee },
        { value: "evening", label: "Evening/Bedtime Routine", icon: Moon },
        { value: "work", label: "Work/Study Routine", icon: Briefcase },
        { value: "selfcare", label: "Self-Care Routine", icon: Heart },
        { value: "cleaning", label: "Cleaning/Household Routine", icon: Home },
        { value: "exercise", label: "Exercise/Movement Routine", icon: Dumbbell },
        { value: "social", label: "Social Energy Management", icon: Users },
        { value: "custom", label: "Custom Routine", icon: Sparkles },
    ]

    const executiveStrategies = [
        {
            title: "Working Memory",
            icon: Brain,
            strategies: [
                "Write everything down immediately",
                "Use voice memos for quick capture",
                "Keep notebooks or apps in consistent places",
                "Use checklists for routine tasks",
                "Set up automatic reminders for recurring tasks",
                "Repeat information out loud",
                "Create visual or silly associations",
                "Use the 'memory palace' technique",
                "Practice the 'touch it once' rule for papers/emails",
            ],
        },
        {
            title: "Organization",
            icon: Home,
            strategies: [
                "Everything needs a specific 'home'",
                "Use clear containers and labels",
                "Keep frequently used items easily accessible",
                "Do a 10-minute daily tidy",
                "Use the 'one in, one out' rule to prevent accumulation",
                "Use consistent file naming conventions",
                "Clean out downloads folder regularly",
                "Organize photos and documents as you go",
                "Use cloud storage for important files",
            ],
        },
        {
            title: "Task Management",
            icon: List,
            strategies: [
                "Use the '2-minute rule' - if it takes less than 2 minutes, do it now",
                "Break large projects into 15-30 minute chunks",
                "Write down each step before starting",
                "Use visual task boards or apps",
                "Set timers for focused work sessions",
                "Use the 'urgent vs important' matrix",
                "Do the hardest task when your energy is highest",
                "Keep a 'someday/maybe' list for non-urgent items",
                "Ask: 'What happens if this doesn't get done today?'",
            ],
        },
        {
            title: "Time Management",
            icon: Clock,
            strategies: [
                "Use visual timers and alarms",
                "Time yourself doing common tasks to learn realistic estimates",
                "Build in buffer time between activities",
                "Use calendar blocking for important tasks",
                "Set reminders 10-15 minutes before transitions",
                "Use multiple alarms with descriptive labels",
                "Put clocks in multiple visible locations",
                "Use apps that announce the time regularly",
                "Practice estimating time and checking your accuracy",
            ],
        },
        {
            title: "Transitions",
            icon: RotateCcw,
            strategies: [
                "Use transition warnings (10, 5, 2 minutes)",
                "Have a consistent 'shutdown' routine for tasks",
                "Prepare for transitions the night before",
                "Use visual schedules for complex transition days",
                "Build in decompression time between activities",
                "Timers with gentle, non-startling alarms",
                "Visual schedules or apps",
                "Transition objects or fidgets",
                "Calming music or sounds",
            ],
        },
        {
            title: "Energy Management",
            icon: Battery,
            strategies: [
                "Track your energy patterns for a week",
                "Schedule demanding tasks during high-energy times",
                "Plan easier tasks for low-energy periods",
                "Take breaks before you feel exhausted",
                "Honor your need for rest and recharging",
                "Batch similar tasks together",
                "Automate recurring decisions (meal planning, outfit selection)",
                "Use 'good enough' standards for non-critical tasks",
                "Delegate or outsource when possible",
            ],
        },
    ]

    const quickTools = [
        {
            title: "Pomodoro Timer",
            description: "25 minutes focused work + 5 minute break",
            icon: Timer,
            action: "startTimer",
        },
        {
            title: "Brain Dump",
            description: "Write down everything on your mind",
            icon: Brain,
            action: "brainDump",
        }
    ]

    useEffect(() => {
        fetchSavedRoutines()
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isTimerRunning && pomodoroTime > 0) {
            interval = setInterval(() => {
                setPomodoroTime((time) => time - 1)
            }, 1000)
        } else if (pomodoroTime === 0) {
            setIsTimerRunning(false)
            alert("Pomodoro session complete! Take a 5-minute break.")
            setPomodoroTime(25 * 60)
        }
        return () => clearInterval(interval)
    }, [isTimerRunning, pomodoroTime])

    const fetchSavedRoutines = async () => {
        try {
            const token = localStorage.getItem("authToken")
            const response = await axios.get(`${API_BASE}/executive/routines`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setSavedRoutines(response.data)
        } catch (error) {
            console.error("Error fetching saved routines:", error)
        }
    }

    const generateRoutine = async () => {
        if (!selectedRoutineType) return

        setIsLoading(true)
        try {
            const token = localStorage.getItem("authToken")
            const response = await axios.post(
                `${API_BASE}/executive/generate-routine`,
                {
                    routineType: selectedRoutineType,
                    preferences: preferences,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            setGeneratedRoutine(response.data)
            setActiveView("routineResult")

            // Save activity to localStorage
            saveActivityToLocalStorage(
                "routine_generated",
                "Routine Generated",
                `Created ${routineTypes.find((t) => t.value === selectedRoutineType)?.label} routine`,
                {
                    routineType: selectedRoutineType,
                    stepCount: response.data.steps.length,
                },
            )
        } catch (error) {
            console.error("Error generating routine:", error)
            alert("Failed to generate routine. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const generateFromBrainDump = async () => {
        if (!brainDumpText.trim()) return

        setIsLoading(true)
        try {
            const token = localStorage.getItem("authToken")
            const response = await axios.post(
                `${API_BASE}/executive/brain-dump-routine`,
                {
                    brainDumpText: brainDumpText,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            setGeneratedRoutine(response.data)
            setShowBrainDump(false)
            setBrainDumpText("")
            setActiveView("routineResult")

            // Save activity to localStorage
            saveActivityToLocalStorage(
                "brain_dump_routine",
                "Brain Dump Routine Created",
                "Created routine from brain dump",
                {
                    textLength: brainDumpText.length,
                    stepCount: response.data.steps.length,
                },
            )
        } catch (error) {
            console.error("Error generating routine from brain dump:", error)
            alert("Failed to generate routine from brain dump. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const saveRoutine = async () => {
        if (!generatedRoutine) return

        try {
            const token = localStorage.getItem("authToken")
            await axios.post(
                `${API_BASE}/executive/save-routine`,
                {
                    title: generatedRoutine.routine_title,
                    type: generatedRoutine.routine_type,
                    steps: generatedRoutine.steps,
                    sensory_breaks: generatedRoutine.sensory_breaks,
                    tips_for_success: generatedRoutine.tips_for_success,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            alert("Routine saved successfully!")
            fetchSavedRoutines()

            // Save activity to localStorage
            saveActivityToLocalStorage("routine_saved", "Routine Saved", `Saved routine: ${generatedRoutine.routine_title}`, {
                routineType: generatedRoutine.routine_type,
            })
        } catch (error) {
            console.error("Error saving routine:", error)
            alert("Failed to save routine. Please try again.")
        }
    }

    const saveActivityToLocalStorage = (type: string, title: string, description: string, additionalData?: any) => {
        try {
            const activities = JSON.parse(localStorage.getItem("sora_recent_activities") || "[]")

            const newActivity = {
                id: `executive_${Date.now()}`,
                type,
                title,
                description,
                timestamp: new Date().toISOString(),
                ...additionalData,
            }

            activities.unshift(newActivity)

            if (activities.length > 50) {
                activities.splice(50)
            }

            localStorage.setItem("sora_recent_activities", JSON.stringify(activities))
        } catch (error) {
            console.error("Error saving executive activity:", error)
        }
    }

    const handleQuickTool = (action: string) => {
        switch (action) {
            case "startTimer":
                setIsTimerRunning(!isTimerRunning)
                break
            case "brainDump":
                setShowBrainDump(true)
                break
            case "randomize":
                alert("Task Randomizer coming soon!")
                break
            case "prioritize":
                alert("Priority Matrix coming soon!")
                break
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const printRoutine = () => {
        if (!generatedRoutine) return

        const printWindow = window.open("", "_blank")
        if (!printWindow) {
            alert("Please allow popups to print")
            return
        }

        const printStyles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #00CED1;
          margin-bottom: 10px;
        }
        .step-card {
          border: 1px solid #ddd;
          border-left: 4px solid #00CED1;
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 5px;
        }
        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .time-badge {
          background: #00CED1;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }
        .duration {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin: 15px 0;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 5px;
          color: #00CED1;
        }
        ul {
          margin: 5px 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 3px;
        }
      </style>
    `

        const printHTML = `
      <h1>${generatedRoutine.routine_title}</h1>
      
      ${generatedRoutine.steps
                .map(
                    (step) => `
        <div class="step-card">
          <div class="step-header">
            <span class="time-badge">${step.time}</span>
            <span class="duration">${step.duration}</span>
          </div>
          <h3>${step.title}</h3>
          <p>${step.description}</p>
          
          ${step.flexibility_options?.length
                            ? `
            <div class="section">
              <div class="section-title">Flexibility Options:</div>
              <ul>
                ${step.flexibility_options.map((option) => `<li>${option}</li>`).join("")}
              </ul>
            </div>
          `
                            : ""
                        }
        </div>
      `,
                )
                .join("")}
      
      ${generatedRoutine.sensory_breaks?.length
                ? `
        <div class="section">
          <h2>Built-in Sensory Breaks:</h2>
          <ul>
            ${generatedRoutine.sensory_breaks.map((breakItem) => `<li>${breakItem}</li>`).join("")}
          </ul>
        </div>
      `
                : ""
            }
      
      ${generatedRoutine.tips_for_success?.length
                ? `
        <div class="section">
          <h2>Tips for Success:</h2>
          <ul>
            ${generatedRoutine.tips_for_success.map((tip) => `<li>${tip}</li>`).join("")}
          </ul>
        </div>
      `
                : ""
            }
    `

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SORA - ${generatedRoutine.routine_title}</title>
          ${printStyles}
        </head>
        <body>
          ${printHTML}
        </body>
      </html>
    `)

        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
            printWindow.print()
            printWindow.close()
        }, 250)
    }

    const renderMainView = () => (
        <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <List className="w-8 h-8 text-sora-teal" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
                            Executive Function Tools
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Build routines, organize tasks, and develop systems that support your executive function needs and unique
                        working style.
                    </p>
                </div>

                {/* SORA Routine Builder */}
                <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-12">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-8 h-8 text-sora-teal" />
                            <CardTitle className="text-2xl text-sora-teal">SORA Routine Builder</CardTitle>
                        </div>
                        <p className="text-gray-300">
                            Create personalized routines that work with your brain, not against it. Tell me what kind of routine you
                            need, and I'll help you build one.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button
                            onClick={() => setActiveView("routineBuilder")}
                            className="w-full bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold py-3"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Routine
                        </Button>

                        {savedRoutines.length > 0 && (
                            <div>
                                <h3 className="text-white font-semibold mb-4">Your Saved Routines:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {savedRoutines.map((routine) => (
                                        <Card
                                            key={routine._id}
                                            className="bg-sora-muted border-sora-teal/30 cursor-pointer hover:border-sora-teal/60 transition-colors"
                                            onClick={() => {
                                                setSelectedSavedRoutine(routine)
                                                setShowRoutineModal(true)
                                            }}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {(() => {
                                                        const routineType = routineTypes.find((t) => t.value === routine.type)
                                                        const IconComponent = routineType?.icon || Sparkles
                                                        return <IconComponent className="w-5 h-5 text-sora-teal" />
                                                    })()}
                                                    <h4 className="text-white font-medium truncate">{routine.title}</h4>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {routine.steps.length} steps • {new Date(routine.createdAt).toLocaleDateString()}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>

                {/* Quick Executive Function Tools */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <Zap className="w-8 h-8 text-sora-teal" />
                        <h2 className="text-3xl font-bold text-sora-teal">Quick Executive Function Tools</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickTools.map((tool, index) => (
                            <Card
                                key={index}
                                className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 hover:border-sora-teal/40 transition-all duration-300 cursor-pointer group"
                                onClick={() => handleQuickTool(tool.action)}
                            >
                                <CardContent className="p-6 text-center">
                                    <tool.icon className="w-12 h-12 text-sora-teal mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl font-bold text-white mb-3">{tool.title}</h3>
                                    <p className="text-gray-300 text-sm">{tool.description}</p>
                                    {tool.action === "startTimer" && (
                                        <div className="mt-4">
                                            <div className="text-2xl font-mono text-sora-teal">{formatTime(pomodoroTime)}</div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                                            >
                                                {isTimerRunning ? "Pause" : "Start"}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Executive Function Strategies */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <Lightbulb className="w-8 h-8 text-sora-teal" />
                        <h2 className="text-3xl font-bold text-sora-teal">Executive Function Strategies</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {executiveStrategies.map((strategy, index) => (
                            <Card key={index} className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <strategy.icon className="w-8 h-8 text-sora-teal" />
                                        <CardTitle className="text-xl text-white">{strategy.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {strategy.strategies.slice(0, 5).map((item, i) => (
                                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-sora-teal rounded-full mt-2 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Brain Dump Modal */}
            <Dialog open={showBrainDump} onOpenChange={setShowBrainDump}>
                <DialogContent className="bg-sora-card border-sora-teal/30 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-sora-teal flex items-center gap-3">
                            <Brain className="w-8 h-8" />
                            Brain Dump
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-gray-300">
                            Write down everything that's on your mind. Don't worry about organizing - just get it all out!
                        </p>
                        <Textarea
                            value={brainDumpText}
                            onChange={(e) => setBrainDumpText(e.target.value)}
                            placeholder="Start writing..."
                            className="bg-sora-muted border-sora-teal/30 text-white placeholder-gray-400 min-h-[200px]"
                        />
                        <div className="flex gap-4">
                            <Button
                                onClick={generateFromBrainDump}
                                disabled={!brainDumpText.trim() || isLoading}
                                className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating Routine...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Create Routine from This
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setBrainDumpText("")
                                    setShowBrainDump(false)
                                }}
                                className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark"
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Saved Routine Modal */}
            <Dialog open={showRoutineModal} onOpenChange={setShowRoutineModal}>
                <DialogContent className="bg-sora-card border-sora-teal/30 max-w-4xl max-h-[80vh] overflow-y-auto">
                    {selectedSavedRoutine && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl text-sora-teal flex items-center gap-3">
                                    <CheckCircle className="w-8 h-8" />
                                    {selectedSavedRoutine.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                {selectedSavedRoutine.steps.map((step, index) => (
                                    <Card key={index} className="bg-sora-muted border-l-4 border-l-sora-teal">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <Badge className="bg-sora-teal text-sora-dark">{step.time}</Badge>
                                                <span className="text-gray-400 text-sm">{step.duration}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                                            <p className="text-gray-300 mb-3">{step.description}</p>
                                            {step.flexibility_options?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sora-teal font-medium mb-2">Flexibility Options:</h4>
                                                    <ul className="space-y-1">
                                                        {step.flexibility_options.map((option, i) => (
                                                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                                                <div className="w-1.5 h-1.5 bg-sora-teal rounded-full mt-2 flex-shrink-0" />
                                                                {option}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )

    const renderRoutineBuilder = () => (
        <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveView("main")}
                        className="text-sora-teal hover:text-sora-teal/80"
                    >
                        ← Back to Executive Function Tools
                    </Button>
                </div>

                <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-8 h-8 text-sora-teal" />
                            <CardTitle className="text-2xl text-sora-teal">SORA Routine Builder</CardTitle>
                        </div>
                        <p className="text-gray-300">
                            Create personalized routines that work with your brain, not against it. Tell me what kind of routine you
                            need, and I'll help you build one.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-white font-medium mb-3">What type of routine do you want to create?</label>
                            <Select value={selectedRoutineType} onValueChange={setSelectedRoutineType}>
                                <SelectTrigger className="bg-sora-muted border-sora-teal/30 text-white">
                                    <SelectValue placeholder="Choose a routine type..." />
                                </SelectTrigger>
                                <SelectContent className="bg-sora-muted border-sora-teal/30">
                                    {routineTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-sora-teal/20">
                                            <div className="flex items-center gap-2">
                                                <type.icon className="w-4 h-4" />
                                                {type.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-3">Tell me about your preferences and needs:</label>
                            <Textarea
                                value={preferences}
                                onChange={(e) => setPreferences(e.target.value)}
                                placeholder="For example: I have ADHD and struggle with transitions, I work from home, I'm not a morning person, I need flexibility for sensory needs, I have limited energy..."
                                className="bg-sora-muted border-sora-teal/30 text-white placeholder-gray-400 min-h-[120px]"
                            />
                            <p className="text-gray-400 text-sm mt-2">
                                Include any challenges, time constraints, energy patterns, or specific needs you have.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button
                                onClick={generateRoutine}
                                disabled={!selectedRoutineType || isLoading}
                                className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold py-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Creating Your Routine...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Create My Routine
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setShowBrainDump(true)}
                                className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark"
                            >
                                <Brain className="w-5 h-5 mr-2" />
                                Brain Dump Instead
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )

    const renderRoutineResult = () => {
        if (!generatedRoutine) return null

        return (
            <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveView("routineBuilder")}
                            className="text-sora-teal hover:text-sora-teal/80"
                        >
                            ← Back to Routine Builder
                        </Button>
                    </div>

                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-8 h-8 text-sora-teal" />
                                <CardTitle className="text-2xl text-sora-teal">{generatedRoutine.routine_title}</CardTitle>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="space-y-6 mb-8">
                        {generatedRoutine.steps.map((step, index) => (
                            <Card
                                key={index}
                                className="bg-gradient-to-br from-sora-card to-sora-muted border-l-4 border-l-sora-teal"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <Badge className="bg-sora-teal text-sora-dark font-semibold">{step.time}</Badge>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{step.duration}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl text-white font-semibold mb-3">{step.title}</h3>
                                    <p className="text-gray-300 mb-4">{step.description}</p>

                                    {step.flexibility_options?.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlertCircle className="w-5 h-5 text-sora-teal" />
                                                <h4 className="text-sora-teal font-semibold">Flexibility Options:</h4>
                                            </div>
                                            <ul className="space-y-2 ml-7">
                                                {step.flexibility_options.map((option, i) => (
                                                    <li key={i} className="text-gray-300 flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-sora-teal rounded-full mt-2 flex-shrink-0" />
                                                        {option}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {generatedRoutine.sensory_breaks?.length > 0 && (
                        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Pause className="w-6 h-6 text-sora-teal" />
                                    <h2 className="text-xl font-bold text-sora-teal">Built-in Sensory Breaks:</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {generatedRoutine.sensory_breaks.map((breakItem, i) => (
                                        <Badge key={i} variant="secondary" className="bg-green-600 text-white">
                                            {breakItem}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {generatedRoutine.tips_for_success?.length > 0 && (
                        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-6 h-6 text-sora-teal" />
                                    <h2 className="text-xl font-bold text-sora-teal">Tips for Success:</h2>
                                </div>
                                <ul className="space-y-2">
                                    {generatedRoutine.tips_for_success.map((tip, i) => (
                                        <li key={i} className="text-gray-300 flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-sora-teal rounded-full mt-2 flex-shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            variant="outline"
                            onClick={printRoutine}
                            className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Routine
                        </Button>
                        <Button onClick={saveRoutine} className="bg-green-600 hover:bg-green-700 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Save Routine
                        </Button>
                        <Button
                            className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark"
                            onClick={() => {
                                setSelectedRoutineType("")
                                setPreferences("")
                                setGeneratedRoutine(null)
                                setActiveView("routineBuilder")
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Another
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-sora-card border border-sora-teal/30 rounded-lg p-8 flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-sora-teal animate-spin" />
                        <p className="text-white text-lg font-medium">Creating your personalized routine...</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={isLoading ? "blur-sm pointer-events-none" : ""}>
                {(() => {
                    switch (activeView) {
                        case "routineBuilder":
                            return renderRoutineBuilder()
                        case "routineResult":
                            return renderRoutineResult()
                        default:
                            return renderMainView()
                    }
                })()}
            </div>
        </div>
    )
}

export default Executive

"use client"

import type React from "react"
import { useState } from "react"
import type { FC } from "react"
import axios from "axios"
import {
  Lightbulb,
  Heart,
  Clock,
  Pause,
  CheckCircle,
  RotateCcw,
  List,
  AlertTriangle,
  Wrench,
  Copy,
  Printer,
  Plus,
  Hand,
  Eye,
  ArrowRight,
  LifeBuoy,
  Zap,
  Loader2,
} from "lucide-react"
import type { JSX } from "react/jsx-runtime"

// Mock UI components with TypeScript types
interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

interface CardHeaderProps {
  children: React.ReactNode
}

interface CardTitleProps {
  className?: string
  children: React.ReactNode
}

interface CardContentProps {
  className?: string
  children: React.ReactNode
}

interface ButtonProps {
  className?: string
  variant?: "ghost" | "outline" | "destructive" | "default"
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}

interface TextareaProps {
  className?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
}

interface BadgeProps {
  className?: string
  variant?: "secondary" | "default"
  children: React.ReactNode
}

const Card: FC<CardProps> = ({ className, children, onClick }) => (
  <div className={`rounded-lg shadow-lg ${className}`} onClick={onClick}>
    {children}
  </div>
)

const CardHeader: FC<CardHeaderProps> = ({ children }) => <div className="p-4">{children}</div>

const CardTitle: FC<CardTitleProps> = ({ className, children }) => (
  <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>
)

const CardContent: FC<CardContentProps> = ({ className, children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

const Button: FC<ButtonProps> = ({ className, variant = "default", onClick, children, disabled }) => {
  const baseStyles = "px-4 py-2 rounded font-semibold transition-all duration-200 flex items-center justify-center"
  const variantStyles =
    variant === "ghost"
      ? "bg-transparent hover:bg-gray-700 text-sora-teal"
      : variant === "outline"
        ? "bg-transparent border border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark"
        : variant === "destructive"
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-sora-teal hover:bg-sora-teal/80 text-sora-dark"

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : ""

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Textarea: FC<TextareaProps> = ({ className, value, onChange, placeholder }) => (
  <textarea
    className={`w-full p-3 rounded border resize-none ${className}`}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
)

const Badge: FC<BadgeProps> = ({ className, variant = "default", children }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
      variant === "secondary" ? "bg-sora-orange text-sora-dark" : "bg-sora-teal text-sora-dark"
    } ${className}`}
  >
    {children}
  </span>
)

interface Step {
  id: number
  title: string
  description: string
  timeEstimate: string
  toolsNeeded: string[]
  challenges: string[]
  solutions: string[]
}

interface TaskBreakdown {
  title: string
  difficulty: "Easy" | "Moderate" | "Hard"
  totalTime: string
  steps: Step[]
}

interface OverwhelmResult {
  immediate_actions: string[]
  grounding_techniques: string[]
  sensory_strategies: string[]
  next_steps: string[]
  affirmation: string
}

const Clarity: FC = () => {
  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`
  const [activeView, setActiveView] = useState<
    "main" | "taskForm" | "overwhelmForm" | "taskResult" | "overwhelmResult"
  >("main")
  const [taskInput, setTaskInput] = useState<string>("")
  const [overwhelmInput, setOverwhelmInput] = useState<string>("")
  const [triggersInput, setTriggersInput] = useState<string>("")
  const [taskResult, setTaskResult] = useState<TaskBreakdown | OverwhelmResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Function to save activity to localStorage
  const saveActivityToLocalStorage = (type: string, title: string, description: string, additionalData?: any) => {
    try {
      const activities = JSON.parse(localStorage.getItem("sora_recent_activities") || "[]")

      const newActivity = {
        id: `clarity_${Date.now()}`,
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
        ...additionalData,
      }

      activities.unshift(newActivity)

      // Keep only the most recent 50 activities
      if (activities.length > 50) {
        activities.splice(50)
      }

      localStorage.setItem("sora_recent_activities", JSON.stringify(activities))
    } catch (error) {
      console.error("Error saving clarity activity:", error)
    }
  }

  const tipsForSuccess: { icon: JSX.Element; title: string; description: string }[] = [
    {
      icon: <Clock className="w-8 h-8 text-sora-teal" />,
      title: "Start Small",
      description: "Begin with the easiest step to build momentum and confidence.",
    },
    {
      icon: <Pause className="w-8 h-8 text-sora-teal" />,
      title: "Take Breaks",
      description: "Schedule regular breaks between steps to prevent overwhelm.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-sora-teal" />,
      title: "Celebrate Progress",
      description: "Acknowledge each completed step, no matter how small.",
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-sora-teal" />,
      title: "Be Flexible",
      description: "It's okay to modify steps or take longer than estimated.",
    },
  ]

  const handleTaskBreakdown = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/clarity/task-breakdown`, {
        taskDescription: taskInput,
        userContext: null,
      })
      const result: TaskBreakdown = {
        title: response.data.task_title,
        difficulty: response.data.difficulty_level,
        totalTime: response.data.total_estimated_time,
        steps: response.data.steps.map((step: any) => ({
          id: step.step_number,
          title: step.description,
          description: step.description,
          timeEstimate: step.estimated_time,
          toolsNeeded: step.tools_needed,
          challenges: step.potential_challenges,
          solutions: step.solutions,
        })),
      }
      setTaskResult(result)

      // Save activity to localStorage
      saveActivityToLocalStorage("task_breakdown", "Task Breakdown Created", `Created breakdown for: ${result.title}`, {
        difficulty: result.difficulty,
        totalTime: result.totalTime,
        stepCount: result.steps.length,
        originalTask: taskInput,
      })

      setActiveView("taskResult")
    } catch (error) {
      console.error("Error fetching task breakdown:", error)
      alert("Failed to fetch task breakdown. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOverwhelmSupport = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/clarity/overwhelm-support`, {
        situation: overwhelmInput,
        triggers: triggersInput ? triggersInput.split(",").map((t: string) => t.trim()) : [],
      })
      setTaskResult(response.data)

      // Save activity to localStorage
      saveActivityToLocalStorage(
        "overwhelm_support",
        "Overwhelm Support Received",
        `Got support for overwhelming situation`,
        {
          situation: overwhelmInput.substring(0, 100) + (overwhelmInput.length > 100 ? "..." : ""),
          triggers: triggersInput ? triggersInput.split(",").map((t: string) => t.trim()) : [],
          strategiesCount: response.data.immediate_actions?.length || 0,
        },
      )

      setActiveView("overwhelmResult")
    } catch (error) {
      console.error("Error fetching overwhelm support:", error)
      alert("Failed to fetch overwhelm support. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!taskResult) return

    let textToCopy = ""

    if ("steps" in taskResult) {
      const result = taskResult as TaskBreakdown
      textToCopy = `Task Breakdown: ${result.title}\n`
      textToCopy += `Difficulty: ${result.difficulty}\n`
      textToCopy += `Total Time: ${result.totalTime}\n\n`

      result.steps.forEach((step, index) => {
        textToCopy += `Step ${step.id}: ${step.title}\n`
        textToCopy += `Time: ${step.timeEstimate}\n`
        textToCopy += `Tools Needed: ${step.toolsNeeded.join(", ")}\n`
        textToCopy += `Challenges: ${step.challenges.join(", ")}\n`
        textToCopy += `Solutions: ${step.solutions.join(", ")}\n\n`
      })
    } else {
      const result = taskResult as OverwhelmResult
      textToCopy = `Overwhelm Support\n\n`
      textToCopy += `Affirmation: ${result.affirmation}\n\n`
      textToCopy += `Immediate Actions:\n${result.immediate_actions.map((action) => `• ${action}`).join("\n")}\n\n`
      textToCopy += `Grounding Techniques:\n${result.grounding_techniques.map((technique) => `• ${technique}`).join("\n")}\n\n`
      textToCopy += `Sensory Strategies:\n${result.sensory_strategies.map((strategy) => `• ${strategy}`).join("\n")}\n\n`
      textToCopy += `Next Steps:\n${result.next_steps.map((step) => `• ${step}`).join("\n")}`
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      alert("Content copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
      alert("Failed to copy to clipboard. Please try again.")
    }
  }

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content")
    if (!printContent) return

    const originalContent = document.body.innerHTML
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
        .step-badge {
          background: #00CED1;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }
        .time-estimate {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin: 15px 0;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .tools { color: #00CED1; }
        .challenges { color: #FF8C00; }
        .solutions { color: #32CD32; }
        ul {
          margin: 5px 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 3px;
        }
        .support-section {
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #00CED1;
          background: #f9f9f9;
        }
        .affirmation {
          font-style: italic;
          font-size: 18px;
          color: #32CD32;
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background: #f0f8f0;
          border-radius: 5px;
        }
      </style>
    `

    let printHTML = ""

    if (taskResult && "steps" in taskResult) {
      const result = taskResult as TaskBreakdown
      printHTML = `
        <h1>Task Breakdown: ${result.title}</h1>
        <p><strong>Difficulty:</strong> ${result.difficulty}</p>
        <p><strong>Total Time:</strong> ${result.totalTime}</p>
        
        ${result.steps
          .map(
            (step) => `
          <div class="step-card">
            <div class="step-header">
              <span class="step-badge">Step ${step.id}</span>
              <span class="time-estimate">${step.timeEstimate}</span>
            </div>
            <h3>${step.title}</h3>
            
            <div class="section">
              <div class="section-title tools">Tools/Resources Needed:</div>
              <ul>
                ${step.toolsNeeded.map((tool) => `<li>${tool}</li>`).join("")}
              </ul>
            </div>
            
            <div class="section">
              <div class="section-title challenges">Potential Challenges:</div>
              <ul>
                ${step.challenges.map((challenge) => `<li>${challenge}</li>`).join("")}
              </ul>
            </div>
            
            <div class="section">
              <div class="section-title solutions">Solutions & Tips:</div>
              <ul>
                ${step.solutions.map((solution) => `<li>${solution}</li>`).join("")}
              </ul>
            </div>
          </div>
        `,
          )
          .join("")}
      `
    } else if (taskResult) {
      const result = taskResult as OverwhelmResult
      printHTML = `
        <h1>Overwhelm Support</h1>
        <div class="affirmation">${result.affirmation}</div>
        
        <div class="support-section">
          <h2>Do This Right Now:</h2>
          <ul>
            ${result.immediate_actions.map((action) => `<li>${action}</li>`).join("")}
          </ul>
        </div>
        
        <div class="support-section">
          <h2>Grounding Techniques:</h2>
          <ul>
            ${result.grounding_techniques.map((technique) => `<li>${technique}</li>`).join("")}
          </ul>
        </div>
        
        <div class="support-section">
          <h2>Sensory Strategies:</h2>
          <ul>
            ${result.sensory_strategies.map((strategy) => `<li>${strategy}</li>`).join("")}
          </ul>
        </div>
        
        <div class="support-section">
          <h2>When You're Ready, Next Steps:</h2>
          <ul>
            ${result.next_steps.map((step) => `<li>${step}</li>`).join("")}
          </ul>
        </div>
      `
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SORA - Clarity Tools</title>
          ${printStyles}
        </head>
        <body>
          ${printHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-sora-teal" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              Clarity Tools
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Break down overwhelming tasks, manage complex situations, and get step-by-step guidance designed for
            neurodivergent minds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card
            className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 hover:border-sora-teal/40 transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveView("taskForm")}
          >
            <CardContent className="p-8 text-center">
              <List className="w-16 h-16 text-sora-teal mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-4">Task Breakdown</h3>
              <p className="text-gray-300">
                Break overwhelming tasks into clear, manageable steps with time estimates and resources needed.
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 hover:border-sora-teal/40 transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveView("overwhelmForm")}
          >
            <CardContent className="p-8 text-center">
              <Heart className="w-16 h-16 text-sora-teal mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-4">Overwhelm Support</h3>
              <p className="text-gray-300">
                Get immediate, practical support for overwhelming situations with calming strategies and next steps.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-sora-teal rounded-full flex items-center justify-center">
              <span className="text-sora-dark font-bold">★</span>
            </div>
            <h2 className="text-3xl font-bold text-sora-teal">Tips for Success</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tipsForSuccess.map((tip, index) => (
              <Card key={index} className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">{tip.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
                  <p className="text-gray-300 text-sm">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTaskForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveView("main")}
            className="text-sora-teal hover:text-sora-teal/80"
          >
            ← Back to Clarity Tools
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal border-2">
            <CardContent className="p-6 text-center">
              <List className="w-12 h-12 text-sora-teal mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Task Breakdown</h3>
              <p className="text-gray-300 text-sm">
                Break overwhelming tasks into clear, manageable steps with time estimates and resources needed.
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 cursor-pointer"
            onClick={() => setActiveView("overwhelmForm")}
          >
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 text-sora-teal mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Overwhelm Support</h3>
              <p className="text-gray-300 text-sm">
                Get immediate, practical support for overwhelming situations with calming strategies and next steps.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
          <CardHeader>
            <CardTitle className="text-2xl text-sora-teal">Task Breakdown Assistant</CardTitle>
            <p className="text-gray-300">
              Describe a task or project that feels overwhelming. I'll help break it down into manageable steps with
              clear guidance.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Describe your task or project:</label>
              <Textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="I have to write a report"
                className="bg-sora-muted border-sora-teal/30 text-white placeholder-gray-400 min-h-[120px]"
              />
              <p className="text-gray-400 text-sm mt-2">
                Be as specific as possible. Include any challenges or constraints you're aware of.
              </p>
            </div>

            <Button
              onClick={handleTaskBreakdown}
              className="w-full bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold py-3"
              disabled={!taskInput.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Breaking Down Task...
                </>
              ) : (
                <>
                  <Wrench className="w-5 h-5 mr-2" />
                  Break Down Task
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderOverwhelmForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveView("main")}
            className="text-sora-teal hover:text-sora-teal/80"
          >
            ← Back to Clarity Tools
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card
            className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 cursor-pointer"
            onClick={() => setActiveView("taskForm")}
          >
            <CardContent className="p-6 text-center">
              <List className="w-12 h-12 text-sora-teal mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Task Breakdown</h3>
              <p className="text-gray-300 text-sm">
                Break overwhelming tasks into clear, manageable steps with time estimates and resources needed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal border-2">
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 text-sora-teal mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Overwhelm Support</h3>
              <p className="text-gray-300 text-sm">
                Get immediate, practical support for overwhelming situations with calming strategies and next steps.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
          <CardHeader>
            <CardTitle className="text-2xl text-sora-teal">Overwhelm Support</CardTitle>
            <p className="text-gray-300">
              Share what's making you feel overwhelmed right now. I'll provide immediate, practical strategies to help
              you feel more grounded.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">What's happening that feels overwhelming?</label>
              <Textarea
                value={overwhelmInput}
                onChange={(e) => setOverwhelmInput(e.target.value)}
                placeholder="Describe your current situation, feelings, or what's making you feel overwhelmed..."
                className="bg-sora-muted border-sora-teal/30 text-white placeholder-gray-400 min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-3">
                Any specific triggers or challenges? (Optional)
              </label>
              <Textarea
                value={triggersInput}
                onChange={(e) => setTriggersInput(e.target.value)}
                placeholder="For example: sensory overload, too many decisions, time pressure, social situations..."
                className="bg-sora-muted border-sora-teal/30 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleOverwhelmSupport}
              className="w-full bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold py-3"
              disabled={!overwhelmInput.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Getting Support...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Get Support
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTaskResult = () => {
    if (!taskResult || !("steps" in taskResult)) return null
    const result = taskResult as TaskBreakdown

    return (
      <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setActiveView("taskForm")}
              className="text-sora-teal hover:text-sora-teal/80"
            >
              ← Back to Task Form
            </Button>
          </div>

          <div id="printable-content">
            <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-sora-teal" />
                  <CardTitle className="text-2xl text-sora-teal">Task Breakdown: {result.title}</CardTitle>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Difficulty Level:</span>
                    <Badge variant="secondary" className="bg-sora-orange text-sora-dark">
                      {result.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sora-teal">
                    <Clock className="w-5 h-5" />
                    <span>Total estimated time: {result.totalTime}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleCopyToClipboard}
                    className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Steps
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {result.steps.map((step, index) => (
                <Card
                  key={step.id}
                  className="bg-gradient-to-br from-sora-card to-sora-muted border-l-4 border-l-sora-teal"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-sora-teal text-sora-dark font-semibold">Step {step.id}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{step.timeEstimate}</span>
                      </div>
                    </div>

                    <h3 className="text-xl text-white font-semibold mb-6">{step.title}</h3>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Wrench className="w-5 h-5 text-sora-teal" />
                          <h4 className="text-sora-teal font-semibold">Tools/Resources Needed:</h4>
                        </div>
                        <ul className="space-y-1 ml-7">
                          {step.toolsNeeded.map((tool, i) => (
                            <li key={i} className="text-gray-300">
                              • {tool}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-sora-orange" />
                          <h4 className="text-sora-orange font-semibold">Potential Challenges:</h4>
                        </div>
                        <ul className="space-y-1 ml-7">
                          {step.challenges.map((challenge, i) => (
                            <li key={i} className="text-sora-orange">
                              • {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-green-400" />
                          <h4 className="text-green-400 font-semibold">Solutions & Tips:</h4>
                        </div>
                        <ul className="space-y-1 ml-7">
                          {step.solutions.map((solution, i) => (
                            <li key={i} className="text-green-400">
                              • {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8 justify-center">
            <Button className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print Steps
            </Button>
            <Button
              variant="outline"
              className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
              onClick={() => {
                setTaskInput("")
                setActiveView("taskForm")
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Break Down Another Task
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderOverwhelmResult = () => {
    if (!taskResult || !("immediate_actions" in taskResult)) return null
    const result = taskResult as OverwhelmResult

    return (
      <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setActiveView("overwhelmForm")}
              className="text-sora-teal hover:text-sora-teal/80"
            >
              ← Back to Overwhelm Form
            </Button>
          </div>

          <div id="printable-content">
            <Card className="bg-gradient-to-br from-green-900/20 to-sora-card border-green-400/30 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-sora-teal" />
                  <h1 className="text-3xl font-bold text-sora-teal">Here's Some Support for You</h1>
                </div>

                <div className="bg-green-900/30 border-l-4 border-l-green-400 p-6 rounded-r-lg">
                  <p className="text-green-400 text-xl italic font-medium">{result.affirmation}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ArrowRight className="w-6 h-6 text-sora-teal" />
                  <h2 className="text-2xl font-bold text-sora-teal">Do This Right Now:</h2>
                </div>

                <ul className="space-y-4">
                  {result.immediate_actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-white">{action}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Hand className="w-6 h-6 text-sora-teal" />
                  <h2 className="text-2xl font-bold text-sora-teal">Grounding Techniques:</h2>
                </div>

                <ul className="space-y-4">
                  {result.grounding_techniques.map((technique, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-teal rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-white">{technique}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-6 h-6 text-sora-teal" />
                  <h2 className="text-2xl font-bold text-sora-teal">Sensory Strategies:</h2>
                </div>

                <ul className="space-y-4">
                  {result.sensory_strategies.map((strategy, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-orange rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-white">{strategy}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ArrowRight className="w-6 h-6 text-sora-teal" />
                  <h2 className="text-2xl font-bold text-sora-teal">When You're Ready, Next Steps:</h2>
                </div>

                <ul className="space-y-4">
                  {result.next_steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-white">{step}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              <LifeBuoy className="w-4 h-4 mr-2" />
              Need More Support
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Support
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Support
            </Button>
            <Button
              className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark"
              onClick={() => {
                setOverwhelmInput("")
                setTriggersInput("")
                setActiveView("overwhelmForm")
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Get More Support
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
            <p className="text-white text-lg font-medium">
              {activeView === "taskForm" ? "Breaking down your task..." : "Getting support for you..."}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={isLoading ? "blur-sm pointer-events-none" : ""}>
        {(() => {
          switch (activeView) {
            case "taskForm":
              return renderTaskForm()
            case "overwhelmForm":
              return renderOverwhelmForm()
            case "taskResult":
              return renderTaskResult()
            case "overwhelmResult":
              return renderOverwhelmResult()
            default:
              return renderMainView()
          }
        })()}
      </div>
    </div>
  )
}

export default Clarity

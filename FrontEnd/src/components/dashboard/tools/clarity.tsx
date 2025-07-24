"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

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

const Clarity: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "main" | "taskBreakdown" | "overwhelmSupport" | "taskForm" | "overwhelmForm" | "taskResult" | "overwhelmResult"
  >("main")
  const [taskInput, setTaskInput] = useState("")
  const [overwhelmInput, setOverwhelmInput] = useState("")
  const [triggersInput, setTriggersInput] = useState("")
  const [taskResult, setTaskResult] = useState<TaskBreakdown | null>(null)

  const tipsForSuccess = [
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

  const handleTaskBreakdown = () => {
    // Simulate AI processing
    const mockResult: TaskBreakdown = {
      title: taskInput || "Write a Report",
      difficulty: "Moderate",
      totalTime: "6 hours and 15 minutes plus one day for a break",
      steps: [
        {
          id: 1,
          title: "Understand the assignment requirements and pick a topic (if necessary).",
          description: "Read through all assignment guidelines and select your topic",
          timeEstimate: "30 minutes",
          toolsNeeded: ["Assignment guidelines", "Notebook"],
          challenges: ["Difficulty focusing on reading or understanding the requirements"],
          solutions: [
            "Break down the document into sections",
            "Use highlighters for important points",
            "Set a timer for focused reading sessions of 10 minutes",
          ],
        },
        {
          id: 2,
          title: "Create a clear outline for the report with main sections and bullet points.",
          description: "Structure your report with clear headings and subpoints",
          timeEstimate: "45 minutes",
          toolsNeeded: ["Notebook", "Mind-mapping software"],
          challenges: ["Overwhelm from details", "Trouble organizing thoughts"],
          solutions: [
            "Start with broad concepts",
            "Use post-it notes to physically organize ideas",
            "Set a timer for short intervals and take breaks",
          ],
        },
        {
          id: 3,
          title: "Research and gather information for each section.",
          description: "Collect relevant sources and information for your report",
          timeEstimate: "1 hour",
          toolsNeeded: ["Word processor", "Assignment guidelines"],
          challenges: ["Attention to detail may be difficult"],
          solutions: [
            "Create a checklist of formatting requirements",
            "Use formatting tools available in the word processor",
          ],
        },
      ],
    }
    setTaskResult(mockResult)
    setActiveView("taskResult")
  }

  const handleOverwhelmSupport = () => {
    setActiveView("overwhelmResult")
  }

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        {/* Main Options */}
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

        {/* Tips for Success */}
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
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveView("main")}
            className="text-sora-teal hover:text-sora-teal/80"
          >
            ← Back to Clarity Tools
          </Button>
        </div>

        {/* Options Cards */}
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

        {/* Task Breakdown Form */}
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
              disabled={!taskInput.trim()}
            >
              <Wrench className="w-5 h-5 mr-2" />
              Break Down Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderOverwhelmForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveView("main")}
            className="text-sora-teal hover:text-sora-teal/80"
          >
            ← Back to Clarity Tools
          </Button>
        </div>

        {/* Options Cards */}
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

        {/* Overwhelm Support Form */}
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
              disabled={!overwhelmInput.trim()}
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTaskResult = () => {
    if (!taskResult) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setActiveView("taskForm")}
              className="text-sora-teal hover:text-sora-teal/80"
            >
              ← Back to Task Form
            </Button>
          </div>

          {/* Result Header */}
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-sora-teal" />
                <CardTitle className="text-2xl text-sora-teal">Task Breakdown: {taskResult.title}</CardTitle>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Difficulty Level:</span>
                  <Badge variant="secondary" className="bg-sora-orange text-sora-dark">
                    {taskResult.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sora-teal">
                  <Clock className="w-5 h-5" />
                  <span>Total estimated time: {taskResult.totalTime}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Steps
                </Button>
                <Button
                  variant="outline"
                  className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-6">
            {taskResult.steps.map((step, index) => (
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
                    {/* Tools/Resources */}
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

                    {/* Challenges */}
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

                    {/* Solutions */}
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

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 justify-center">
            <Button className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark">
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

  const renderOverwhelmResult = () => (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setActiveView("overwhelmForm")}
            className="text-sora-teal hover:text-sora-teal/80"
          >
            ← Back to Overwhelm Form
          </Button>
        </div>

        {/* Support Header */}
        <Card className="bg-gradient-to-br from-green-900/20 to-sora-card border-green-400/30 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-sora-teal" />
              <h1 className="text-3xl font-bold text-sora-teal">Here's Some Support for You</h1>
            </div>

            <div className="bg-green-900/30 border-l-4 border-l-green-400 p-6 rounded-r-lg">
              <p className="text-green-400 text-xl italic font-medium">
                "I am doing my best, and it's okay to take things one step at a time."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Immediate Actions */}
        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ArrowRight className="w-6 h-6 text-sora-teal" />
              <h2 className="text-2xl font-bold text-sora-teal">Do This Right Now:</h2>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">Find a quiet, comfortable space where you can be alone for a few minutes.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">Take slow, deep breaths in through your nose and out through your mouth.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Grounding Techniques */}
        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Hand className="w-6 h-6 text-sora-teal" />
              <h2 className="text-2xl font-bold text-sora-teal">Grounding Techniques:</h2>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-sora-teal rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">
                  <strong>5-4-3-2-1 method:</strong> Name 5 things you can see, 4 things you can touch, 3 things you can
                  hear, 2 things you can smell, and 1 thing you can taste.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-sora-teal rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">Press your feet into the ground and focus on the sensation of contact.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Sensory Strategies */}
        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-sora-teal" />
              <h2 className="text-2xl font-bold text-sora-teal">Sensory Strategies:</h2>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-sora-orange rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">Dim the lights or close your eyes to reduce visual input.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-sora-orange rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">
                  Put on noise-cancelling headphones or listen to white noise or calming music.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ArrowRight className="w-6 h-6 text-sora-teal" />
              <h2 className="text-2xl font-bold text-sora-teal">When You're Ready, Next Steps:</h2>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">Write down what's overwhelming you to externalize your thoughts.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-white">Prioritize one simple task you can focus on completing first.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
            <LifeBuoy className="w-4 h-4 mr-2" />
            Need More Support
          </Button>
          <Button
            variant="outline"
            className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
          >
            <Hand className="w-4 h-4 mr-2" />
            Sensory Tools
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

  // Render based on active view
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
}

export default Clarity

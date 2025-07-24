"use client"

import type React from "react"
import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  X,
  Volume2,
  Eye,
  Hand,
  Flower,
  Users,
  Activity,
  Clock,
  Sun,
  Moon,
  Heart,
  Lightbulb,
  Calendar,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SensoryCategory {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  strategies: string[]
  tools: string[]
  tips?: string[]
  phrases?: string[]
}

const sensoryCategories: SensoryCategory[] = [
  {
    id: "auditory",
    title: "Auditory (Sound)",
    icon: <Volume2 className="w-6 h-6" />,
    description: "Strategies for noise sensitivity and sound overwhelm",
    strategies: [
      "Use noise-canceling headphones or earplugs in loud environments",
      "Create a quiet space at home with soft furnishings to absorb sound",
      "Use white noise or brown noise apps to mask sudden sounds",
      "Plan visits to busy places during quieter times",
      "Communicate your needs - ask others to lower their voices when needed",
      "Take sound breaks in quiet spaces throughout the day",
      "Use calming music or nature sounds to reset your nervous system",
    ],
    tools: ["Noise-canceling headphones", "Foam earplugs", "White noise machine", "Weighted blankets"],
  },
  {
    id: "visual",
    title: "Visual (Sight)",
    icon: <Eye className="w-6 h-6" />,
    description: "Managing light sensitivity and visual overwhelm",
    strategies: [
      "Wear sunglasses indoors and outdoors when lights feel harsh",
      "Use warm, dim lighting instead of bright fluorescent lights",
      "Adjust screen brightness and use blue light filters on devices",
      "Take visual breaks by closing your eyes or looking at something calming",
      "Reduce visual clutter in your environment",
      "Use blackout curtains to control natural light",
      "Focus on one thing at a time to reduce visual overwhelm",
    ],
    tools: ["Tinted glasses", "Desk lamps with dimmers", "Blue light filters", "Eye masks"],
  },
  {
    id: "tactile",
    title: "Tactile (Touch)",
    icon: <Hand className="w-6 h-6" />,
    description: "Dealing with texture sensitivities and touch issues",
    strategies: [
      "Choose comfortable fabrics like soft cotton or bamboo",
      "Remove clothing tags or buy tagless clothing",
      "Use weighted items like blankets or lap pads for calming pressure",
      "Try fidget tools for positive tactile input",
      "Set boundaries about unexpected touch from others",
      "Use moisturizers to prevent dry, irritating skin",
      "Experiment with textures you enjoy for self-soothing",
    ],
    tools: ["Weighted blankets", "Fidget toys", "Soft fabrics", "Compression clothing"],
  },
  {
    id: "olfactory",
    title: "Olfactory (Smell)",
    icon: <Flower className="w-6 h-6" />,
    description: "Managing smell sensitivities and scent overwhelm",
    strategies: [
      "Use unscented products for cleaning and personal care",
      "Carry a small scent you enjoy to counteract unpleasant smells",
      "Breathe through your mouth temporarily when encountering strong odors",
      "Improve ventilation in your spaces",
      "Communicate preferences about scented products to family/coworkers",
      "Take fresh air breaks when feeling overwhelmed by smells",
      "Use air purifiers to reduce environmental odors",
    ],
    tools: ["Unscented products", "Essential oils (personal preference)", "Air purifiers", "Face masks"],
  },
  {
    id: "vestibular",
    title: "Vestibular (Balance)",
    icon: <Activity className="w-6 h-6" />,
    description: "Support for balance, movement, and spatial awareness",
    strategies: [
      "Use grounding techniques - feel your feet on the floor",
      "Try gentle movement like swaying or rocking",
      "Use stability aids when needed (railings, walls)",
      "Practice deep pressure activities like bear hugs or weighted items",
      "Take movement breaks throughout the day",
      "Avoid sudden position changes when feeling overwhelmed",
      "Use visual anchors to help with spatial orientation",
    ],
    tools: ["Balance cushions", "Yoga mats", "Rocking chairs", "Weighted lap pads"],
  },
  {
    id: "social",
    title: "Social Overwhelm",
    icon: <Users className="w-6 h-6" />,
    description: "Strategies for managing social sensory overload",
    strategies: [
      "Plan ahead - know the environment and have an exit strategy",
      "Take regular breaks away from the group",
      "Use a buddy system with someone who understands your needs",
      "Practice polite exit phrases for when you need to leave",
      "Bring comfort items like fidgets or noise-canceling headphones",
      "Choose your position in rooms (back to wall, near exits)",
      "Limit duration of social activities",
    ],
    tools: [],
    phrases: ['"I need a quick break"', '"I\'m feeling a bit overwhelmed"', '"I need some quiet time"'],
  },
]

const emergencyTools = [
  { id: "breathing", title: "Deep Breathing", icon: <Heart className="w-5 h-5" /> },
  { id: "grounding", title: "5-4-3-2-1 Grounding", icon: <Hand className="w-5 h-5" /> },
  { id: "noise", title: "Reduce Noise", icon: <Volume2 className="w-5 h-5" /> },
  { id: "lighting", title: "Adjust Lighting", icon: <Lightbulb className="w-5 h-5" /> },
]

const sensoryDiet = {
  morning: [
    "Gentle stretching or movement",
    "Calming music or nature sounds",
    "Preferred lighting setup",
    "Comfortable clothing choices",
  ],
  midday: [
    "Sensory breaks every 2 hours",
    "Deep pressure activities",
    "Fidget tools during tasks",
    "Quiet space for recharging",
  ],
  evening: ["Wind-down activities", "Dim lighting transition", "Calming textures or scents", "Relaxation exercises"],
}

const emergencyKits = [
  {
    title: "Portable Kit",
    items: ["Noise-canceling earbuds", "Sunglasses", "Fidget tool", "Calming scent", "Emergency contact card"],
  },
  {
    title: "Home Kit",
    items: ["Weighted blanket", "Dim lighting options", "Comfort textures", "White noise machine", "Quiet space setup"],
  },
  {
    title: "Work Kit",
    items: [
      "Desk fidgets",
      "Blue light glasses",
      "Noise-reducing headphones",
      "Comfortable seat cushion",
      "Break reminder system",
    ],
  },
]

const tips = [
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Same Time Daily",
    description: "Try to check in at the same time each day to build a helpful routine.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Be Honest",
    description: "There's no judgment here. Honest ratings help you understand your patterns.",
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: "Look for Patterns",
    description: "Over time, you'll start to see patterns that can guide your self-care.",
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Celebrate Progress",
    description: "Notice improvements, even small ones. Every step forward matters.",
  },
]

export default function Sensory() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [groundingStep, setGroundingStep] = useState(1)
  const [breathingActive, setBreathingActive] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleEmergencyTool = (toolId: string) => {
    if (toolId === "grounding") {
      setGroundingStep(1)
      setActiveModal("grounding")
    } else if (toolId === "breathing") {
      setBreathingActive(true)
      setActiveModal("breathing")
    } else if (toolId === "noise") {
      setActiveModal("noiseTips")
    } else if (toolId === "lighting") {
      setActiveModal("lightingTips")
    }
  }

  const nextGroundingStep = () => {
    if (groundingStep < 5) {
      setGroundingStep((prev) => prev + 1)
    } else {
      setActiveModal(null)
      setGroundingStep(1)
    }
  }

  const groundingSteps = [
    "Name 5 things you can see around you",
    "Name 4 things you can touch",
    "Name 3 things you can hear",
    "Name 2 things you can smell",
    "Name 1 thing you can taste",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Hand className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Sensory Support Tools
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-4xl mx-auto">
            Find strategies to manage sensory sensitivities, reduce overwhelm, and create calming environments that work
            for your unique needs.
          </p>
        </div>

        {/* Emergency Relief Section */}
        <Card className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Heart className="w-6 h-6" />
              Need Immediate Relief?
            </CardTitle>
            <CardDescription className="text-slate-300">
              If you're experiencing sensory overload right now, try these quick techniques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyTools.map((tool) => (
                <Button
                  key={tool.id}
                  onClick={() => handleEmergencyTool(tool.id)}
                  className="h-16 bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2"
                >
                  {tool.icon}
                  {tool.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sensory Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensoryCategories.map((category) => (
            <Card
              key={category.id}
              className={`bg-slate-800/50 border-slate-700 transition-all duration-300 ${expandedCategories.includes(category.id) ? "ring-2 ring-cyan-400" : ""
                }`}
            >
              <CardHeader className="cursor-pointer" onClick={() => toggleCategory(category.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">{category.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="text-slate-400">{category.description}</CardDescription>
                    </div>
                  </div>
                  {expandedCategories.includes(category.id) ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </CardHeader>

              {expandedCategories.includes(category.id) && (
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-cyan-400 font-medium mb-3">
                      When {category.title.split(" ")[0]} Feel
                      {category.id === "auditory"
                        ? "s"
                        : category.id === "visual"
                          ? "s Too Bright or"
                          : category.id === "tactile"
                            ? " Uncomfortable:"
                            : category.id === "olfactory"
                              ? "s Too Strong or"
                              : category.id === "vestibular"
                                ? " Off:"
                                : " Overwhelming:"}
                      {category.id === "auditory" && " Overwhelming:"}
                      {category.id === "visual" && " Overwhelming:"}
                      {category.id === "olfactory" && " Overwhelming:"}
                      {category.id === "social" && ":"}
                    </h4>
                    <ul className="space-y-2">
                      {category.strategies.map((strategy, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span className="text-sm">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {category.tools.length > 0 && (
                    <div>
                      <h4 className="text-cyan-400 font-medium mb-3">Helpful Tools:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.tools.map((tool, index) => (
                          <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {category.phrases && (
                    <div>
                      <h4 className="text-cyan-400 font-medium mb-3">Helpful Phrases:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.phrases.map((phrase, index) => (
                          <span key={index} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Sensory Diet Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Calendar className="w-6 h-6" />
              Creating Your Sensory Diet
            </CardTitle>
            <CardDescription className="text-slate-300">
              A sensory diet is a planned set of activities that help regulate your sensory system throughout the day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-medium text-cyan-400">Morning</h3>
                </div>
                <ul className="space-y-2">
                  {sensoryDiet.morning.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-medium text-cyan-400">Midday</h3>
                </div>
                <ul className="space-y-2">
                  {sensoryDiet.midday.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-medium text-cyan-400">Evening</h3>
                </div>
                <ul className="space-y-2">
                  {sensoryDiet.evening.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Kit Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Package className="w-6 h-6" />
              Build Your Sensory Emergency Kit
            </CardTitle>
            <CardDescription className="text-slate-300">
              Keep these items accessible for sensory emergencies at home, work, or on the go.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyKits.map((kit, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-medium text-cyan-400">{kit.title}</h3>
                  <ul className="space-y-2">
                    {kit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-slate-300">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Lightbulb className="w-6 h-6" />
              Making the Most of Your Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tips.map((tip, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="text-cyan-400 flex justify-center">{tip.icon}</div>
                  <h3 className="font-medium">{tip.title}</h3>
                  <p className="text-sm text-slate-400">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Dialog open={activeModal === "grounding"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-slate-800 border-cyan-400 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">5-4-3-2-1 Grounding Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">Step {groundingStep} of 5</div>
              <p className="text-lg">{groundingSteps[groundingStep - 1]}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={nextGroundingStep} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                {groundingStep < 5 ? "Next" : "Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "breathing"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-slate-800 border-cyan-400 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Breathing Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-center">
            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-full border-4 border-cyan-400 flex items-center justify-center">
                <span className="text-2xl font-medium text-cyan-400">Breathe In</span>
              </div>
            </div>
            <p className="text-slate-300">Follow the circle with your breath</p>
            <Button
              variant="outline"
              onClick={() => setActiveModal(null)}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "noiseTips"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-slate-800 border-cyan-400 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Noise Cancellation Tips</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Quick Noise Relief:</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Use noise-cancelling headphones or earplugs</li>
                <li>• Try white noise or calming nature sounds</li>
                <li>• Move to a quieter space if possible</li>
                <li>• Practice deep breathing to reduce stress response</li>
                <li>• Use weighted items for grounding pressure</li>
              </ul>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-sm">
                <strong className="text-cyan-400">Emergency tip:</strong> Cover your ears and take slow, deep breaths
                until you can find a quieter space.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "lightingTips"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-slate-800 border-cyan-400 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Lighting Adjustment Tips</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Light Sensitivity Relief:</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Dim bright lights or use lamp lighting instead</li>
                <li>• Wear sunglasses indoors if needed</li>
                <li>• Use blue light filters on screens</li>
                <li>• Take breaks in darker spaces</li>
                <li>• Try colored lenses that feel soothing</li>
              </ul>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-sm">
                <strong className="text-cyan-400">Quick relief:</strong> Close your eyes and face away from bright
                lights while breathing slowly.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
}

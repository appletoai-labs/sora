"use client"

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Eye,
  Clock,
  MessageSquare,
  Lightbulb,
  Calendar,
  Hand,
  List,
  Users,
  BarChart3,
  Shield,
  Heart,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react"
import { SupportCard } from "./shared/supportcard";
import SoraLogo from "../SoraLogo";

const neurodivergentFeatures = [
  {
    icon: Brain,
    title: "ADHD & Autism Aware",
    description: "Communication styles and tools designed for neurodivergent thinking patterns",
  },
  {
    icon: Eye,
    title: "Sensory Friendly",
    description: "Dark theme, minimal visual clutter, and options for high contrast display",
  },
  {
    icon: Clock,
    title: "Executive Function Support",
    description: "Task breakdown, routine building, and step-by-step guidance",
  },
  {
    icon: MessageSquare,
    title: "Clear Communication",
    description: "Direct, structured responses without overwhelming information",
  },
]

const toolsData = [
  {
    icon: Lightbulb,
    title: "Clarity Tools",
    description:
      "Break down overwhelming tasks into manageable steps. Get AI-powered guidance for complex situations and executive function challenges.",
    action: "Explore Tools",
    href: "/app/clarity",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: Calendar,
    title: "Daily Check-ins",
    description:
      "Track your mood, energy, and challenges. Build awareness of your patterns and celebrate your progress over time.",
    action: "Check In Today",
    href: "/app/checkin",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Hand,
    title: "Sensory Support",
    description:
      "Find strategies for sensory regulation, reduce overstimulation, and create calming environments that work for you.",
    action: "Find Strategies",
    href: "/app/sensory",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: List,
    title: "Executive Function",
    description:
      "Build routines, organize tasks, and develop systems that support your executive function needs and working style.",
    action: "Build Routines",
    href: "/app/executive",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Connect with others who understand your journey. Share experiences, get support, and find your tribe in safe, welcoming spaces.",
    action: "Join Community",
    href: "/app/community",
    gradient: "from-indigo-500/20 to-blue-500/20",
  },
  {
    icon: BarChart3,
    title: "Progress Insights",
    description:
      "See your patterns, celebrate achievements, and understand your journey with personalized insights and gentle analytics.",
    action: "View Dashboard",
    href: "/app/dashboard",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Safe Space",
    description:
      "SORA is designed to be judgment-free, patient, and understanding. Your privacy and comfort are our highest priorities.",
    features: ["No judgment", "Patient responses", "Privacy focused", "Always available"],
    gradient: "from-emerald-500/20 to-green-500/20",
  },
]

const gettingStartedSteps = [
  {
    number: 1,
    title: "Start a conversation",
    description: "Share what's on your mind with SORA",
  },
  {
    number: 2,
    title: "Try the clarity tools",
    description: "Break down tasks or get support for overwhelm",
  },
  {
    number: 3,
    title: "Daily check-in",
    description: "Track how you're feeling and build awareness",
  },
]

export const DashboardHome = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "individual":
        return "Individual"
      case "therapy_client":
        return "Therapy Client"
      case "therapist":
        return "Therapist"
      default:
        return "User"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-background to-sora-card">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center">
            <SoraLogo />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome , {user?.firstName}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your AI-powered companion designed specifically for neurodivergent minds. Get personalized support, clarity
            tools, and gentle guidance whenever you need it.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-float transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-sora-teal" />
                <CardTitle className="text-xl">Talk to SORA</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Have a conversation with our AI companion. Share what's on your mind, ask for help, or just need someone
                to listen.
              </p>
              <Link to="/app/chat">
                <Button className="bg-gradient-to-r from-sora-teal to-sora-teal/80 hover:from-sora-teal/90 hover:to-sora-teal/70 text-sora-dark font-medium w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chatting
                </Button>
              </Link>

            </CardContent>
          </Card>

          <Card className="bg-gradient-emergency border-destructive/20 shadow-card hover:shadow-float transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-400" />
                <CardTitle className="text-xl text-red-100">Need Immediate Support?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-100/80 mb-4">
                Feeling overwhelmed, anxious, or experiencing sensory overload? Access immediate calming tools and
                support.
              </p>
              <Link to="/app/immediate-support">
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white font-medium">
                  <Zap className="h-4 w-4 mr-2" />
                  Get Help Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
            YOUR RECENT ACTIVITY
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-sora-teal">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Week:</span>
                  <Badge variant="secondary" className="bg-sora-teal/20 text-sora-teal">
                    Ready for check-in
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tools Used:</span>
                  <Badge variant="secondary" className="bg-sora-orange/20 text-sora-orange">
                    Start exploring
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-sora-teal/30 text-sora-teal hover:bg-sora-teal/10 bg-transparent"
                  onClick={() => navigate("/app/dashboard")}
                >
                  View Full Dashboard
                </Button>

              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-sora-teal">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gettingStartedSteps.map((step) => (
                    <div key={step.number} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-sora-teal rounded-full flex items-center justify-center text-sora-dark text-sm font-bold flex-shrink-0">
                        {step.number}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Neurodivergent Features */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-sora-teal" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
                Designed for Neurodivergent Minds
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Every feature in SORA is created with neurodivergent experiences in mind. We understand executive function
              challenges, sensory sensitivities, and the need for clear, patient communication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {neurodivergentFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.title}
                  className="bg-gradient-card border-border/50 shadow-card hover:shadow-float transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-sora-teal/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-sora-teal" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
            TOOLS DESIGNED FOR YOU
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsData.map((tool) => {
              const Icon = tool.icon
              return (
                <Card
                  key={tool.title}
                  className={`bg-gradient-card border-border/50 shadow-card hover:shadow-float transition-all duration-300 group`}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-sora-teal">{tool.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{tool.description}</p>

                    {tool.features ? (
                      <div className="space-y-2">
                        {tool.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Link to={tool.href}>

                        <Button
                          variant="outline"
                          className="w-full border-sora-teal/30 text-sora-teal hover:bg-sora-teal/10 group-hover:border-sora-teal/50 transition-colors bg-transparent"
                        >
                          {tool.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

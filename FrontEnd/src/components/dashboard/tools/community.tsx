"use client"
import type React from "react"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import {
  Heart,
  Star,
  Users,
  Shield,
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  User,
  Clock,
  Plus,
  Edit3,
  Send,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Post {
  _id: string
  userId: string
  username: string
  title: string
  content: string
  category: "support" | "celebrations" | "advice" | "resources"
  isAnonymous: boolean
  createdAt: string
  reactions: {
    heart: number
    helpful: number
    solidarity: number
  }
  userReactions: {
    heart: boolean
    helpful: boolean
    solidarity: boolean
  }
  responses: Response[]
}

interface Response {
  _id: string
  userId: string
  username: string
  content: string
  isAnonymous: boolean
  createdAt: string
}

const Community: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeView, setActiveView] = useState<"main" | "create" | "post" | "spaces">("main")
  const [selectedSafeSpace, setSelectedSafeSpace] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Create Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    isAnonymous: false,
    safeSpace: null as string | null,
  })

  // Response Form State
  const [newResponse, setNewResponse] = useState({
    content: "",
    isAnonymous: false,
  })

  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`

  const categories = [
    {
      id: "support",
      title: "Need Support",
      description: "Share struggles and get gentle support from the community",
      icon: "💝",
      color: "from-red-500/20 to-red-600/30 border-red-500/40",
      hoverColor: "hover:from-red-500/30 hover:to-red-600/40",
    },
    {
      id: "celebrations",
      title: "Wins & Celebrations",
      description: "Share your victories, big and small",
      icon: "⭐",
      color: "from-yellow-500/20 to-yellow-600/30 border-yellow-500/40",
      hoverColor: "hover:from-yellow-500/30 hover:to-yellow-600/40",
    },
    {
      id: "advice",
      title: "Questions & Advice",
      description: "Ask questions and share helpful insights",
      icon: "❓",
      color: "from-blue-500/20 to-blue-600/30 border-blue-500/40",
      hoverColor: "hover:from-blue-500/30 hover:to-blue-600/40",
    },
    {
      id: "resources",
      title: "Resources & Tips",
      description: "Share tools, tips, and resources that help",
      icon: "💡",
      color: "from-green-500/20 to-green-600/30 border-green-500/40",
      hoverColor: "hover:from-green-500/30 hover:to-green-600/40",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "support":
        return "bg-red-600"
      case "celebrations":
        return "bg-yellow-600"
      case "advice":
        return "bg-blue-600"
      case "resources":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "support":
        return "Support"
      case "celebrations":
        return "Celebrations"
      case "advice":
        return "Advice"
      case "resources":
        return "Resources"
      default:
        return ""
    }
  }

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${API_BASE}/community/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const safeSpaces = [
    {
      id: "adhd-support",
      name: "ADHD Support Circle",
      tag: "ADHD Support",
      description:
        "A supportive community for those with ADHD to share experiences, strategies, and celebrate unique ways of thinking and being.",
      icon: "🧠",
      borderColor: "border-red-500/30",
      focusAreas: [
        "Executive function strategies",
        "Hyperfocus and attention challenges",
        "Emotional regulation",
        "Celebrating neurodivergent strengths",
      ],
    },
    {
      id: "autistic-community",
      name: "Autistic Community",
      tag: "Autism Support",
      description:
        "A space for autistic individuals to connect, share experiences, and support each other in navigating a neurotypical world.",
      icon: "🧩",
      borderColor: "border-blue-500/30",
      focusAreas: [
        "Sensory processing experiences",
        "Social communication",
        "Stimming and self-regulation",
        "Identity and self-advocacy",
      ],
    },
    {
      id: "sensory-support",
      name: "Sensory Support Hub",
      tag: "Sensory Support",
      description:
        "Share strategies, tools, and support for managing sensory processing challenges and sensory overload.",
      icon: "👁️",
      borderColor: "border-green-500/30",
      focusAreas: [
        "Sensory overload management",
        "Environmental modifications",
        "Sensory tools and aids",
        "Calming techniques",
      ],
    },
    {
      id: "anxiety-overwhelm",
      name: "Anxiety & Overwhelm Support",
      tag: "Mental Health Support",
      description:
        "A gentle space for sharing experiences with anxiety, overwhelm, and mental health challenges common in neurodivergent individuals.",
      icon: "☁️",
      borderColor: "border-teal-500/30",
      focusAreas: [
        "Anxiety management strategies",
        "Overwhelm prevention",
        "Emotional regulation",
        "Self-care practices",
      ],
    },
    {
      id: "executive-function",
      name: "Executive Function Support",
      tag: "Executive Function",
      description:
        "Share strategies, tools, and encouragement for managing executive function challenges like planning, organization, and task management.",
      icon: "📋",
      borderColor: "border-yellow-500/30",
      focusAreas: [
        "Planning and organization",
        "Task initiation and completion",
        "Time management",
        "Working memory strategies",
      ],
    },
    {
      id: "social-connection",
      name: "Social Connection Circle",
      tag: "Social Support",
      description:
        "A welcoming space for building friendships, sharing social experiences, and navigating relationships as a neurodivergent person.",
      icon: "👥",
      borderColor: "border-purple-500/30",
      focusAreas: [
        "Building friendships",
        "Social communication",
        "Relationship challenges",
        "Social skills and confidence",
      ],
    },
  ]

  const createPost = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${API_BASE}/community/createpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      if (response.ok) {
        setPosts([...posts, data.post])
        setActiveView("main")
        toast({
          title: "Success",
          description: "Your post has been shared with the community",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    }
  }

  const addReaction = async (postId: string, reactionType: "heart" | "helpful" | "solidarity") => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${API_BASE}/community/posts/${postId}/reactions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reactionType }),
      })
      const data = await response.json()
      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, reactions: data.reactions, userReactions: data.userReactions } : post,
          ),
        )
        toast({
          title: "Success",
          description: "Your reaction has been added",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add reaction",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding reaction:", error)
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive",
      })
    }
  }

  const addResponse = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${API_BASE}/community/posts/${selectedPost?._id}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newResponse),
      })
      const data = await response.json()
      if (response.ok) {
        setSelectedPost({ ...selectedPost, responses: [...selectedPost.responses, data.response] })
        setNewResponse({ content: "", isAnonymous: false })
        toast({
          title: "Success",
          description: "Your response has been shared",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add response",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding response:", error)
      toast({
        title: "Error",
        description: "Failed to add response",
        variant: "destructive",
      })
    }
  }

  const renderSpacesView = () => (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sora-teal">
          <Users className="w-5 h-5" />
          <span>Community</span>
          <span>→</span>
          <span>Safe Spaces</span>
        </div>

        {/* What Are Safe Spaces */}
        <Card className="bg-gradient-to-br from-sora-teal/10 to-sora-teal/5 border-sora-teal/30 mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-sora-teal" />
              <h2 className="text-3xl font-bold text-sora-teal">What Are Safe Spaces?</h2>
            </div>
            <p className="text-gray-300 text-lg mb-6">
              Safe Spaces are specialized communities within SORA ALLY designed for specific neurodivergent experiences. Each
              space has:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-sora-teal flex items-center justify-center">
                  <span className="text-sora-dark text-sm">✓</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Focused discussions</span>
                  <span className="text-gray-400"> around specific topics and challenges</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-sora-teal flex items-center justify-center">
                  <span className="text-sora-dark text-sm">✓</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Community guidelines</span>
                  <span className="text-gray-400"> tailored to each group's needs</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-sora-teal flex items-center justify-center">
                  <span className="text-sora-dark text-sm">✓</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Peer support</span>
                  <span className="text-gray-400"> from others with similar experiences</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-sora-teal flex items-center justify-center">
                  <span className="text-sora-dark text-sm">✓</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Resource sharing</span>
                  <span className="text-gray-400"> relevant to specific communities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Safe Spaces */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">AVAILABLE SAFE SPACES</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeSpaces.map((space) => (
              <Card
                key={space.id}
                className={`bg-gradient-to-br from-sora-card to-sora-muted ${space.borderColor} border-2`}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-sora-teal rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{space.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{space.name}</h3>
                    <Badge className="bg-sora-teal text-sora-dark mb-4">{space.tag}</Badge>
                  </div>

                  <p className="text-gray-300 text-sm mb-6 text-center">{space.description}</p>

                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Focus Areas:</h4>
                    <div className="space-y-2">
                      {space.focusAreas.map((area, index) => (
                        <p key={index} className="text-gray-400 text-sm flex items-start gap-2">
                          <span className="text-sora-teal">→</span>
                          {area}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Community Space</span>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedSafeSpace(space.id)
                        setNewPost({ ...newPost, safeSpace: space.id })
                        setActiveView("create")
                      }}
                      className="w-full bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Sharing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Safe Space Guidelines */}
        <Card className="bg-gradient-to-br from-sora-teal/10 to-sora-teal/5 border-sora-teal/30 mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-sora-teal mb-8">Safe Space Guidelines</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Heart className="w-12 h-12 text-sora-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Compassion First</h3>
                <p className="text-gray-300 text-sm">Approach every interaction with kindness and understanding</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-sora-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Respect Privacy</h3>
                <p className="text-gray-300 text-sm">What's shared in safe spaces stays within the community</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-sora-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Support Over Advice</h3>
                <p className="text-gray-300 text-sm">Listen and offer support rather than unsolicited solutions</p>
              </div>
              <div className="text-center md:col-span-2 lg:col-span-1">
                <Star className="w-12 h-12 text-sora-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Honor Differences</h3>
                <p className="text-gray-300 text-sm">Every neurodivergent experience is unique and valid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ready to Connect */}
        <Card className="bg-gradient-to-r from-sora-teal to-sora-orange">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-sora-dark mb-4">Ready to Connect?</h2>
            <p className="text-sora-dark/80 text-lg mb-6">
              Join our supportive community and find others who understand your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setActiveView("main")}
                variant="outline"
                className="border-sora-dark text-sora-dark hover:bg-sora-dark hover:text-white bg-transparent w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
              <Button
                onClick={() => setActiveView("create")}
                className="bg-sora-dark hover:bg-sora-dark/80 text-white w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-8 h-8 text-sora-teal" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              Community Support
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Connect with others who understand your journey. Share experiences, get support, and celebrate together in a
            safe, neurodivergent-friendly space.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Plus className="w-8 h-8 text-sora-teal" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Share Your Story</h3>
                  <p className="text-gray-300">
                    Create a post to share what's on your mind, ask for support, or celebrate your wins.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setActiveView("create")}
                className="w-full bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Create Post
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-8 h-8 text-sora-teal" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Safe Spaces</h3>
                  <p className="text-gray-300">
                    Join topic-specific safe spaces designed for different aspects of neurodivergent experiences.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setActiveView("spaces")}
                variant="outline"
                className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse Spaces
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Share & Connect Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">SHARE & CONNECT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`bg-gradient-to-br ${category.color} ${category.hoverColor} border cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg`}
              >
                <CardContent
                  className="p-4 md:p-6"
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setNewPost({ ...newPost, category: category.id })
                    setActiveView("create")
                  }}
                >
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl mb-3 md:mb-4 flex justify-center">{category.icon}</div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{category.title}</h3>
                    <p className="text-gray-300 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="text-sora-teal hover:text-white hover:bg-sora-teal/20 font-semibold text-sm md:text-base transition-colors duration-200"
                    >
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Community Posts */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">RECENT COMMUNITY POSTS</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sora-teal mx-auto mb-4"></div>
              <p className="text-gray-300">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Welcome to the Community!</h3>
              <p className="text-gray-400 mb-8 px-4">Be the first to share your story and connect with others.</p>
              <Button
                onClick={() => setActiveView("create")}
                className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold"
              >
                Create First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {posts.slice(0, 5).map((post) => (
                <Card
                  key={post._id}
                  className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 cursor-pointer hover:border-sora-teal/40 transition-colors"
                >
                  <CardContent
                    className="p-4 md:p-6"
                    onClick={() => {
                      setSelectedPost(post)
                      setActiveView("post")
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                        <Badge className={`${getCategoryColor(post.category)} text-white w-fit`}>
                          {getCategoryName(post.category).toUpperCase()}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          {post.isAnonymous ? "Anonymous Community Member" : post.username}
                        </span>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                      {post.content}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <Button variant="ghost" className="text-purple-400 hover:text-purple-300 font-semibold w-fit">
                        Read & Support
                      </Button>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.responses.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.reactions.heart + post.reactions.helpful + post.reactions.solidarity}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        {/* Community Values */}
        <Card className="bg-gradient-to-br from-sora-teal/10 to-sora-teal/5 border-sora-teal/30 mt-16">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-sora-teal" />
              <h2 className="text-2xl md:text-3xl font-bold text-sora-teal">Our Community Values</h2>
            </div>
            <div className="space-y-4 md:space-y-6 text-gray-300">
              <div>
                <span className="font-bold text-white">Kindness first:</span> We approach each other with compassion and
                understanding
              </div>
              <div>
                <span className="font-bold text-white">Respect differences:</span> Everyone's neurodivergent experience
                is unique and valid
              </div>
              <div>
                <span className="font-bold text-white">Safe sharing:</span> This is a judgment-free zone for authentic
                expression
              </div>
              <div>
                <span className="font-bold text-white">Support over advice:</span> Listen first, offer gentle support
                when asked
              </div>
              <div>
                <span className="font-bold text-white">Privacy matters:</span> What's shared here stays here
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderCreateView = () => (
    <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 px-4">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <Edit3 className="w-6 h-6 md:w-8 md:h-8 text-sora-teal" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              Share Your Story
            </h1>
          </div>
          <p className="text-gray-300 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            Create a post to connect with the community. Your voice matters, and your experiences can help others feel
            less alone.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
          <CardContent className="p-4 md:p-8">
            <div className="space-y-4 md:space-y-6">
              <Button
                variant="ghost"
                onClick={() => setActiveView("main")}
                className="text-sora-teal hover:text-sora-teal/80 mb-4 md:mb-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Community
              </Button>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-sora-teal mb-4 md:mb-6">Create Your Post</h3>
                <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                  Share what's on your mind in a safe, supportive environment.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sora-teal font-medium mb-3 text-sm md:text-base">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  What type of post is this?
                </label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger className="bg-sora-muted border-sora-teal/30 text-white">
                    <SelectValue placeholder="Select post category" />
                  </SelectTrigger>
                  <SelectContent className="bg-sora-card border-sora-teal/20">
                    <SelectItem value="support">💝 Need Support - Share struggles and get gentle support</SelectItem>
                    <SelectItem value="celebrations">
                      ⭐ Wins & Celebrations - Share your victories, big and small
                    </SelectItem>
                    <SelectItem value="advice">❓ Questions & Advice - Ask questions and share insights</SelectItem>
                    <SelectItem value="resources">💡 Resources & Tips - Share helpful tools and tips</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedSafeSpace && (
                <div>
                  <label className="flex items-center gap-2 text-sora-teal font-medium mb-3 text-sm md:text-base">
                    <Users className="w-4 h-4 md:w-5 md:h-5" />
                    Selected Safe Space
                  </label>
                  <div className="bg-sora-muted/50 border border-sora-teal/30 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl md:text-2xl">
                        {safeSpaces.find((s) => s.id === selectedSafeSpace)?.icon}
                      </span>
                      <div>
                        <p className="text-white font-medium text-sm md:text-base">
                          {safeSpaces.find((s) => s.id === selectedSafeSpace)?.name}
                        </p>
                        <p className="text-gray-400 text-xs md:text-sm">Posting to this safe space</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedSafeSpace(null)
                        setNewPost({ ...newPost, safeSpace: null })
                      }}
                      className="text-gray-400 hover:text-white w-fit"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sora-teal font-medium mb-3 text-sm md:text-base">
                  <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                  Post Title
                </label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Enter a descriptive title..."
                  className="bg-sora-muted border-sora-teal/30 text-white"
                />
                <p className="text-gray-400 text-xs md:text-sm mt-2">
                  A good title helps others understand what you're sharing.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sora-teal font-medium mb-3 text-sm md:text-base">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Your Message
                </label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share as much or as little as feels comfortable. Your story matters."
                  className="bg-sora-muted border-sora-teal/30 text-white min-h-[120px] md:min-h-[150px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={newPost.isAnonymous}
                  onCheckedChange={(checked) => setNewPost({ ...newPost, isAnonymous: checked as boolean })}
                />
                <label htmlFor="anonymous" className="text-white font-medium cursor-pointer text-sm md:text-base">
                  Post anonymously
                </label>
              </div>
              {newPost.isAnonymous && (
                <p className="text-gray-400 text-xs md:text-sm">
                  Your post will show as "Anonymous Community Member" instead of your username.
                </p>
              )}

              {/* Community Guidelines */}
              <Card className="bg-gradient-to-br from-sora-teal/10 to-sora-teal/5 border-sora-teal/30">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-sora-teal" />
                    <h4 className="text-sora-teal font-bold text-sm md:text-base">Community Guidelines</h4>
                  </div>
                  <div className="space-y-2 text-gray-300 text-xs md:text-sm">
                    <p className="flex items-start gap-2">
                      <span className="text-sora-teal">→</span>
                      Be kind and respectful to yourself and others
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-sora-teal">→</span>
                      Share authentically - vulnerability creates connection
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-sora-teal">→</span>
                      Remember that everyone's experience is different and valid
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-sora-teal">→</span>
                      Focus on support rather than giving unsolicited advice
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button
                  onClick={createPost}
                  className="flex-1 bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Share with Community
                </Button>
                <Button
                  onClick={() => setActiveView("main")}
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-transparent sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Support */}
          <Card className="mt-8 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-orange-400" />
          <h4 className="text-orange-400 font-bold">Need Immediate Support?</h4>
        </div>
        <p className="text-gray-300 mb-4">
          If you're feeling overwhelmed or need immediate help, remember that support is available:
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate("/app/immediate-support")}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent w-full sm:w-auto"
          >
            <Heart className="w-4 h-4 mr-2" />
            Emergency Support Tools
          </Button>
          <Button
            onClick={() => navigate("/app/chat")}
            variant="outline"
            className="border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Talk to SORA AI
          </Button>
        </div>
      </CardContent>
    </Card>

      </div>
    </div>
  )

  const renderPostView = () => {
    if (!selectedPost) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 md:mb-8 text-sora-teal text-sm md:text-base px-4 md:px-0">
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            <span>Community</span>
            <span>→</span>
            <span className="truncate max-w-[200px] md:max-w-none">{selectedPost.title}</span>
          </div>

          {/* Post Content */}
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-6 md:mb-8">
            <CardContent className="p-4 md:p-8">
              <Button
                variant="ghost"
                onClick={() => setActiveView("main")}
                className="text-sora-teal hover:text-sora-teal/80 mb-4 md:mb-6"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Back to Community
              </Button>

              <Badge className={`${getCategoryColor(selectedPost.category)} text-white mb-4 text-xs md:text-sm`}>
                {getCategoryName(selectedPost.category)}
              </Badge>

              <h1 className="text-xl md:text-3xl font-bold text-white mb-4 leading-tight">{selectedPost.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{selectedPost.isAnonymous ? "Anonymous Community Member" : selectedPost.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                    <span className="hidden sm:inline">
                      {" "}
                      at {new Date(selectedPost.createdAt).toLocaleTimeString()}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-gray-300 mb-6 md:mb-8 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                {selectedPost.content}
              </div>

              {/* Send Support Reactions */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-white font-bold mb-4 text-sm md:text-base">Send Support</h3>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button
                    variant="outline"
                    onClick={() => addReaction(selectedPost._id, "heart")}
                    className={`border-red-500 ${selectedPost.userReactions.heart ? "bg-red-500 text-white" : "text-red-400 hover:bg-red-500 hover:text-white"} bg-transparent flex-1 sm:flex-none`}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Heart</span>
                    <span className="sm:hidden">❤️</span>
                    <Badge className="ml-2 bg-sora-teal text-sora-dark text-xs">{selectedPost.reactions.heart}</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addReaction(selectedPost._id, "helpful")}
                    className={`border-blue-500 ${selectedPost.userReactions.helpful ? "bg-blue-500 text-white" : "text-blue-400 hover:bg-blue-500 hover:text-white"} bg-transparent flex-1 sm:flex-none`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Helpful</span>
                    <span className="sm:hidden">👍</span>
                    <Badge className="ml-2 bg-sora-teal text-sora-dark text-xs">{selectedPost.reactions.helpful}</Badge>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addReaction(selectedPost._id, "solidarity")}
                    className={`border-purple-500 ${selectedPost.userReactions.solidarity ? "bg-purple-500 text-white" : "text-purple-400 hover:bg-purple-500 hover:text-white"} bg-transparent flex-1 sm:flex-none`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Solidarity</span>
                    <span className="sm:hidden">🤝</span>
                    <Badge className="ml-2 bg-sora-teal text-sora-dark text-xs">
                      {selectedPost.reactions.solidarity}
                    </Badge>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Responses */}
          <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
            <CardContent className="p-4 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <h3 className="text-lg md:text-xl font-bold text-gray-400">
                  COMMUNITY RESPONSES ({selectedPost.responses.length})
                </h3>
              </div>

              {/* Add Response Form */}
              <div className="mb-6 md:mb-8">
                <h4 className="text-white font-bold mb-4 text-sm md:text-base">Share your thoughts or support</h4>
                <Textarea
                  value={newResponse.content}
                  onChange={(e) => setNewResponse({ ...newResponse, content: e.target.value })}
                  placeholder="Offer kind words, share your experience, or ask a gentle question..."
                  className="bg-sora-muted border-sora-teal/30 text-white min-h-[80px] md:min-h-[100px] mb-4 text-sm md:text-base"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="responseAnonymous"
                      checked={newResponse.isAnonymous}
                      onCheckedChange={(checked) => setNewResponse({ ...newResponse, isAnonymous: checked as boolean })}
                    />
                    <label
                      htmlFor="responseAnonymous"
                      className="text-white font-medium cursor-pointer text-sm md:text-base"
                    >
                      Comment anonymously
                    </label>
                  </div>
                  <Button
                    onClick={addResponse}
                    className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Share Response
                  </Button>
                </div>
              </div>

              {/* Responses List */}
              {selectedPost.responses.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Be the First to Respond</h3>
                  <p className="text-gray-400 text-sm md:text-base px-4">
                    Share your thoughts, offer support, or connect with this community member.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {selectedPost.responses.map((response) => (
                    <div key={response._id} className="bg-sora-muted/50 rounded-lg p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{response.isAnonymous ? "Anonymous Community Member" : response.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(response.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                        {response.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading && activeView === "main") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sora-teal mx-auto mb-4"></div>
          <p className="text-gray-300">Loading community...</p>
        </div>
      </div>
    )
  }

  // Render based on active view
  switch (activeView) {
    case "create":
      return renderCreateView()
    case "post":
      return renderPostView()
    case "spaces":
      return renderSpacesView()
    default:
      return renderMainView()
  }
}

export default Community

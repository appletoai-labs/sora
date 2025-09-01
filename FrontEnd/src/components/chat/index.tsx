"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chatMessage"
import { EnhancedChatInput } from "./enhancedChatInput"
import { TypingIndicator } from "./typingIndicator"
import { SuggestionChips } from "./suggestionChips"
import { ChatActions } from "./chatActions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react" // Import Loader2 for spinners
import { useToast } from "@/hooks/use-toast"
import SupportCards from "../../components/supportCards"
import { useMediaQuery } from "@/hooks/useMediaQuery";
import axios from "axios"
import SoraLogo from "../SoraLogo"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const suggestions = [
  { id: "1", text: "I'm feeling overwhelmed", icon: "😔" },
  { id: "2", text: "Help break down a task", icon: "📝" },
  { id: "3", text: "Sensory difficulties", icon: "🎧" },
  { id: "4", text: "Organize my thoughts", icon: "🧠" },
  { id: "5", text: "Focus strategies", icon: "🎯" },
  { id: "6", text: "Energy management", icon: "⚡" },
]

export const ChatInterface = () => {
  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant specializing in neurodiversity support. I'm here to help you navigate challenges, understand your unique strengths, and provide personalized strategies for daily life. How can I support you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(() => {
    return localStorage.getItem("previousResponseId")
  })

  const [isTyping, setIsTyping] = useState(false) // Kept for chat response indicator
  const [isListening, setIsListening] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [recentSessions, setRecentSessions] = useState([])
  const [isViewingPastSession, setIsViewingPastSession] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [showSummaryModal, setShowSummaryModal] = useState(false)

  // Consolidated global loading state
  const [isGlobalLoading, setIsGlobalLoading] = useState(false)
  const loadingOperations = useRef(0) // To track multiple concurrent loading operations

  const startGlobalLoading = () => {
    loadingOperations.current += 1
    setIsGlobalLoading(true)
  }

  const endGlobalLoading = () => {
    loadingOperations.current -= 1
    if (loadingOperations.current <= 0) {
      setIsGlobalLoading(false)
      loadingOperations.current = 0 // Reset to 0
    }
  }

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  const fetchSessions = async () => {
    startGlobalLoading()
    const token = localStorage.getItem("authToken")
    try {
      const res = await axios.get(`${API_BASE}/chatproxy/sessions/recent `, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRecentSessions(res.data.sessions)
    } catch (err) {
      console.error("Failed to load recent sessions", err)
      toast({
        title: "Error",
        description: "Failed to load recent chat sessions.",
        variant: "destructive",
      })
    } finally {
      endGlobalLoading()
    }
  }

  const loadSessionAndMessages = async (sessionIdFromFetch?: string) => {
    startGlobalLoading()
    const token = localStorage.getItem("authToken")
    const sessionId = sessionIdFromFetch || localStorage.getItem("sessionId")

    if (!token) {
      endGlobalLoading()
      return
    }
    if (!sessionId) {
      console.warn("No session ID found in localStorage")
      endGlobalLoading()
      return
    }

    try {
      setCurrentSessionId(sessionId)
      const msgRes = await axios.get(`${API_BASE}/chatproxy/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const messagesFromDB: Message[] = msgRes.data.messages.map((msg: any, index: number) => ({
        id: `${index}-${msg.role}`,
        text: msg.content,
        isUser: msg.role === "user",
        timestamp: new Date(),
      }))

      setMessages(messagesFromDB)
    } catch (err) {
      console.error("Failed to load session or messages", err)
      toast({
        title: "Error",
        description: "Failed to load chat session messages.",
        variant: "destructive",
      })
    } finally {
      endGlobalLoading()
    }
  }

  const syncLastSessionToDB = () => {
    const storedSessionId = localStorage.getItem("sessionId")
    if (!storedSessionId) return

    const token = localStorage.getItem("authToken")
    if (!token) return

    // This is a background sync, no need for global loading indicator
    axios
      .post(
        `${API_BASE}/chatproxy/lastsession`,
        {
          sessionId: storedSessionId,
          isViewingPastSession: localStorage.getItem("isViewingPastSession") === "true",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => { })
      .catch((err) => {
        console.error("Failed to sync last session", err)
      })
  }

  const fetchLastSession = async () => {
    startGlobalLoading();
    const token = localStorage.getItem("authToken");
    if (!token) {
      endGlobalLoading();
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/chatproxy/lastsession`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ New user / no session yet
      if (!res.data?.sessionId) {
        console.info("No last session found — probably a new user.");
        return;
      }

      // ✅ Session exists
      localStorage.setItem("sessionId", res.data.sessionId);
      localStorage.setItem("isViewingPastSession", res.data.isViewingPastSession);
      setCurrentSessionId(res.data.sessionId);
      setIsViewingPastSession(res.data.isViewingPastSession === true);
      await loadSessionAndMessages(res.data.sessionId);

    } catch (err) {
      console.error("Failed to fetch last session", err);
      toast({
        title: "Error",
        description: "Failed to fetch last session details.",
        variant: "destructive",
      });
    } finally {
      endGlobalLoading();
    }
  };


  const handleSessionSelect = (sessionId: any) => {
    if (!sessionId) return

    setIsViewingPastSession(true)
    localStorage.setItem("isViewingPastSession", "true")
    localStorage.removeItem("sessionId")
    localStorage.setItem("sessionId", sessionId)
    setCurrentSessionId(sessionId)
    loadSessionAndMessages() // This will trigger global loading
  }

  const speak = (text: string) => {
    if (!isSpeechEnabled || !("speechSynthesis" in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }


  const formatResponse = (text: string) => {
    text = text.replace(/\[.*?\]|\u3010.*?\u3011/g, "")
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    text = text.replace(/###(.*?)###/g, "<h3>$1</h3>")
    text = text.replace(/##(.*?)##/g, "<h2>$1</h2>")
    text = text
      .split("\n")
      .map((line) => {
        const trimmed = line.trimStart()
        if (trimmed.startsWith("- ")) {
          return "• " + trimmed.slice(2)
        }
        return line
      })
      .join("\n")
    text = text.split("\n").join("<br>")
    return text
  }

  const handleInsight = async () => {
    startGlobalLoading()
    const token = localStorage.getItem("authToken")
    const sessionId = localStorage.getItem("sessionId")

    if (!sessionId) {
      toast({
        title: "Insight Error",
        description: "No active session to mark as insight.",
        variant: "destructive",
      })
      endGlobalLoading()
      return
    }

    try {
      const res = await axios.post(
        `${API_BASE}/chatproxy/insight/${sessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast({
        title: "Insight Generated",
        description: "Insight successfully marked and generated.",
      })
    } catch (err) {
      console.error("Failed to generate insight", err)
      toast({
        title: "Insight Error",
        description: "Could not generate insight.",
        variant: "destructive",
      })
    } finally {
      endGlobalLoading()
    }
  }

  useEffect(() => {
    const initChat = async () => {
      // No startGlobalLoading() here. Individual fetches will manage the counter.
      try {
        await fetchSessions()
        await fetchLastSession()
        const wasViewingPast = localStorage.getItem("isViewingPastSession") === "true"
        if (wasViewingPast) {
          localStorage.setItem("isViewingPastSession", "false")
          setIsViewingPastSession(false)
          await handleNewChat()
        }
      } catch (error) {
        console.error("Initial chat setup failed:", error)
        toast({
          title: "Initialization Error",
          description: "Failed to set up chat. Please refresh.",
          variant: "destructive",
        })
      }
    }
    initChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    syncLastSessionToDB()
  }, [localStorage.getItem("sessionId")])

  const handleNewChat = async () => {
    startGlobalLoading()
    setIsViewingPastSession(false)
    localStorage.setItem("isViewingPastSession", "false")

    const token = localStorage.getItem("authToken")
    const currentSessionId = localStorage.getItem("sessionId")

    const createNewSession = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/chatproxy/chat/session`,
          { sessionType: "general" },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        const newSessionId = res.data.session_id
        localStorage.setItem("sessionId", newSessionId)
        setCurrentSessionId(newSessionId)
        setPreviousResponseId(previousResponseId)
        syncLastSessionToDB()

        setMessages([
          {
            id: "welcome-new",
            text: "New Chat! I'm still here to help. How can I support you today?",
            isUser: false,
            timestamp: new Date(),
          },
        ])
      } catch (err) {
        toast({
          title: "New Session Error",
          description: "Could not start a new chat session.",
          variant: "destructive",
        })
        throw err
      }
    }

    try {
      if (currentSessionId) {
        try {
          await axios.post(
            `${API_BASE}/chatproxy/session/end/${currentSessionId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          )
        } catch (endErr: any) {
          if (endErr.response?.data?.error === "Active chat session not found") {
            console.warn("No active session, creating a new one now...")
            await createNewSession()
            return
          } else {
            console.error("Error ending session:", endErr)
            toast({
              title: "Session End Error",
              description: "Could not end current chat session gracefully.",
              variant: "destructive",
            })
            throw endErr
          }
        }
      }
      await createNewSession()
    } catch (err) {
      toast({
        title: "New Chat Error",
        description: "Unexpected error creating a new chat.",
        variant: "destructive",
      })
    } finally {
      endGlobalLoading()
    }
  }

  const fetchLatestPreviousResponseId = async (): Promise<string | null> => {
    startGlobalLoading() // This is a quick fetch, but still part of a chain
    try {
      const res = await axios.get(`${API_BASE}/chatproxy/latest/responseid`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      return res.data.previousResponseId || null
    } catch (error) {
      console.error("Error fetching previousResponseId:", error)
      return null
    } finally {
      endGlobalLoading()
    }
  }

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true) // This is the loader for chat messages
    setShowSuggestions(false)

    try {
      const token = localStorage.getItem("authToken")

      let sessionId = localStorage.getItem("sessionId")
      if (!sessionId || sessionId === "null") {
        // This part might trigger global loading if createNewSession is called,
        // but it's part of the send flow, so isTyping is primary.
        // If createNewSession is called, it will manage its own global loading.
        const res = await axios.post(
          `${API_BASE}/chatproxy/chat/session`,
          { sessionType: "general" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        sessionId = res.data.session_id
        localStorage.setItem("sessionId", sessionId)
        setCurrentSessionId(sessionId)
      }

      let previousId = localStorage.getItem("previousResponseId")
      if (!previousId || previousId === "null") {
        const fetchedId = await fetchLatestPreviousResponseId() // This will trigger global loading
        if (fetchedId) {
          previousId = fetchedId
          localStorage.setItem("previousResponseId", previousId)
        } else {
          console.warn("No previousResponseId available.")
        }
      }

      const response = await axios.post(
        `${API_BASE}/chatproxy/chat`,
        {
          message: text,
          account_type: "individual",
          previous_response_id: previousId,
          session_id: sessionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const botText = response.data.message || "Sorry, I couldn't process your request."
      const newResponseId = response.data.response_id

      setPreviousResponseId(newResponseId)
      localStorage.setItem("previousResponseId", newResponseId)

      if (response.status === 200) {
        const botMessage: Message = {
          id: newResponseId,
          text: formatResponse(botText),
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        speak(response.data.message)
      } else {
        toast({
          title: "Chat Error",
          description: "Something went wrong",
        })
      }
    } catch (err) {
      console.error("Error sending message", err)
      toast({
        title: "Network Error",
        description: "Could not reach the AI server. Try again later.",
      })
    } finally {
      setIsTyping(false) // End typing indicator
    }
  }

  const handleToggleVoice = () => {
    setIsListening(!isListening)
    if (!isListening) {
      toast({
        title: "Voice input activated",
        description: "Speak your message now...",
      })
      setTimeout(() => {
        setIsListening(false)
        toast({
          title: "Voice input ended",
          description: "You can try again anytime.",
        })
      }, 3000)
    }
  }

  const handleToggleSpeech = () => {
    const nextState = !isSpeechEnabled
    setIsSpeechEnabled(nextState)
    toast({
      title: nextState ? "Speech enabled" : "Speech disabled",
      description: nextState ? "Messages will now be read aloud" : "Messages will no longer be read aloud",
    })
  }

  const handleEmergencySupport = () => {
    toast({
      title: "Emergency Support",
      description:
        "If you're in crisis, please contact your local emergency services or a crisis helpline immediately.",
      variant: "destructive",
    })

    const emergencyMessage: Message = {
      id: "emergency-" + Date.now(),
      text: "I understand you need immediate support. Please remember:\n\n🆘 **If you're in immediate danger, call emergency services**\n\n📞 **Crisis Support Numbers:**\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• SAMHSA National Helpline: 1-800-662-4357\n\nYou're not alone, and help is available. Please reach out to a trusted person or professional support service.",
      isUser: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, emergencyMessage])
  }

  const handleSelectSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleViewSummary = async () => {
    startGlobalLoading()
    const sessiontobesummarized = localStorage.getItem("sessionId")
    try {
      const res = await axios.post(`${API_BASE}/chatproxy/summary/${sessiontobesummarized}`)
      setSummary(res.data.summary)
      setShowSummaryModal(true)
    } catch (err) {
      console.error("Failed to fetch summary", err)
      toast({
        title: "Error",
        description: "Could not fetch session summary.",
        variant: "destructive",
      })
    } finally {
      endGlobalLoading()
    }
  }

  return (
    <>
      {isGlobalLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white mt-4 text-sm">Loading...</p>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center h-screen  px-2 sm:px-4 md:px-6 mt-[18px]">
        <div className="flex flex-col w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl h-full max-h-[calc(100vh-60px)] bg-chat-surface border border-gray-300 rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-300 shadow-chat">
            <div className="flex items-center gap-4">
              <SoraLogo />
            </div>

            <div className="flex items-center gap-4">
              {/* Dropdown for recent sessions */}
              <RecentSessionsModal
                recentSessions={recentSessions}
                handleSessionSelect={handleSessionSelect}
                isGlobalLoading={isGlobalLoading}
              />

              {/* Insight Button */}
              <button
                onClick={handleInsight}
                className="px-3 sm:px-4 py-2 bg-green-500 text-white text-xs sm:text-sm rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGlobalLoading}
              >
                {isGlobalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                <span className="block sm:hidden">Insight</span>
                <span className="hidden sm:block">Mark as Insight</span>
              </button>
            </div>
          </div>

          {/* Messages ScrollArea */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 py-4 sm:p-6 overflow-auto">
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && !isMobile && (
            <div className="px-3 sm:px-6">
              <SuggestionChips
                suggestions={suggestions}
                onSelectSuggestion={handleSelectSuggestion}
                disabled={isTyping}
              />
            </div>
          )}

          {/* Actions + Input (wrapped safely) */}
          <div className="w-full px-3 sm:px-6 space-y-2 sm:space-y-3 pb-4 sm:pb-6">
            <div className="w-full flex flex-wrap gap-2">
              <ChatActions
                onNewChat={handleNewChat}
                disabled={isTyping || isGlobalLoading}
                isGlobalLoading={isGlobalLoading}
              />

              {/* Show "View Summary" only when viewing past session */}
              {isViewingPastSession && (
                <div className="flex justify-center sm:justify-start w-full">
                  <button
                    onClick={handleViewSummary}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-800/50 text-white rounded-lg text-xs sm:text-sm font-semibold border-2 border-cyan-500/30 hover:border-cyan-400/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm md:ml-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isGlobalLoading}
                  >
                    {isGlobalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    View Summary
                  </button>
                </div>
              )}
            </div>

            {/* Show input only when not viewing past session */}
            {!isViewingPastSession && (
              <EnhancedChatInput
                onSendMessage={handleSendMessage}
                disabled={isTyping}
                onToggleVoice={handleToggleVoice}
                onToggleSpeech={handleToggleSpeech}
                isListening={isListening}
                isSpeechEnabled={isSpeechEnabled}
              />
            )}
          </div>
        </div>
      </div>
      {/* Support Cards */}
      <div className="px-3 sm:px-6 pt-4 pb-8">
        <SupportCards />
      </div>
      {showSummaryModal && summary && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-2 sm:p-4">
          <div className="bg-gray-800/90 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg border border-gray-700 text-white max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-cyan-400">Chat Summary</h2>
            <p className="text-gray-300 text-sm sm:text-base whitespace-pre-wrap">{summary}</p>
            <div className="mt-4 sm:mt-6 text-right">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black rounded-lg font-semibold transition-all text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  function RecentSessionsModal({
    recentSessions,
    handleSessionSelect,
    isGlobalLoading,
  }: {
    recentSessions: any[]
    handleSessionSelect: (sessionId: string) => void
    isGlobalLoading: boolean
  }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (sessionId: string) => {
      handleSessionSelect(sessionId)
      setIsOpen(false)
    }

    return (
      <>
        {/* Trigger Button */}
        <button
          className="px-3 sm:px-4 py-2 bg-gray-800/50 text-white rounded-lg text-xs sm:text-sm font-semibold border-2 border-cyan-500/30 hover:border-cyan-400/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setIsOpen(true)}
          disabled={isGlobalLoading}
        >
          {isGlobalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <span className="block sm:hidden">Recents</span>
          <span className="hidden sm:block">View Recent Chats</span>
        </button>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
            <div className="bg-gray-800/90 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg border border-gray-700 text-white max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-cyan-400">Recent Sessions</h2>
                <button
                  className="text-gray-400 hover:text-red-500 text-2xl sm:text-3xl p-1"
                  onClick={() => setIsOpen(false)}
                >
                  &times;
                </button>
              </div>

              <ul className="space-y-2 max-h-60 sm:max-h-72 overflow-y-auto custom-scroll">
                {recentSessions.length === 0 && <li className="text-gray-500 text-sm">No sessions found.</li>}
                {recentSessions.map((session) => (
                  <li
                    key={session._id}
                    onClick={() => handleSelect(session._id)}
                    className="cursor-pointer p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded text-sm text-gray-300"
                  >
                    {session.title || `Session from ${new Date(session.createdAt).toLocaleDateString()}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </>
    )
  }
}

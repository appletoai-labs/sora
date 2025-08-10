import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chatMessage";
import { EnhancedChatInput } from "./enhancedChatInput";
import { TypingIndicator } from "./typingIndicator";
import { SuggestionChips } from "./suggestionChips";
import { ChatActions } from "./chatActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SupportCards from "../../components/supportCards";
import axios from "axios";
import SoraLogo from "../SoraLogo";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const suggestions = [
  { id: "1", text: "I'm feeling overwhelmed", icon: "😔" },
  { id: "2", text: "Help break down a task", icon: "📝" },
  { id: "3", text: "Sensory difficulties", icon: "🎧" },
  { id: "4", text: "Organize my thoughts", icon: "🧠" },
  { id: "5", text: "Focus strategies", icon: "🎯" },
  { id: "6", text: "Energy management", icon: "⚡" }
];

export const Trialchat = () => {
  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`;
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant specializing in neurodiversity support. I'm here to help you navigate challenges, understand your unique strengths, and provide personalized strategies for daily life. How can I support you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(() => {
    return localStorage.getItem("previousResponseId");
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [recentSessions, setRecentSessions] = useState([]);
  const [isViewingPastSession, setIsViewingPastSession] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);



  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const fetchSessions = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${API_BASE}/chatproxy/sessions/recent `, {
        headers: {
          Authorization: `Bearer ${token}`, // Use your auth system
        },
      });
      setRecentSessions(res.data.sessions);
    } catch (err) {
      console.error("Failed to load recent sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  const loadSessionAndMessages = async (sessionIdFromFetch?: string) => {
    const token = localStorage.getItem("authToken");
    const sessionId = sessionIdFromFetch || localStorage.getItem("sessionId");

    if (!token) return;
    if (!sessionId) {
      console.warn("No session ID found in localStorage");
      return;
    }

    try {
      setCurrentSessionId(sessionId);

      const msgRes = await axios.get(
        `${API_BASE}/chatproxy/session/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const messagesFromDB: Message[] = msgRes.data.messages.map((msg: any, index: number) => ({
        id: `${index}-${msg.role}`,
        text: msg.content,
        isUser: msg.role === "user",
        timestamp: new Date(),
      }));

      setMessages(messagesFromDB);
    } catch (err) {
      console.error("Failed to load session or messages", err);
    }
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (!storedSessionId) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.post(
      `${API_BASE}/chatproxy/lastsession`,
      {
        sessionId: storedSessionId,
        isViewingPastSession: localStorage.getItem("isViewingPastSession") === "true",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then(() => {
    }).catch(err => {
      console.error("Failed to sync last session", err);
    });
  }, [localStorage.getItem("sessionId")]);


  const fetchLastSession = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/chatproxy/lastsession`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.sessionId) {

        // Save to localStorage
        localStorage.setItem("sessionId", res.data.sessionId);
        localStorage.setItem("isViewingPastSession", res.data.isViewingPastSession);

        // Update state immediately
        setCurrentSessionId(res.data.sessionId);
        setIsViewingPastSession(res.data.isViewingPastSession === true);

        // Load messages AFTER saving values
        await loadSessionAndMessages(res.data.sessionId);
      } else {
        console.warn("No last session found on backend");
      }
    } catch (err) {
      console.error("Failed to fetch last session", err);
    }
  };

  // ✅ Single effect
  useEffect(() => {
    fetchLastSession();
  }, []);




  const handleSessionSelect = (sessionId: any) => {
    if (!sessionId) return;

    setIsViewingPastSession(true);
    localStorage.setItem("isViewingPastSession", "true");

    // Store session ID in localStorage
    localStorage.removeItem("sessionId");
    localStorage.setItem("sessionId", sessionId);
    setCurrentSessionId(sessionId);
    loadSessionAndMessages();
  };


  const speak = (text: string) => {
    if (!isSpeechEnabled || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.cancel(); // stop any current speech
    speechSynthesis.speak(utterance);
  };

  const formatResponse = (text) => {
    // Remove text inside [...] or 【...】
    text = text.replace(/\[.*?\]|\u3010.*?\u3011/g, '');

    // Convert **bold** Markdown to <strong> HTML tags
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert ###text### to <h3>text</h3>
    text = text.replace(/###(.*?)###/g, '<h3>$1</h3>');

    // Convert ##text## to <h2>text</h2>
    text = text.replace(/##(.*?)##/g, '<h2>$1</h2>');

    // Convert lines starting with "- " to bullet points "• "
    // We process line by line before converting newlines to <br>
    text = text
      .split('\n')
      .map((line) => {
        const trimmed = line.trimStart();
        if (trimmed.startsWith('- ')) {
          return '• ' + trimmed.slice(2);
        }
        return line;
      })
      .join('\n');

    // Replace all newlines with HTML line breaks
    text = text.split('\n').join('<br>');

    return text;
  };

  const handleInsight = async () => {
    const token = localStorage.getItem("authToken");
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) return;

    try {
      const res = await axios.post(
        `${API_BASE}/chatproxy/insight/${sessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const insightText = res.data.insight;
      toast({
        title: "Insight Generated"
      });
    } catch (err) {
      toast({
        title: "Insight Error",
        description: "Could not generate insight.",
      });
    }
  };

  const handleNewChat = async () => {
    setIsViewingPastSession(false);
    localStorage.setItem("isViewingPastSession", "false");

    const token = localStorage.getItem("authToken");
    const currentSessionId = localStorage.getItem("sessionId");

    try {
      // ✅ End current active session before starting a new one
      if (currentSessionId) {
        try {
          await axios.post(
            `${API_BASE}/chatproxy/session/end/${currentSessionId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (endErr) {
          // If backend says "Active chat session not found"
          if (endErr.response?.data?.error === "Active chat session not found") {
            toast({
              title: "Info",
              description: "You're already in a new chat session.",
              variant: "default", // or "info" depending on your toast system
            });
          } else {
            console.error("Error ending session:", endErr);
          }
          // Continue creating a new chat regardless
        }
      }

      // ✅ Create a new session
      const res = await axios.post(
        `${API_BASE}/chatproxy/chat/session`,
        { sessionType: "general" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newSessionId = res.data.session_id;

      // Save and update states
      localStorage.setItem("sessionId", newSessionId);
      setCurrentSessionId(newSessionId);

      setPreviousResponseId(previousResponseId);

      // Reset chat UI
      setMessages([
        {
          id: "welcome-new",
          text: "New Chat! I'm still here to help. How can I support you today?",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      toast({
        title: "New Session Error",
        description: "Could not start a new chat session.",
        variant: "destructive",
      });
    }
  };


  const fetchLatestPreviousResponseId = async (): Promise<string | null> => {
    try {
      const res = await axios.get(`${API_BASE}/chatproxy/latest/responseid`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      return res.data.previousResponseId || null;
    } catch (error) {
      console.error("Error fetching previousResponseId:", error);
      return null;
    }
  };


  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const token = localStorage.getItem("authToken");

      let sessionId = localStorage.getItem("sessionId");

      if (!sessionId || sessionId === "null") {
        const res = await axios.post(
          `${API_BASE}/chatproxy/chat/session`,
          { sessionType: "general" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        sessionId = res.data.session_id;
        localStorage.setItem("sessionId", sessionId);
        setCurrentSessionId(sessionId);
      }

      let previousId = localStorage.getItem("previousResponseId");
      if (!previousId || previousId === "null") {
        const fetchedId = await fetchLatestPreviousResponseId();
        if (fetchedId) {
          previousId = fetchedId;
          localStorage.setItem("previousResponseId", previousId);
        } else {
          console.warn("No previousResponseId available.");
        }
      }

      const response = await axios.post(
        `${API_BASE}/chatproxy/chattrials`,
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
        }
      );

      if (response.status === 300) {
        toast({
          title: "Free Trial Limit",
          description: response.data.error,
          duration: 5000,
        });
        setIsTyping(false);
        return; // Stop further processing since limit reached
      }

      const botText = response.data.message || "Sorry, I couldn't process your request.";
      const newResponseId = response.data.response_id;

      setPreviousResponseId(newResponseId);
      localStorage.setItem("previousResponseId", newResponseId);

      if (response.status === 200) {
        const botMessage: Message = {
          id: newResponseId,
          text: formatResponse(botText),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        speak(response.data.message);
      } else {
        toast({
          title: "Chat Error",
          description: "Something went wrong",
          duration: 4000,
        });
      }
    } catch (err) {
      console.error("Error sending message", err);
      toast({
        title: "Network Error",
        description: "Could not reach the AI server. Try again later.",
        duration: 4000,
      });
    } finally {
      setIsTyping(false);
    }
  };



  const handleToggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice input activated",
        description: "Speak your message now...",
      });
      setTimeout(() => {
        setIsListening(false);
        toast({
          title: "Voice input ended",
          description: "You can try again anytime.",
        });
      }, 3000);
    }
  };

  const handleToggleSpeech = () => {
    const nextState = !isSpeechEnabled;
    setIsSpeechEnabled(nextState);
    toast({
      title: nextState ? "Speech enabled" : "Speech disabled",
      description: nextState
        ? "Messages will now be read aloud"
        : "Messages will no longer be read aloud",
    });
  };


  const handleEmergencySupport = () => {
    toast({
      title: "Emergency Support",
      description: "If you're in crisis, please contact your local emergency services or a crisis helpline immediately.",
      variant: "destructive"
    });

    const emergencyMessage: Message = {
      id: "emergency-" + Date.now(),
      text: "I understand you need immediate support. Please remember:\n\n🆘 **If you're in immediate danger, call emergency services**\n\n📞 **Crisis Support Numbers:**\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• SAMHSA National Helpline: 1-800-662-4357\n\nYou're not alone, and help is available. Please reach out to a trusted person or professional support service.",
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, emergencyMessage]);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleViewSummary = async () => {
    setLoadingSummary(true);
    let sessiontobesummarized = localStorage.getItem("sessionId")
    try {
      const res = await axios.post(`${API_BASE}/chatproxy/summary/${sessiontobesummarized}`);
      setSummary(res.data.summary);
      setLoadingSummary(false);
      setShowSummaryModal(true);
    } catch (err) {
      console.error('Failed to fetch summary', err);
      toast({
        title: 'Error',
        description: 'Could not fetch session summary.',
        variant: 'destructive',
      });
    }
  };


  return (
    <>
      <div className="flex justify-center items-center h-screen  px-2 sm:px-4 md:px-6 mt-[100px]">
        <div className="flex flex-col w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl h-full max-h-[calc(100vh-60px)] bg-chat-surface border border-gray-300 rounded-lg shadow-lg">

          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-300 shadow-chat">
            <div className="flex items-center gap-4">
              <SoraLogo />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-500 font-medium">Online</span>
              </div>
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
          {showSuggestions && messages.length <= 1 && (
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
              <ChatActions onNewChat={handleNewChat} disabled={isTyping} />
            </div>


            {/* Show input only when not viewing past session */}

            <EnhancedChatInput
              onSendMessage={handleSendMessage}
              disabled={isTyping}
              onToggleVoice={handleToggleVoice}
              onToggleSpeech={handleToggleSpeech}
              isListening={isListening}
              isSpeechEnabled={isSpeechEnabled}
            />

          </div>



        </div>
      </div>
    </>
  );

};
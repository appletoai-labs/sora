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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant specializing in neurodiversity support. I'm here to help you navigate challenges, understand your unique strengths, and provide personalized strategies for daily life. How can I support you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [previousResponseId, setPreviousResponseId] = useState<String>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      const response = await axios.post(`${API_BASE}/chatproxy/chat`, {
        message: text,
        user_id: "demo_user",
        account_type: "individual",
        previous_response_id: previousResponseId
      });
      const botText = response.data.message || "Sorry, I couldn't process your request.";
      setPreviousResponseId(response.data.response_id);
      if (response.status == 200) {
        const botMessage: Message = {
          id: response.data.response_id,
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
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not reach the AI server. Try again later.",
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

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        text: "Chat cleared! I'm still here to help. How can I support you today?",
        isUser: false,
        timestamp: new Date(),
      }
    ]);
    speechSynthesis.cancel();
    setShowSuggestions(true);
    setPreviousResponseId(null);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset.",
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

  return (
    <>
      <div className="flex justify-center items-start min-h-screen px-2 sm:px-4 md:px-6 pt-12 sm:pt-20">

        <div className="flex flex-col w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl h-full max-h-[calc(100vh-60px)] bg-chat-surface border border-gray-300 rounded-lg shadow-lg">

          {/* Header */}
          <div className="flex items-center gap-4 p-4 sm:p-6 border-b border-gray-300 shadow-chat">
            <SoraLogo />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-500 font-medium">Online</span>
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
              <ChatActions
                onClearChat={handleClearChat}
                onEmergencySupport={handleEmergencySupport}
                disabled={isTyping}
              />
            </div>
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
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chatMessage";
import { EnhancedChatInput } from "./enhancedChatInput";
import { TypingIndicator } from "./typingIndicator";
import { SuggestionChips } from "./suggestionChips";
import { ChatActions } from "./chatActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant specializing in neurodiversity support. I'm here to help you navigate challenges, understand your unique strengths, and provide personalized strategies for daily life. How can I support you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
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

    // Simulate AI response with more contextual responses
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getContextualResponse(text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getContextualResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("overwhelmed") || message.includes("stress")) {
      return "I understand feeling overwhelmed can be really challenging. Let's break this down together:\n\n1. Take a deep breath - you're safe right now\n2. What's the most pressing thing on your mind?\n3. Can we identify just one small step to move forward?\n\nRemember, it's okay to take things one moment at a time. What would help you feel more grounded right now?";
    }
    
    if (message.includes("task") || message.includes("organize") || message.includes("focus")) {
      return "Great question about task management! Here are some neurodivergent-friendly strategies:\n\n• Break large tasks into tiny, specific steps\n• Use the 'two-minute rule' - if it takes less than 2 minutes, do it now\n• Try body doubling (working alongside someone)\n• Set timers for focused work periods\n• Create visual reminders or checklists\n\nWhich of these resonates with you, or would you like me to elaborate on any specific approach?";
    }
    
    if (message.includes("sensory") || message.includes("noise") || message.includes("light")) {
      return "Sensory challenges are so real and valid. Here are some strategies that might help:\n\n🎧 Noise-canceling headphones or ear defenders\n🕶️ Sunglasses or tinted glasses for light sensitivity\n🧸 Fidget tools or comfort items\n👕 Comfortable, soft clothing\n🏠 Creating sensory-safe spaces\n\nWhat specific sensory challenges are you experiencing? I can provide more targeted suggestions.";
    }
    
    return `Thank you for sharing that with me. Based on what you've told me about "${userMessage}", I can offer some personalized insights and strategies. Neurodivergent experiences are unique to each person, and I'm here to help you find approaches that work specifically for you.\n\nWould you like me to explore this topic further, or is there another area where you'd like support?`;
  };

  const handleToggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice input activated",
        description: "Speak your message now...",
      });
      // In a real app, you'd integrate with speech recognition here
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
    setIsSpeechEnabled(!isSpeechEnabled);
    toast({
      title: isSpeechEnabled ? "Speech disabled" : "Speech enabled",
      description: isSpeechEnabled ? "Messages will no longer be read aloud" : "Messages will now be read aloud",
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
    setShowSuggestions(true);
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
    
    // Add emergency message to chat
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
    <div className="flex flex-col h-screen bg-gradient-chat mt-[60px]">
      <div className="flex items-center gap-4 p-6 bg-chat-surface border-b border-border shadow-chat">
        <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Neurodiversity AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Specialized support for neurodivergent minds</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-500 font-medium">Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
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

      {/* Suggestion Chips */}
      {showSuggestions && messages.length <= 1 && (
        <SuggestionChips
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
          disabled={isTyping}
        />
      )}

      {/* Chat Actions */}
      <ChatActions
        onClearChat={handleClearChat}
        onEmergencySupport={handleEmergencySupport}
        disabled={isTyping}
      />

      {/* Enhanced Input */}
      <EnhancedChatInput
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        onToggleVoice={handleToggleVoice}
        onToggleSpeech={handleToggleSpeech}
        isListening={isListening}
        isSpeechEnabled={isSpeechEnabled}
      />
    </div>
  );
};
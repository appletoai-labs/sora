// components/chat/enhancedChatInput.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onToggleVoice?: () => void;
  onToggleSpeech?: () => void;
  isListening?: boolean;
  isSpeechEnabled?: boolean;
}

export const EnhancedChatInput = ({ 
  onSendMessage, 
  disabled, 
  onToggleVoice,
  onToggleSpeech,
  isListening = false,
  isSpeechEnabled = false
}: EnhancedChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-2 px-2 py-3 sm:px-4 sm:py-5 bg-chat-surface border-t border-border">
      {/* Speech Toggle */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={onToggleSpeech}
          className={cn(
            "rounded-full px-3 py-1 text-[10px] sm:text-sm transition-all duration-300",
            isSpeechEnabled 
              ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90" 
              : "bg-gradient-surface text-foreground hover:bg-chat-surface-elevated"
          )}
        >
          <Volume2 className="h-4 w-4 mr-1" />
          {isSpeechEnabled ? "Speech On" : "Speak responses"}
        </Button>
      </div>

      {/* Input Row */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mic Button */}
          <Button
            type="button"
            onClick={onToggleVoice}
            className={cn(
              "w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl transition-all duration-300",
              isListening 
                ? "bg-gradient-primary text-primary-foreground animate-pulse-glow" 
                : "bg-gradient-surface text-foreground hover:bg-chat-surface-elevated"
            )}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Input + Send */}
          <div className="flex-1 relative min-w-0">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Type your message..."}
              disabled={disabled || isListening}
              className={cn(
                "h-9 sm:h-12 w-full pr-10 sm:pr-12 bg-background border-2 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300",
                "focus:ring-2 focus:ring-primary/50 focus:border-primary",
                isListening && "border-primary bg-primary/5"
              )}
            />
            <Button 
              type="submit"
              disabled={!message.trim() || disabled || isListening}
              className={cn(
                "absolute right-1 top-1 h-7 w-7 sm:h-10 sm:w-10 rounded-lg transition-all duration-300",
                (!message.trim() || disabled || isListening)
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105"
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

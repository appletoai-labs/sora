import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full animate-slide-up group",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex items-start gap-3 max-w-[85%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
          isUser 
            ? "bg- text-primary-foreground shadow-glow" 
            : "bg-gradient-surface text-foreground border border-border"
        )}>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "rounded-2xl px-5 py-3 shadow-message transition-all duration-300 group-hover:shadow-elevated",
          isUser 
            ? "bg-gradient-primary text-primary-foreground" 
            : "bg-gradient-surface text-foreground border border-border"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          {timestamp && (
            <p className={cn(
              "text-xs mt-2 transition-opacity duration-300",
              isUser 
                ? "text-primary-foreground/70" 
                : "text-muted-foreground"
            )}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
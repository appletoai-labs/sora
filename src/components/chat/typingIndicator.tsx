import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start w-full animate-slide-up group">
      <div className="flex items-start gap-3">
        {/* Bot Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-surface border border-border flex items-center justify-center">
          <Bot className="h-4 w-4 text-foreground" />
        </div>

        {/* Typing Bubble */}
        <div className="bg-gradient-surface text-foreground border border-border rounded-2xl px-5 py-4 shadow-message transition-all duration-300 group-hover:shadow-elevated">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-typing-dots"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-typing-dots" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-typing-dots" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-muted-foreground ml-3">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
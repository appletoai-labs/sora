import { cn } from "@/lib/utils";

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
        {/* Avatar (replaced with Sora SVG only) */}
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          <svg
            width="40"
            height="20"
            viewBox="0 0 60 20"
            className="text-sora-teal"
          >
            <path
              d="M0 10 L15 10 L20 5 L25 15 L30 2 L35 18 L40 10 L60 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
          </svg>
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

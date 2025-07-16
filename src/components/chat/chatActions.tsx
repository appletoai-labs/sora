import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatActionsProps {
  onClearChat: () => void;
  onEmergencySupport: () => void;
  disabled?: boolean;
}

export const ChatActions = ({ onClearChat, onEmergencySupport, disabled }: ChatActionsProps) => {
  return (
    <div className="flex gap-4 px-6 pb-6">
      {/* Clear Chat Button */}
      <Button
        onClick={onClearChat}
        disabled={disabled}
        className={cn(
          "flex-1 h-12 rounded-xl border-2 transition-all duration-300",
          "bg-gradient-surface text-foreground border-primary/30",
          "hover:bg-chat-surface-elevated hover:border-primary hover:shadow-elevated",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Clear Chat
      </Button>

      {/* Emergency Support Button */}
      <Button
        onClick={onEmergencySupport}
        disabled={disabled}
        className={cn(
          "flex-1 h-12 rounded-xl transition-all duration-300",
          "bg-red-500 text-emergency-foreground",
          "hover:opacity-90 hover:shadow-elevated hover:scale-105",
          "focus:outline-none focus:ring-2 focus:ring-emergency/50",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          "animate-float"
        )}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Need Immediate Support
      </Button>
    </div>
  );
};
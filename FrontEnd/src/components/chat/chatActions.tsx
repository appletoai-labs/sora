import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ChatActionsProps {
  onNewChat: () => void;
  disabled?: boolean;
  isGlobalLoading?: boolean
}

export const ChatActions = ({ onNewChat, disabled }: ChatActionsProps) => {
  const navigate = useNavigate();

  const handleEmergencyClick = () => {
    navigate("/app/immediate-support");
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 px-3 sm:px-6 pb-4 sm:pb-6">
  {/* Start New Chat Button */}
  <Button
    onClick={onNewChat}
    disabled={disabled}
    className={cn(
      "w-full sm:flex-1 min-w-[140px] h-12 rounded-xl border-2 transition-all duration-300",
      "bg-gradient-surface text-foreground border-primary/30",
      "hover:bg-chat-surface-elevated hover:border-primary hover:shadow-elevated",
      "focus:outline-none focus:ring-2 focus:ring-primary/50",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    )}
  >
    <PlusCircle className="h-4 w-4 mr-2" />
    New Chat
  </Button>

  {/* Emergency Support Button */}
  <Button
    onClick={handleEmergencyClick}
    disabled={disabled}
    className={cn(
      "w-full sm:flex-1 min-w-[180px] h-12 rounded-xl transition-all duration-300",
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

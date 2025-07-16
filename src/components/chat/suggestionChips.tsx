import { cn } from "@/lib/utils";

interface SuggestionChip {
  id: string;
  text: string;
  icon?: string;
}

interface SuggestionChipsProps {
  suggestions: SuggestionChip[];
  onSelectSuggestion: (suggestion: string) => void;
  disabled?: boolean;
}

export const SuggestionChips = ({ suggestions, onSelectSuggestion, disabled }: SuggestionChipsProps) => {
  return (
    <div className="px-6 pb-4">
      <p className="text-muted-foreground text-sm mb-4 text-center">
        Need some ideas? Try asking:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            onClick={() => onSelectSuggestion(suggestion.text)}
            disabled={disabled}
            className={cn(
              "px-4 py-2 rounded-xl text-sm transition-all duration-300 animate-scale-in",
              "bg-gradient-suggestion text-foreground border border-border",
              "hover:bg-chat-surface-elevated hover:border-primary/50 hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "shadow-message hover:shadow-elevated"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {suggestion.icon && <span className="mr-2">{suggestion.icon}</span>}
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
};
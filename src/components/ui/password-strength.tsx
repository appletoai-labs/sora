import { cn } from "@/lib/utils";
import { getPasswordStrength } from "@/lib/validation";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { score, feedback } = getPasswordStrength(password);
  
  const strengthColors = [
    "text-destructive", // 0-1: Very weak
    "text-orange-500",  // 2: Weak
    "text-yellow-500",  // 3: Fair
    "text-blue-500",    // 4: Good
    "text-green-500"    // 5: Strong
  ];

  const strengthLabels = [
    "Very weak",
    "Weak", 
    "Weak",
    "Fair",
    "Good",
    "Strong"
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password strength:</span>
        <span className={cn("text-sm font-medium", strengthColors[score])}>
          {strengthLabels[score]}
        </span>
      </div>
      
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            score <= 1 ? "bg-destructive" : 
            score === 2 ? "bg-orange-500" :
            score === 3 ? "bg-yellow-500" :
            score === 4 ? "bg-blue-500" : "bg-green-500"
          )}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      
      {password && feedback.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Requirements:</p>
          <ul className="space-y-1">
            {[
              "At least 8 characters",
              "One uppercase letter", 
              "One lowercase letter",
              "One number",
              "One special character"
            ].map((requirement, index) => {
              const isMet = !feedback.includes(requirement);
              return (
                <li key={requirement} className="flex items-center gap-2 text-xs">
                  {isMet ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className={isMet ? "text-green-600" : "text-muted-foreground"}>
                    {requirement}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
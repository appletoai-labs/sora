// src/components/dashboard/SupportCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const getRoleLabel = (role: string) => {
  switch (role) {
    case "individual":
      return "Individual";
    case "therapy_client":
      return "Therapy Client";
    case "therapist":
      return "Therapist";
    default:
      return "User";
  }
};

export const SupportCard = ({ user }: { user: any }) => {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-card mb-8">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Your Personal Support Space</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
          This is your dedicated area for self-guided support, peer connection, and personal growth.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Badge variant="outline" className="border-sora-teal/30 text-sora-teal px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Therapist
          </Badge>
          <Badge variant="outline" className="border-sora-teal/30 text-sora-teal px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Therapy Client
          </Badge>
          <Badge variant="outline" className="border-sora-teal/30 text-sora-teal px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Individual
          </Badge>
          <Badge className="bg-sora-teal text-sora-dark px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Currently: {getRoleLabel(user?.role || "individual")}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8 text-left">
          <div>
            <h3 className="text-lg font-semibold text-sora-teal mb-4">Accessibility</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-sora-muted rounded-lg">
                <span className="text-foreground">High Contrast</span>
                <div className="w-12 h-6 bg-sora-teal rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-sora-dark rounded-full ml-auto" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground">Font Size:</span>
                <div className="flex gap-1">
                  {["A", "A", "A"].map((letter, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`w-8 h-8 p-0 border-sora-teal/30 ${index === 1 ? "bg-sora-teal/20 text-sora-teal" : "text-muted-foreground"
                        }`}
                      style={{ fontSize: `${12 + index * 2}px` }}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-sora-teal mb-4">Quick Access</h3>
            <div className="space-y-2">
              <Link to="/app/immediate-support" className="block text-sm text-sora-teal transition">
                🚨 Emergency Support
              </Link>
              <Link to="/app/chat" className="block text-sm text-sora-teal transition">
                🧠 Talk to SORA
              </Link>
              <Link to="/app/sensory" className="block text-sm text-sora-teal transition">
                🎧 Sensory Tools
              </Link>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

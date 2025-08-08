import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUiPreferences } from "@/context/UiPreferencesContext";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

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
  const { highContrast, fontSizeLevel, setHighContrast, setFontSizeLevel } = useUiPreferences();

  useEffect(() => {
    const storedContrast = localStorage.getItem("sora-contrast");
    const storedFontSize = localStorage.getItem("sora-fontsize");
    if (storedContrast) setHighContrast(storedContrast === "true");
    if (storedFontSize) setFontSizeLevel(parseInt(storedFontSize));
  }, []);

  useEffect(() => {
    localStorage.setItem("sora-contrast", highContrast.toString());
    localStorage.setItem("sora-fontsize", fontSizeLevel.toString());
  }, [highContrast, fontSizeLevel]);

  const fontSizePx = 14 + fontSizeLevel * 2;

  return (
    <Card
      className={clsx(
        "mb-8 shadow-card border-border/50",
        highContrast
          ? "bg-black text-white border-white"
          : "bg-gradient-card text-foreground"
      )}
      style={{ fontSize: `${fontSizePx}px` }}
    >
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Personal Support Space</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
          This is your dedicated area for self-guided support, peer connection, and personal growth.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {["therapist", "therapy_client", "individual"].map((role) => (
            <Badge key={role} variant="outline" className="border-sora-teal/30 text-sora-teal px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              {getRoleLabel(role)}
            </Badge>
          ))}
          <Badge className="bg-sora-teal text-sora-dark px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Currently: {getRoleLabel(user?.role || "individual")}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8 text-left">
          {/* Accessibility Section */}
          <div>
            <h3 className="text-lg font-semibold text-sora-teal mb-4">Accessibility</h3>
            <div className="space-y-3">
              {/* Contrast Toggle */}
              <div
                className={clsx(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all",
                  highContrast
                    ? "bg-[#1a1a1a] text-white border-white"
                    : "bg-sora-muted text-foreground border-sora-teal/30"
                )}
                onClick={() => setHighContrast((prev) => !prev)}
              >
                <span>High Contrast</span>
                <div
                  className={clsx(
                    "w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300",
                    highContrast ? "bg-white/90 border border-white" : "bg-sora-teal"
                  )}
                >
                  <div
                    className={clsx(
                      "w-4 h-4 rounded-full transition-all shadow-sm",
                      highContrast
                        ? "bg-black border border-white ml-auto"
                        : "bg-white"
                    )}
                  />
                </div>
              </div>

              {/* Font Size Toggle */}
              <div className="flex items-center gap-2">
                <span>Font Size:</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((level) => (
                    <Button
                      key={level}
                      variant="outline"
                      size="sm"
                      onClick={() => setFontSizeLevel(level)}
                      className={clsx(
                        "w-8 h-8 p-0 border-sora-teal/30",
                        fontSizeLevel === level
                          ? "bg-sora-teal/20 text-sora-teal"
                          : highContrast
                            ? "bg-[#1e1e1e] text-white border-[#00c2ff]"
                            : "text-muted-foreground"
                      )}
                      style={{ fontSize: `${12 + level * 2}px` }}
                    >
                      A
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div>
            <h3 className="text-lg font-semibold text-sora-teal mb-4">Quick Access</h3>
            <div className="space-y-2">
              <Link
                to="/app/immediate-support"
                className="block text-sm text-sora-teal transition-all duration-200 hover:text-sora-orange hover:scale-[1.02]"
              >
                🚨 Emergency Support
              </Link>

              <Link
                to="/app/chat"
                className="block text-sm text-sora-teal transition-all duration-200 hover:text-sora-orange hover:scale-[1.02]"
              >
                🧠 Talk to SORA ALLY
              </Link>

              <Link
                to="/app/sensory"
                className="block text-sm text-sora-teal transition-all duration-200 hover:text-sora-orange hover:scale-[1.02]"
              >
                🎧 Sensory Tools
              </Link>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

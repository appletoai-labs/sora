import { useNavigate } from "react-router-dom";
import { Lightbulb, CalendarCheck, Hand } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SupportCards = () => {
  const navigate = useNavigate();

  const items = [
    {
      icon: <Lightbulb className="w-8 h-8 text-sora-teal mx-auto" />,
      title: "Clarity Tools",
      description: "Break down overwhelming tasks or situations",
      buttonText: "Try Tools",
      navigateTo: "/app/clarity",
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-sora-teal mx-auto" />,
      title: "Daily Check-in",
      description: "Track how you're feeling today",
      buttonText: "Check In",
      navigateTo: "/app/checkin",
    },
    {
      icon: <Hand className="w-8 h-8 text-sora-teal mx-auto" />,
      title: "Sensory Support",
      description: "Find calming strategies and tools",
      buttonText: "Get Support",
      navigateTo: "/app/sensory",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-6">
      {items.map((item, idx) => (
        <Card key={idx} className="bg-[#17171c] rounded-xl p-6 text-center border border-sora-teal/20">
          <CardHeader>
            <div className="flex flex-col items-center gap-2">
              {item.icon}
              <CardTitle className="text-lg font-semibold text-white">{item.title}</CardTitle>
              <CardDescription className="text-sm text-gray-300">{item.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => navigate(item.navigateTo)}
              className="mt-4 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark"
            >
              {item.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SupportCards;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertTriangle, Briefcase, MessageSquare, Lightbulb, HelpCircle } from "lucide-react";

const functions = [
  {
    icon: Brain,
    title: "Know Your Brain",
    description: "Track social energy cycles, attention patterns, and overwhelm. Discover your unique neurodivergent profile.",
    features: ["Spoon Theory Integration", "Hyperfocus Mapping", "Sensory Profile Building", "Circadian Rhythm Awareness"]
  },
  {
    icon: AlertTriangle,
    title: "Decode Stress & Shutdowns",
    description: "Spot early-warning signs of burnout, sensory overload, or RSD with personalized recovery protocols.",
    features: ["Early Warning System", "Shutdown Recovery Plans", "Sensory Emergency Kit", "Communication Cards"]
  },
  {
    icon: Briefcase,
    title: "Work Fit & Strengths",
    description: "Explore roles that align with how your brain wants to work. Get job hacks and accommodation strategies.",
    features: ["Accommodation Strategist", "Energy Management", "Strengths-Based Career Mapping", "Burnout Prevention"]
  },
  {
    icon: MessageSquare,
    title: "Communicate & Connect",
    description: "Translate your communication style into workplace and personal clarity with boundary scripts.",
    features: ["Conversation Prep", "Boundary Scripts", "Advocacy Training", "Social Energy Budgeting"]
  },
  {
    icon: Lightbulb,
    title: "Live With Clarity",
    description: "Discover your energy sources vs leaks. Support habit creation through routine anchors, not pressure.",
    features: ["Routine Flexibility", "Interest-Based Living", "Environment Optimization", "Purpose Alignment"]
  },
  {
    icon: HelpCircle,
    title: "Ask Anything — Anytime",
    description: "Feel stuck, spun out, or unsure? Get crisis support, reality testing, and executive function coaching.",
    features: ["Crisis Support", "Reality Testing", "Executive Function Coaching", "Decision Support"]
  }
];

const CoreFunctions = () => {
  return (
    <section className="py-20 bg-sora-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              Core Functions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Six powerful ways SORA supports your neurodivergent journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {functions.map((func, index) => (
            <Card key={index} className="group hover:shadow-soft transition-all duration-300 border-none bg-gradient-card">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sora-teal/20 to-sora-orange/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <func.icon className="w-6 h-6 text-sora-teal" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2 group-hover:text-sora-teal transition-colors">
                    {func.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {func.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {func.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-sora-teal mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFunctions;
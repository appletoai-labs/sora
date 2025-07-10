import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Users, Heart, Shield, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Neurodivergence is Natural",
    description: "Your brain differences are variations, not deficits"
  },
  {
    icon: Sparkles,
    title: "Strengths-Based Approach",
    description: "Focus on what you do well, not what you struggle with"
  },
  {
    icon: Users,
    title: "Autonomy & Choice",
    description: "You're the expert on your own experience"
  },
  {
    icon: Shield,
    title: "Accommodations Are Rights",
    description: "You deserve support to function at your best"
  }
];

const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Understanding Meets{" "}
                <span className="bg-gradient-to-r from-calm-purple to-soft-blue bg-clip-text text-transparent">
                  Action
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                SORA is your dedicated neurodivergent companion—designed to understand the unique 
                rhythms, patterns, and needs of ADHD and autistic minds.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">What makes SORA different:</h3>
              <div className="space-y-3">
                {[
                  "Direct & Clear communication—no flowery language",
                  "Pattern Recognition that learns your unique profile",
                  "Non-Judgmental space to unmask safely",
                  "Sensory-aware responses based on your state"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gentle-green flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Experience SORA
            </Button>
          </div>

          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">Core Values</h3>
              <p className="text-muted-foreground">The principles that guide every interaction</p>
            </div>
            
            <div className="grid gap-6">
              {values.map((value, index) => (
                <Card key={index} className="group hover:shadow-card transition-all duration-300 border-none bg-gradient-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-calm-purple/20 to-soft-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="w-5 h-5 text-calm-purple" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2 group-hover:text-calm-purple transition-colors">
                          {value.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
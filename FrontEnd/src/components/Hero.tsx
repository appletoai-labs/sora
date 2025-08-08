import { Button } from "@/components/ui/button";
import { Heart, Shield } from "lucide-react";
import heroImage from "@/assets/hero-brain.jpg";
import SoraLogo from "@/components/SoraLogo";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-sora-dark py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center mb-6">
                <SoraLogo size="large" className="text-sora-teal" />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
                <span className="bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
                  Thrive in Your Own Rhythm
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Your 24/7 AI companion designed for ADHD + Autism.
                Not here to "fix" you, but to help you work <em>with</em> your brain, not against it.
              </p>
              <p className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent text-xl font-semibold  mb-2 text-base italic text-muted-foreground leading-relaxed max-w-lg">
                Every interaction builds your personal research. Six months of conversations = A lifetime of self-understanding.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-sora-teal" />
                <span>Non-judgmental</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sora-orange" />
                <span>Safe space to unmask</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                Start Your Research
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => navigate("/learn-more")}
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-float">
              <img
                src={heroImage}
                alt="Abstract brain illustration representing neurodivergent support"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sora-teal/20 to-transparent" />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-sora-teal to-sora-orange rounded-full opacity-80 animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-sora-orange to-sora-teal rounded-full opacity-60 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
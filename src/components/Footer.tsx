import { Brain, Heart, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-calm-purple to-soft-blue flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SORA</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your neurodivergent journey deserves a companion who truly gets it.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-gentle-green" />
              <span>Made with understanding</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Core Functions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Know Your Brain</li>
              <li>Decode Stress & Shutdowns</li>
              <li>Work Fit & Strengths</li>
              <li>Communicate & Connect</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Community Guidelines</li>
              <li>Crisis Resources</li>
              <li>Professional Integration</li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Privacy & Trust</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-soft-blue" />
                Tiered Privacy Model
              </li>
              <li>Data Protection</li>
              <li>Terms of Service</li>
              <li>Accessibility</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 SORA. Built for neurodivergent minds, by understanding hearts.
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-calm-purple">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <div className="text-sm text-muted-foreground">
                🧠 Neurodivergence is natural
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
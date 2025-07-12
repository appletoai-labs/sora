import { Heart, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import SoraLogo from "@/components/SoraLogo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-sora-muted border-t border-sora-teal/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <SoraLogo className="text-foreground" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your neurodivergent journey deserves a companion who truly gets it.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-sora-teal" />
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
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/privacy" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-sora-teal transition-colors"
                >
                  <Shield className="w-3 h-3 text-sora-orange" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-muted-foreground hover:text-sora-teal transition-colors"
                >
                  Data Protection
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-sora-teal transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-sora-teal transition-colors"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sora-teal/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 SORA. Built for neurodivergent minds, by understanding hearts.
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-sora-teal">
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
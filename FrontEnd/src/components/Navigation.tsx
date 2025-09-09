import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import SoraLogo from "@/components/SoraLogo";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
 { label: "How It Works", href: "/#functions" },
  { label: "About SORA ALLY", href: "/#about" },
  { label: "For Professionals", href: "/#integration" },
    { label: "Privacy", href: "/privacy" },
    { label: "Dashboard", href: "/app" },
    { label: "Donations", href: "/donation" },

  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sora-dark/90 backdrop-blur-md border-b border-sora-teal/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <SoraLogo className="text-foreground" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-sora-teal transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Auth Button / User Dropdown */}
          <div className="hidden md:block relative">
            {!user ? (
              <Button variant="hero" size="sm" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-sora-teal"
                >
                  <span>{user.firstName || user.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-36 bg-background border border-muted rounded-md shadow-lg z-50">
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-foreground hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-sora-teal/20 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-sora-teal transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {!user ? (
                <Button variant="hero" size="sm" className="self-start" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Signed in as: <br />
                    <span className="font-medium">{user.firstName || user.email}</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

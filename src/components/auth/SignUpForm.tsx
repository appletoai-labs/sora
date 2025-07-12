import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, Heart, Stethoscope } from "lucide-react";
import { signUpSchema, type SignUpFormData } from "@/lib/validation";
import { PasswordStrength } from "@/components/ui/password-strength";
import { authLimiter, sanitizeInput } from "@/lib/security";

const accountTypes = [
  {
    value: "individual",
    label: "Individual",
    description: "Personal neurodivergent support",
    icon: UserCheck,
  },
  {
    value: "therapy_client",
    label: "Therapy Client",
    description: "Guided experience with professional support",
    icon: Heart,
  },
  {
    value: "therapist",
    label: "Therapist",
    description: "Professional tools for client management",
    icon: Stethoscope,
  },
];

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    try {
      // Sanitize inputs
      const sanitizedData = {
        firstName: sanitizeInput(formData.firstName),
        lastName: sanitizeInput(formData.lastName),
        email: sanitizeInput(formData.email),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accountType as "individual" | "therapy_client" | "therapist"
      };

      signUpSchema.parse(sanitizedData);
      return null;
    } catch (error: any) {
      if (error.errors) {
        return error.errors[0].message;
      }
      return "Validation error";
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Rate limiting check
    const clientId = `signup_${formData.email}`;
    if (!authLimiter.isAllowed(clientId, 3, 15 * 60 * 1000)) { // 3 attempts per 15 minutes
      const remainingTime = authLimiter.getRemainingTime(clientId, 15 * 60 * 1000);
      setError(`Too many signup attempts. Please try again in ${Math.ceil(remainingTime / 60000)} minutes.`);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/verify-email`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.accountType,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        // If email confirmation is disabled, redirect immediately
        if (data.session) {
          navigate("/app");
        } else {
          // If email confirmation is enabled, redirect to verification page
          navigate("/verify-email");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const selectedAccountType = accountTypes.find(type => type.value === formData.accountType);

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="First name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Create a password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Create a secure password"
          minLength={8}
          required
        />
        {formData.password && (
          <PasswordStrength password={formData.password} />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Account Type</Label>
        <Select value={formData.accountType} onValueChange={(value) => handleInputChange("accountType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your account type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map((type) => {
              const Icon = type.icon;
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        {selectedAccountType && (
          <div className="p-3 bg-muted/50 rounded-md border">
            <div className="flex items-center gap-2 mb-1">
              <selectedAccountType.icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedAccountType.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{selectedAccountType.description}</p>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
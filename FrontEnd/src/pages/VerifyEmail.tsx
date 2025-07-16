import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is coming from email confirmation link
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'signup') {
      handleEmailConfirmation();
    }

    // Check if user is already verified
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email_confirmed_at) {
        navigate('/app', { replace: true });
      }
    });
  }, [searchParams, navigate]);

  const handleEmailConfirmation = async () => {
    setVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: searchParams.get('token') || '',
        type: 'signup'
      });

      if (error) {
        setError(error.message);
        return;
      }

      toast({
        title: "Email verified successfully!",
        description: "Welcome to SORA. You can now access your dashboard.",
      });

      navigate('/app', { replace: true });
    } catch (err) {
      setError("Failed to verify email. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const resendVerificationEmail = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      setVerificationSent(true);
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            SORA
          </h1>
          <p className="text-muted-foreground mt-2">
            Neurodivergent support platform
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {verificationSent && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Verification email sent! Please check your inbox.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or request a new one.
              </p>
              
              <Button 
                onClick={resendVerificationEmail} 
                disabled={loading || verificationSent}
                className="w-full"
                variant="outline"
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Button 
                onClick={handleSignOut}
                variant="ghost"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
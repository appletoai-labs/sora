import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User as UserIcon, Heart, Stethoscope } from "lucide-react";

type UserRole = "individual" | "therapy_client" | "therapist";

interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

const AppDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "individual":
        return UserIcon;
      case "therapy_client":
        return Heart;
      case "therapist":
        return Stethoscope;
      default:
        return UserIcon;
    }
  };

  const getRoleLabel = (role: UserRole) => {
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

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "individual":
        return "Personal neurodivergent support";
      case "therapy_client":
        return "Guided experience with professional support";
      case "therapist":
        return "Professional tools for client management";
      default:
        return "";
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Will redirect to auth
  }

  const RoleIcon = getRoleIcon(profile.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <header className="border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              SORA
            </h1>
            <span className="text-muted-foreground">Dashboard</span>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <RoleIcon className="h-6 w-6 text-primary" />
                Welcome, {profile.first_name}!
              </CardTitle>
              <CardDescription>
                You're signed in as a {getRoleLabel(profile.role)} - {getRoleDescription(profile.role)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account Type:</strong> {getRoleLabel(profile.role)}</p>
                <p><strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Your personalized SORA experience is being prepared based on your account type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is where your {getRoleLabel(profile.role).toLowerCase()} dashboard will be. 
                More features are coming soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AppDashboard;
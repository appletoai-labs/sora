import { Shield, Lock, Eye, Database, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Shield className="w-16 h-16 text-sora-teal mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Privacy & Trust
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your neurodivergent journey is deeply personal. We've built SORA with privacy-first principles 
                to ensure your data is protected and your trust is earned.
              </p>
            </div>
          </div>
        </section>

        {/* Tiered Privacy Model */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Tiered Privacy Model
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-sora-teal/20">
                  <CardContent className="p-6">
                    <Lock className="w-8 h-8 text-sora-orange mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Personal Vault</h3>
                    <p className="text-muted-foreground">
                      Your deepest thoughts, sensory experiences, and personal reflections 
                      stay completely private - never shared, never analyzed by others.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-sora-teal/20">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-sora-teal mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Therapeutic Sharing</h3>
                    <p className="text-muted-foreground">
                      Choose what to share with your therapist or support team. 
                      You control the narrative and timing of disclosure.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-sora-teal/20">
                  <CardContent className="p-6">
                    <Eye className="w-8 h-8 text-sora-purple mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Anonymous Insights</h3>
                    <p className="text-muted-foreground">
                      Contribute to neurodivergent research through completely 
                      anonymized data that helps improve understanding.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Data Protection Principles
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Database className="w-6 h-6 text-sora-teal mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Encryption at Rest & Transit</h3>
                    <p className="text-muted-foreground">
                      All your data is encrypted using industry-standard AES-256 encryption, 
                      both when stored and when transmitted between your device and our servers.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Shield className="w-6 h-6 text-sora-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Zero Knowledge Architecture</h3>
                    <p className="text-muted-foreground">
                      Your personal vault data is encrypted with keys only you control. 
                      Even SORA staff cannot access your most sensitive information.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Lock className="w-6 h-6 text-sora-purple mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Minimal Data Collection</h3>
                    <p className="text-muted-foreground">
                      We only collect data necessary to provide SORA's core functions. 
                      No tracking, no surveillance, no unnecessary data harvesting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rights & Control */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Your Rights & Control
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What You Can Do</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-teal rounded-full mt-2"></div>
                      Access all your data in a portable format
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-teal rounded-full mt-2"></div>
                      Delete your account and all associated data
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-teal rounded-full mt-2"></div>
                      Modify privacy settings at any time
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-teal rounded-full mt-2"></div>
                      Choose what data to share and with whom
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Our Commitments</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-orange rounded-full mt-2"></div>
                      Never sell your personal data
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-orange rounded-full mt-2"></div>
                      Transparent about any data sharing
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-orange rounded-full mt-2"></div>
                      Regular security audits and updates
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sora-orange rounded-full mt-2"></div>
                      Immediate notification of any breaches
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-muted-foreground mb-8">
                We believe transparency builds trust. If you have any questions about 
                how we protect your data or handle your privacy, we're here to help.
              </p>
              <Button className="bg-sora-teal hover:bg-sora-teal/90">
                Contact Our Privacy Team
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
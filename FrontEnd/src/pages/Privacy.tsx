import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  FileText,
  Download,
  Edit,
  Trash2,
  Pause,
  Ban,
  CheckCircle,
  AlertTriangle,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Shield className="w-12 h-12 md:w-16 md:h-16 text-sora-teal mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Your Research. Your Data. Your Control.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                At SORA Ally, your personal neurodivergent research belongs entirely to YOU. We don't sell your data,
                create marketing profiles, or share your insights with anyone. Your conversations build YOUR codex, for
                YOUR benefit alone.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Promise */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Our Privacy Promise</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-sora-teal/20 hover:border-sora-teal/40 transition-colors">
                  <CardContent className="p-6">
                    <Database className="w-8 h-8 text-sora-teal mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Your Data = Your Research</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlike other platforms, SORA Ally transforms YOUR conversations into YOUR personal research. Every
                      insight belongs to you—not us.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-orange/20 hover:border-sora-orange/40 transition-colors">
                  <CardContent className="p-6">
                    <Shield className="w-8 h-8 text-sora-orange mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Zero Data Sales</h3>
                    <p className="text-sm text-muted-foreground">
                      We will never sell, rent, or share your personal information with third parties. Your
                      neurodivergent journey is private.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-purple/20 hover:border-sora-purple/40 transition-colors">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-sora-purple mb-4" />
                    <h3 className="text-lg font-semibold mb-3">No Marketing Profiles</h3>
                    <p className="text-sm text-muted-foreground">
                      We don't build advertising profiles or target you with ads. Your vulnerabilities aren't our
                      marketing opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-teal/20 hover:border-sora-teal/40 transition-colors">
                  <CardContent className="p-6">
                    <Lock className="w-8 h-8 text-sora-teal mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Purpose-Built Privacy</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is used for one purpose only: building your personalized neurodivergent research
                      profile. Nothing more, nothing less.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What We Collect */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">What We Collect & Why</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-sora-teal" />
                      Conversation Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        What
                      </Badge>
                      <p className="text-sm text-muted-foreground">Your chats with SORA Ally</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Why
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        To identify patterns and build your personal research profile
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Control
                      </Badge>
                      <p className="text-sm text-muted-foreground">Export or delete all conversations anytime</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-sora-orange" />
                      Usage Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        What
                      </Badge>
                      <p className="text-sm text-muted-foreground">How you interact with SORA Ally</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Why
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        To improve your experience and identify what works for your brain
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Control
                      </Badge>
                      <p className="text-sm text-muted-foreground">Opt out of usage analytics anytime</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-sora-purple" />
                      Research Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        What
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Patterns and insights SORA Ally identifies about you
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Why
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        To build your comprehensive neurodivergent profile
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Control
                      </Badge>
                      <p className="text-sm text-muted-foreground">Edit, export, or delete insights as you choose</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* What We DON'T Collect */}
              <Card className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl border border-red-500/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-semibold">
                    What We DON'T Collect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm bg-red-700/50 rounded-lg p-3 border-l-4 border-red-300 backdrop-blur-sm">
                      <Ban className="w-4 h-4 text-red-100" />
                      <span className="text-red-100">No browsing history from other websites</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-red-700/50 rounded-lg p-3 border-l-4 border-red-300 backdrop-blur-sm">
                      <Ban className="w-4 h-4 text-red-100" />
                      <span className="text-red-100">No social media monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-red-700/50 rounded-lg p-3 border-l-4 border-red-300 backdrop-blur-sm">
                      <Ban className="w-4 h-4 text-red-100" />
                      <span className="text-red-100">No location tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-red-700/50 rounded-lg p-3 border-l-4 border-red-300 backdrop-blur-sm">
                      <Ban className="w-4 h-4 text-red-100" />
                      <span className="text-red-100">No contact information harvesting</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-red-700/50 rounded-lg p-3 border-l-4 border-red-300 backdrop-blur-sm">
                      <Ban className="w-4 h-4 text-red-100" />
                      <span className="text-red-100">No health records access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-red-700/50 rounded-lg p-3 border-l-4 border-red-300 backdrop-blur-sm">
                      <Ban className="w-4 h-4 text-red-100" />
                      <span className="text-red-100">No financial information beyond payments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Professional Integration */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Professional Integration Privacy
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Therapist/Coach Dashboard Sharing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Default: Complete Privacy
                      </Badge>
                      <p className="text-sm text-muted-foreground">No data shared by default</p>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Opt-in Only
                      </Badge>
                      <p className="text-sm text-muted-foreground">You control exactly what gets shared</p>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Granular Control
                      </Badge>
                      <p className="text-sm text-muted-foreground">Share metrics only, never conversation content</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What Professionals See (If You Choose)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Aggregate patterns only</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Progress metrics and completion rates</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm">General energy and mood trends</span>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-2">
                      <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                      <span className="text-sm">Never personal conversation content</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Ban className="w-4 h-4 text-red-500 mt-0.5" />
                      <span className="text-sm">Never crisis details or emotional content</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Your Data Rights */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Your Data Rights</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-sora-teal/20">
                  <CardContent className="p-6">
                    <Eye className="w-8 h-8 text-sora-teal mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Right to Know</h3>
                    <p className="text-sm text-muted-foreground">
                      Request a complete report of all data we have about you, how it's used, and who has access.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-orange/20">
                  <CardContent className="p-6">
                    <Download className="w-8 h-8 text-sora-orange mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Right to Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Download all your conversations, insights, and research data in readable formats anytime.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-purple/20">
                  <CardContent className="p-6">
                    <Edit className="w-8 h-8 text-sora-purple mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Right to Correct</h3>
                    <p className="text-sm text-muted-foreground">
                      Edit or correct any insights or patterns that don't accurately represent your experience.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-teal/20">
                  <CardContent className="p-6">
                    <Trash2 className="w-8 h-8 text-sora-teal mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Right to Delete</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data—we'll confirm deletion within 30 days.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-orange/20">
                  <CardContent className="p-6">
                    <Pause className="w-8 h-8 text-sora-orange mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Right to Pause</h3>
                    <p className="text-sm text-muted-foreground">
                      Temporarily suspend data processing while keeping your account active.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sora-purple/20">
                  <CardContent className="p-6">
                    <Ban className="w-8 h-8 text-sora-purple mb-4" />
                    <h3 className="text-lg font-semibold mb-3">Right to Restrict</h3>
                    <p className="text-sm text-muted-foreground">
                      Limit how your data is processed or used for specific purposes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Crisis Support & Privacy */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Crisis Support & Privacy
              </h2>
              <Card className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl border border-amber-400/40 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white text-xl font-semibold">
                    <AlertTriangle className="w-6 h-6 text-white" />
                    Mental Health Emergencies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* What We Do */}
                    <div className="bg-amber-700/40 rounded-lg p-4 border-l-4 border-amber-200 backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-2">What We Do:</h4>
                      <ul className="space-y-1 text-sm text-amber-100">
                        <li>• Suggest professional resources during crisis situations</li>
                        <li>• Maintain the same privacy standards during difficult moments</li>
                        <li>• Provide support resources while respecting your autonomy</li>
                      </ul>
                    </div>

                    {/* What We DON'T Do */}
                    <div className="bg-amber-700/40 rounded-lg p-4 border-l-4 border-amber-200 backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-2">What We DON'T Do:</h4>
                      <ul className="space-y-1 text-sm text-amber-100">
                        <li>• Automatically contact emergency services</li>
                        <li>• Share crisis conversations without your explicit consent</li>
                        <li>• Override your privacy during emergencies</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Simple Privacy Summary */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Background gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-sora-teal/20 via-sora-purple/10 to-sora-orange/20" />

          {/* Radial glow accents */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-sora-teal/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-sora-purple/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-sora-orange/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
                Simple Privacy Summary
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Card 1 */}
                <Card className="bg-gray-900/70 dark:bg-gray-800/70 backdrop-blur-md border border-sora-teal/40 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-3xl font-extrabold text-sora-teal mb-3">1</div>
                    <p className="text-base font-semibold text-white">Your conversations = Your research</p>
                    <p className="text-sm text-gray-300">(not our business intelligence)</p>
                  </CardContent>
                </Card>

                {/* Card 2 */}
                <Card className="bg-gray-900/70 dark:bg-gray-800/70 backdrop-blur-md border border-sora-orange/40 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-3xl font-extrabold text-sora-orange mb-3">2</div>
                    <p className="text-base font-semibold text-white">Zero data sales</p>
                    <p className="text-sm text-gray-300">(your vulnerabilities aren't our revenue)</p>
                  </CardContent>
                </Card>

                {/* Card 3 */}
                <Card className="bg-gray-900/70 dark:bg-gray-800/70 backdrop-blur-md border border-sora-purple/40 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-3xl font-extrabold text-sora-purple mb-3">3</div>
                    <p className="text-base font-semibold text-white">You control professional sharing</p>
                    <p className="text-sm text-gray-300">(opt-in only, metrics not conversations)</p>
                  </CardContent>
                </Card>

                {/* Card 4 */}
                <Card className="bg-gray-900/70 dark:bg-gray-800/70 backdrop-blur-md border border-sora-teal/40 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-3xl font-extrabold text-sora-teal mb-3">4</div>
                    <p className="text-base font-semibold text-white">Delete anytime</p>
                    <p className="text-sm text-gray-300">(your data, your choice)</p>
                  </CardContent>
                </Card>

                {/* Card 5 (wider) */}
                <Card className="bg-gray-900/70 dark:bg-gray-800/70 backdrop-blur-md border border-sora-orange/40 rounded-xl shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-2">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-3xl font-extrabold text-sora-orange mb-3">5</div>
                    <p className="text-base font-semibold text-white">Built for neurodivergent privacy needs</p>
                    <p className="text-sm text-gray-300">(we understand why privacy matters to you)</p>
                  </CardContent>
                </Card>


              </div>

              <div className="text-lg font-semibold text-foreground">
                We exist to help you research yourself, not to research you for others.
              </div>
            </div>
          </div>
        </section>



        {/* Contact */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Contact & Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-sora-teal" />
                      Privacy Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Email
                      </Badge>
                      <p className="text-sm">privacy@soraally.com</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Response Time
                      </Badge>
                      <p className="text-sm text-muted-foreground">Within 48 hours for privacy inquiries</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Data Protection Officer
                      </Badge>
                      <p className="text-sm text-muted-foreground">Available for GDPR and complex privacy questions</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-sora-orange" />
                      Your Privacy Advocate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">We have a dedicated privacy advocate who:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sora-orange rounded-full mt-2"></div>
                        Ensures your rights are protected
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sora-orange rounded-full mt-2"></div>
                        Helps resolve privacy concerns
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sora-orange rounded-full mt-2"></div>
                        Advocates for user privacy in all company decisions
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-sora-orange rounded-full mt-2"></div>
                        Available for confidential privacy discussions
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <p className="text-muted-foreground mb-6">
                  Questions about privacy? We're here to help. Your privacy isn't just a policy to us—it's fundamental
                  to your neurodivergent research journey.
                </p>
                <a href="mailto:privacy@soraally.com">
                  <Button className="bg-sora-teal hover:bg-sora-teal/90 text-white">
                    Contact Our Privacy Team
                  </Button>
                </a>

              </div>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <section className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground space-y-2">
              <div className="flex flex-wrap justify-center gap-4">
                <span>Last Updated: January 2025</span>
                <span>•</span>
                <span>Effective Date: January 2025</span>
                <span>•</span>
                <span>Version: 1.0</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Privacy

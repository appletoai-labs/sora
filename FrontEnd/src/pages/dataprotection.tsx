import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Lock,
  Eye,
  Download,
  Trash2,
  Pause,
  Check,
  Users,
  Globe,
  Mail,
  FileText,
  Heart,
  UserCheck,
  Settings,
  Server,
  Key,
  Zap,
  CheckCircle,
  Clock,
  FileCheck,
  Building,
  GraduationCap,
  ScrollText,
  MapPin,
  TrendingUp,
} from "lucide-react"

const DataProtection = () => {
  return (
    <div className="min-h-screen bg-sora-dark text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-20">
          <div className="inline-flex items-center gap-2 bg-sora-teal/20 px-4 py-2 rounded-full mb-6">
            <Shield className="h-5 w-5 text-sora-teal" />
            <span className="text-sora-teal font-medium">Data Protection Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            🔐{" "}
            <span className="bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              SORA Ally
            </span>{" "}
            Data Protection Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            At SORA Ally, we don't just promise privacy—we{" "}
            <strong className="text-sora-teal">engineer data protection</strong> into everything we build. This page
            explains the concrete safeguards, compliance measures, and technical standards that protect your
            neurodivergent research data.
          </p>
        </div>

        {/* Data Protection Principles */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Our Data Protection Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-sora-card border-sora-teal/30 hover:border-sora-teal/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-sora-teal text-lg">
                  <UserCheck className="h-6 w-6" />
                  User Ownership First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">You own your data. We protect it.</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-sora-orange/30 hover:border-sora-orange/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-sora-orange text-lg">
                  <Eye className="h-6 w-6" />
                  Minimum Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Only collect what's necessary, nothing more.</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-sora-purple/30 hover:border-sora-purple/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-sora-purple text-lg">
                  <Shield className="h-6 w-6" />
                  End-to-End Safeguards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Encryption, access controls, and audits everywhere.</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-blue-400/30 hover:border-blue-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-400 text-lg">
                  <FileText className="h-6 w-6" />
                  Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">You always know how and where your data is handled.</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-green-400/30 hover:border-green-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-400 text-lg">
                  <CheckCircle className="h-6 w-6" />
                  Compliance by Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">GDPR, CCPA, and global standards integrated.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Safeguards */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Technical Safeguards</h2>
          <div className="space-y-6">
            <Card className="bg-sora-card border-l-4 border-l-sora-teal">
              <CardHeader>
                <CardTitle className="text-sora-teal flex items-center gap-2">
                  <Lock className="h-6 w-6" />🔒 Encryption Everywhere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-sora-teal text-sora-dark">AES-256</Badge>
                    <span className="text-sm text-gray-300">encryption for stored data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-sora-teal text-sora-dark">TLS 1.3</Badge>
                    <span className="text-sm text-gray-300">for all in-transit communication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-sora-teal text-sora-dark">Zero plaintext</Badge>
                    <span className="text-sm text-gray-300">storage of conversations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-l-4 border-l-sora-orange">
              <CardHeader>
                <CardTitle className="text-sora-orange flex items-center gap-2">
                  <Key className="h-6 w-6" />🛡 Authentication & Access Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">Multi-factor authentication for internal systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">
                      Role-based access: only those with a need-to-know can see limited datasets
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">Automatic session expiry & login protections</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-l-4 border-l-sora-purple">
              <CardHeader>
                <CardTitle className="text-sora-purple flex items-center gap-2">
                  <Server className="h-6 w-6" />🏰 Infrastructure Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">
                      Hosting in SOC 2 Type II and ISO 27001-certified environments
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">
                      Firewalls, intrusion detection, and automated monitoring
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">Regular third-party penetration tests</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Organizational Safeguards */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Organizational Safeguards</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-sora-card border-sora-teal/30">
              <CardHeader>
                <CardTitle className="text-sora-teal flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  👩‍💻 Employee Training
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">• Mandatory data protection training for all team members</p>
                <p className="text-sm text-gray-300">• Annual refreshers on privacy laws and security best practices</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-sora-orange/30">
              <CardHeader>
                <CardTitle className="text-sora-orange flex items-center gap-2">
                  <ScrollText className="h-5 w-5" />📜 Policies & Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">• Internal Data Handling Policy enforced across all teams</p>
                <p className="text-sm text-gray-300">• Quarterly audits of access logs and permissions</p>
                <p className="text-sm text-gray-300">• Automatic revocation of access when roles change</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-sora-purple/30">
              <CardHeader>
                <CardTitle className="text-sora-purple flex items-center gap-2">
                  <Building className="h-5 w-5" />🧾 Vendor Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">
                  • Third parties must meet or exceed SORA Ally security standards
                </p>
                <p className="text-sm text-gray-300">
                  • Contracts include data protection clauses and no secondary use of data
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Compliance & Legal Framework */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Compliance & Legal Framework</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-sora-card border-l-4 border-l-blue-400">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  GDPR (EU Users)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">
                  • <strong className="text-sora-teal">Lawful basis:</strong> Legitimate Interest in personalized
                  support
                </p>
                <p className="text-sm text-gray-300">• Right to access, correction, deletion, and portability</p>
                <p className="text-sm text-gray-300">• EU Data Protection Officer (DPO) available for escalation</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-l-4 border-l-yellow-400">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  CCPA (California Users)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">• No sale of personal information</p>
                <p className="text-sm text-gray-300">• Right to know what's collected and request deletion</p>
                <p className="text-sm text-gray-300">• Same rights extended to all users globally</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-l-4 border-l-green-400 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  HIPAA-Inspired Protections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">
                  • While not a medical service, we implement HIPAA-like safeguards
                </p>
                <p className="text-sm text-gray-300">
                  • Especially relevant for sensitive neurodivergent conversations
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* User Control Features */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">User Control Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-sora-card border-sora-teal/30 hover:shadow-lg hover:border-sora-teal/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sora-teal">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">Download all conversations and insights anytime</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-red-400/30 hover:shadow-lg hover:border-red-400/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Trash2 className="h-5 w-5" />
                  Delete Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">Permanent deletion within 30 days</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-yellow-400/30 hover:shadow-lg hover:border-yellow-400/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Pause className="h-5 w-5" />
                  Pause Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">Stop AI analysis without losing past data</p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-sora-purple/30 hover:shadow-lg hover:border-sora-purple/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sora-purple">
                  <Settings className="h-5 w-5" />
                  Granular Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">Choose exactly what to share with professionals</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Incident Response */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Incident Response</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-sora-card border-l-4 border-l-red-400">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />⏱ Rapid Response Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">• Security incidents investigated within 24 hours</p>
                <p className="text-sm text-gray-300">
                  • Users notified of breaches within 72 hours (as required by GDPR)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sora-card border-l-4 border-l-sora-teal">
              <CardHeader>
                <CardTitle className="text-sora-teal flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />📝 Incident Log
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">• Every attempted access or anomaly is logged</p>
                <p className="text-sm text-gray-300">• Logs reviewed continuously by the privacy & security team</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Residency */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Data Residency</h2>
          <Card className="bg-gradient-to-r from-sora-card to-sora-muted border-sora-orange/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-sora-orange mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-2">Primary Storage</h4>
                  <p className="text-sm text-gray-300">[specify cloud region, e.g. US or EU]</p>
                </div>
                <div className="text-center">
                  <Globe className="h-8 w-8 text-sora-teal mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-2">Regional Options</h4>
                  <p className="text-sm text-gray-300">Data residency options for users in EU and other regions</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-sora-purple mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-2">Cross-Border Transfers</h4>
                  <p className="text-sm text-gray-300">No transfers without legal safeguards (SCCs/DPAs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ongoing Improvements */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Ongoing Improvements</h2>
          <Card className="bg-gradient-to-r from-sora-teal/20 to-sora-purple/20 border-none">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-sora-teal" />
                  <span className="text-gray-300">Annual third-party audits</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-sora-orange" />
                  <span className="text-gray-300">Continuous vulnerability scanning</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-sora-purple" />
                  <span className="text-gray-300">
                    Open communication with our community about new security features
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact DPO */}
        <section className="mb-16">
          <Card className="bg-sora-card border-sora-teal/30">
            <CardHeader>
              <CardTitle className="text-center text-sora-teal flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Our Data Protection Officer (DPO)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Mail className="h-8 w-8 text-sora-teal mx-auto mb-2" />
                  <p className="text-sm text-gray-300">📧 Email: privacy@sora-ally.com</p>
                </div>
                <div>
                  <Clock className="h-8 w-8 text-sora-orange mx-auto mb-2" />
                  <p className="text-sm text-gray-300">⏱ Response within: 48 hours</p>
                </div>
                <div>
                  <UserCheck className="h-8 w-8 text-sora-purple mx-auto mb-2" />
                  <p className="text-sm text-gray-300">
                    👤 Data Protection Officer: Available for GDPR, compliance, and complex queries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-sora-teal/20 via-sora-orange/20 to-sora-purple/20 border-none">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center text-white">Summary: Our Promise to You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Your research is encrypted, protected, and under your control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">
                      We follow global best practices (GDPR, CCPA, SOC 2, HIPAA-like standards)
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">No hidden access, no data sales, no compromises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-gray-300">
                      Your trust is our foundation. Protecting your data isn't just compliance—it's our mission.
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <p className="italic">
            Your trust is our foundation. Protecting your data isn't just compliance—it's our mission.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DataProtection

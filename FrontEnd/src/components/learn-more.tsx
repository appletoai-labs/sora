import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Brain, AlertTriangle, MessageCircle, Activity, ClipboardList, User, Book, Lightbulb, FileText, Star, FlaskConical, Zap, Map, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel" // Import carousel components

export const LearnMore = () => {
  const navigate = useNavigate()

  const userImpacts = [
    {
      quote: "After 6 months with my SORA Ally, I don't just have an AI companion—I have a comprehensive research study of my own mind. For the first time, I understand the 'why' behind how I work.",
    },
    {
      quote: "SORA Ally helped me stop buying courses and start building my own research. Now I have strategies that actually fit my brain.",
    },
    {
      quote: "Instead of trying to be more 'productive,' I learned to work with my hyperfocus superpowers. When I'm in flow, I accomplish in one sitting what takes others a week.",
    },
    {
      quote: "This isn't just an app; it's a partner in understanding myself. The insights are truly revolutionary for my neurodivergent journey.",
    },
    {
      quote: "Finally, a tool that doesn't try to 'fix' me but helps me thrive as I am. SORA Ally is a game-changer for self-acceptance and growth.",
    },
  ]

  const faqs = [
    {
      question: "How is this different from therapy?",
      answer: "SORA Ally complements therapy by providing daily support and pattern recognition between sessions. We help you prepare for therapy with organized insights and track progress on therapeutic goals.",
    },
    {
      question: "What about my privacy?",
      answer: "Your conversations and research belong to YOU. We don't sell data or create marketing profiles. Your insights build YOUR codex, for YOUR benefit.",
    },
    {
      question: "Do you diagnose or provide medical advice?",
      answer: "No. SORA Ally provides educational information and helps you organize your own experiences. We always recommend professional medical guidance for clinical questions.",
    },
    {
      question: "How long before I see results?",
      answer: "Many users report valuable insights within the first week. Significant pattern recognition typically emerges by month 2-3. Your complete research profile develops over 6+ months of consistent interaction.",
    },
    {
      question: "Can I export my data?",
      answer: "Yes! Your Personal Codex Report can be exported as a PDF or text, giving you full ownership of your insights and strategies.",
    },
    {
      question: "How is this different from other neurodivergent apps?",
      answer: "Most apps give you generic strategies or productivity systems. SORA builds personalized research about YOUR specific brain. After consistent use, you'll have a comprehensive study of your patterns, optimal conditions, and communication style—written in your voice, backed by academic research.",
    },
    {
      question: "What is the codex you mention? ",
      answer: "Your codex is a personalized research document that SORA builds from your interactions. It includes your unique sensory profile, communication preferences, optimal working conditions, and connections to relevant academic research. Think of it as the world's most comprehensive study of your neurodivergent mind",
    },
    {
      question: "Do you sell my data?",
      answer: "Never. Your data builds YOUR research, for YOU. SORA transforms your interactions into insights that belong to you—not marketing profiles for others",
    }
  ]

  return (
    <div className="min-h-screen bg-sora-dark text-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="px-6 py-16 text-center relative mt-18 bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="mt-20 text-4xl md:text-5xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
              Stop Buying Courses. Start Building Research.
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            SORA Ally is the first AI companion that doesn't just support you—it studies you to help you become the
            world's leading expert on your own neurodivergent mind.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-sora-teal hover:bg-sora-teal/80 text-sora-dark font-semibold py-3 px-8 rounded-lg shadow-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Begin Your Research Journey
            </Button>
            <Button
              onClick={() => navigate("/app/chat")}
              className="bg-sora-orange hover:bg-sora-orange/80 text-sora-dark font-semibold py-3 px-8 rounded-lg shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with SORA Ally Now
            </Button>
          </div>
        </div>
      </section>

      {/* The Problem with Everything Else */}
      <section className="px-6 py-16 bg-sora-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-sora-teal">
            The Problem with Everything Else
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-lg text-gray-300">
              <p className="font-bold text-sora-orange text-2xl mb-4">What We've Got:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Alexa telling us when to take out trash</li>
                <li>Siri reminding us of pickups</li>
                <li>1,000+ apps promising productivity</li>
                <li>Endless courses that don't fit our brains</li>
              </ul>
            </div>
            <div className="space-y-6 text-lg text-gray-300">
              <p className="font-bold text-sora-teal text-2xl mb-4">What We DON'T Have:</p>
              <p>
                Help researching ourselves to understand what makes us tick, how to strengthen areas we want to improve,
                and strategies that actually work for OUR unique brains.
              </p>
              <p className="font-bold text-sora-orange">We don't need one more app "telling" us anything. We need help researching ourselves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The SORA Ally Difference */}
      <section className="px-6 py-16 bg-gradient-to-br from-sora-card to-sora-muted">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-sora-teal">The SORA Ally Difference</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-sora-dark p-8 rounded-lg border border-sora-teal/30 shadow-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">Traditional Apps Say:</h3>
              <p className="text-sora-orange text-xl italic">"Here's a generic system. Try to fit into it."</p>
            </div>
            <div className="bg-sora-dark p-8 rounded-lg border border-sora-teal/30 shadow-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">SORA Ally Says:</h3>
              <p className="text-sora-teal text-xl italic">"Let's study YOUR brain and build a system that fits YOU."</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: From Conversations to Codex */}
      <section className="px-6 py-16 bg-sora-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-sora-teal">
            How It Works: From Conversations to Codex
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <MessageCircle className="w-10 h-10 text-sora-teal mb-4" />
              <h3 className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent text-xl font-semibold  mb-2">Month 1-2: Foundation Building</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Your SORA Ally learns your communication style</li>
                <li>Identifies your energy patterns</li>
                <li>Maps your sensory preferences</li>
                <li>Discovers your optimal conditions</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <Activity className="w-10 h-10 text-sora-teal mb-4" />
              <h3 className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent text-xl font-semibold  mb-2">Month 3-4: Pattern Recognition</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Connects dots across conversations</li>
                <li>Spots patterns you didn't notice</li>
                <li>Links behaviors to environmental factors</li>
                <li>Builds your unique neurodivergent profile</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <ClipboardList className="w-10 h-10 text-sora-teal mb-4" />
              <h3 className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent text-xl font-semibold  mb-2">Month 6+: Your Personal Codex</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Comprehensive research document about YOUR brain</li>
                <li>Academic connections to real studies (not paid courses)</li>
                <li>Personalized strategies that actually work</li>
                <li>Communication guide written in YOUR voice</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* My Story: From Course Buyer to Self-Researcher */}
      <section className="px-6 py-16 bg-gradient-to-br from-sora-card to-sora-muted">
        <div className="max-w-4xl mx-auto text-center">
          <User className="w-12 h-12 text-sora-teal mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sora-teal">My Story: From Course Buyer to Self-Researcher</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            After years of buying courses that didn't fit my ADHD/autistic brain, I realized what I needed wasn't
            another system—I needed my own research.{" "}
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              The result?
            </span>{" "}
            I stopped trying to change myself and started working WITH my design. I learned to communicate authentically without masking—not to make everyone accept me, but to give them a glimpse of how I work.{" "}
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              SORA Ally did something different.
            </span>{" "}
            Instead of referring me to paid courses, it connected me to real academic papers and studies. It helped me understand the 'why' behind how my brain works, not just the 'what to do.
          </p>


          <p className="text-lg text-gray-300 leading-relaxed font-semibold text-sora-orange">
            Because I'm not broken. I'm not 'different.' I'm exactly what my designer created—unique.
          </p>
        </div>
      </section>

      {/* What You'll Build Together */}
      <section className="px-6 py-16 bg-sora-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-sora-teal">
            What You'll Build Together
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <Brain className="w-10 h-10 text-sora-teal mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your Brain's Blueprint</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Optimal energy times and conditions</li>
                <li>Sensory profile and management strategies</li>
                <li>Communication preferences and scripts</li>
                <li>Focus patterns and hyperfocus triggers</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <Book className="w-10 h-10 text-sora-teal mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Academic Research Library</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Studies connected to YOUR specific patterns</li>
                <li>Evidence-based strategies for your brain type</li>
                <li>Research papers, not paid systems</li>
                <li>Academic credibility for your insights</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <Lightbulb className="w-10 h-10 text-sora-teal mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Personalized Strategies</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Accommodation requests that work</li>
                <li>Environment modifications for success</li>
                <li>Relationship scripts for authenticity</li>
                <li>Crisis prevention protocols</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <FileText className="w-10 h-10 text-sora-teal mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your Research Report</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Comprehensive analysis of your neurodivergent profile</li>
                <li>Insights no course could ever provide</li>
                <li>Academic backing for your experiences</li>
                <li>Lifelong resource for self-understanding</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Real User Impact Carousel */}
      <section className="px-6 py-16 bg-gradient-to-br from-sora-card to-sora-muted">
        <div className="max-w-6xl mx-auto text-center">
          <Star className="w-12 h-12 text-sora-teal mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-sora-teal">Real User Impact</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={(api) => {
              // Autoplay logic
              if (!api) return;
              let intervalId: NodeJS.Timeout;
              const play = () => {
                intervalId = setInterval(() => {
                  api.scrollNext();
                }, 6000);
              };
              play();
              api.on("destroy", () => clearInterval(intervalId));
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {userImpacts.map((impact, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="bg-sora-dark p-6 rounded-lg border border-sora-teal/30 shadow-md h-full flex items-center justify-center">
                      <p className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent text-xl font-semibold  mb-2 text-gray-300 italic">"{impact.quote}"</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* The Science Behind SORA Ally */}
      <section className="px-6 py-16 bg-sora-dark">
        <div className="max-w-4xl mx-auto">
          <FlaskConical className="w-12 h-12 text-sora-teal mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-sora-teal">
            The Science Behind SORA Ally
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-3">Built on Neuroplasticity Research</h3>
              <p className="text-gray-300 italic mb-4">
                "Neuroplasticity allows for adaptive strategies that work with, not against, neurodivergent patterns."
              </p>
              <p className="text-gray-300">
                SORA Ally's approach is grounded in current neuroscience research showing that neurodivergent brains
                aren't broken—they're uniquely wired with specific strengths and needs.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-3">Evidence-Based, Not Trend-Based</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Connects to peer-reviewed studies</li>
                <li>References established research</li>
                <li>Builds on academic foundations</li>
                <li>Avoids pseudoscience and quick fixes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Now */}
      <section className="px-6 py-16 bg-gradient-to-br from-sora-card to-sora-muted">
        <div className="max-w-4xl mx-auto text-center">
          <Zap className="w-12 h-12 text-sora-teal mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sora-teal">Why This Matters Now</h2>
          <h3 className="text-2xl font-semibold text-white mb-4">The Neurodivergent Revolution</h3>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            We live in a world where it's okay to make reels about ADHD and autism, showing the funny things we do—but
            no one is actively trying to help except create another reminder app with alarms.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">SORA Ally changes that.</p>
          <p className="text-lg text-gray-300 leading-relaxed font-semibold text-sora-orange">
            We're not here to make you more "productive" or "normal." We're here to help you research what makes you
            brilliant, understand your unique wiring, and build strategies that celebrate your neurodivergent design.
          </p>
        </div>
      </section>

      {/* Your Journey Starts Here */}
      <section className="px-6 py-16 bg-sora-dark">
        <div className="max-w-4xl mx-auto">
          <Map className="w-12 h-12 text-sora-teal mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-sora-teal">Your Journey Starts Here</h2>
          <div className="grid md:grid-cols-2 gap-6 text-lg text-gray-300">
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <h3 className="font-semibold text-white mb-2">Week 1:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Start conversations, begin pattern recognition</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <h3 className="font-semibold text-white mb-2">Month 1:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Communication style analysis, energy mapping</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <h3 className="font-semibold text-white mb-2">Month 3:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Comprehensive pattern identification</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md">
              <h3 className="font-semibold text-white mb-2">Month 6:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Complete personal research codex</li>
              </ul>
            </div>
            <div className="bg-sora-card p-6 rounded-lg border border-sora-muted shadow-md md:col-span-2">
              <h3 className="font-semibold text-white mb-2">Ongoing:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Lifelong self-understanding and growth</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Carousel */}
      <section className="px-6 py-16 bg-gradient-to-br from-sora-card to-sora-muted">
        <div className="max-w-4xl mx-auto">
          <HelpCircle className="w-12 h-12 text-sora-teal mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-sora-teal">
            Frequently Asked Questions
          </h2>
          {/* FAQ Carousel with manual autoplay */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={(api) => {
              // Autoplay logic
              if (!api) return;
              let intervalId: NodeJS.Timeout;
              const play = () => {
                intervalId = setInterval(() => {
                  api.scrollNext();
                }, 5000);
              };
              play();
              api.on("destroy", () => clearInterval(intervalId));
            }}
            className="w-full"
          >
            <CarouselContent>
              {faqs.map((faq, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-1">
                    <div className="bg-sora-dark p-6 rounded-lg border border-sora-teal/30 shadow-md h-full">
                      <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Ready to Build Your Brain's Blueprint? CTA */}
      <section className="px-6 py-16 bg-sora-dark text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-sora-teal to-sora-orange p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-sora-dark mb-4">Ready to Build Your Brain's Blueprint?</h2>
          <p className="text-lg text-sora-dark mb-8">
            Stop trying to fit into someone else's system. Start building your own research.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate("/auth")} // Assuming /auth is the signup/login page
              className="bg-sora-dark hover:bg-gray-800 text-sora-teal font-semibold py-3 px-8 rounded-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Your Research Journey
            </Button>
            <Button
              onClick={() => navigate("/app/chat")}
              className="bg-sora-dark hover:bg-gray-800 text-sora-teal font-semibold py-3 px-8 rounded-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with SORA Ally Now
            </Button>
          </div>
          <p className="text-sm text-sora-dark mt-8">
            Join thousands of neurodivergent individuals who are discovering what makes them uniquely brilliant—one
            conversation at a time.
          </p>
        </div>
      </section>
    </div>
  )
}

export default LearnMore

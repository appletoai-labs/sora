import React from "react";
import { 
  Heart, 
  AlertTriangle, 
  Wind, 
  Anchor, 
  MessageCircle, 
  Hand, 
  Brain, 
  Leaf, 
  User, 
  Play, 
  Check, 
  Shield, 
  Sprout, 
  Star, 
  RefreshCw, 
  Sun, 
  Coffee, 
  Smile, 
  Share2, 
  Lightbulb, 
    Activity,
  HandHeart 
} from "lucide-react";

export const ImmediateSupport = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      

      {/* Hero Section */}
      <section className="px-6 py-16 text-center relative mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-red-500 mr-4" />
            <hr />
            <h1 className="text-4xl md:text-5xl font-light">
              <span className="text-cyan-400">You're Going to Be</span>{" "}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Okay</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Take a deep breath. You're safe. You're not alone. These tools
            <br />
            are here to help you right now.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <Heart className="w-4 h-4 text-cyan-400 mr-2" />
              <span className="text-gray-400">Non-judgmental</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-gray-400">Safe space to unmask</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 border border-red-500/30">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-white mr-4" />
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                If you're in immediate danger, please reach out:
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-red-700/50 rounded-lg p-4 border-l-4 border-red-300 backdrop-blur-sm">
                <h3 className="font-semibold text-white mb-1">Crisis Text Line:</h3>
                <p className="text-red-100">Text HOME to 741741</p>
              </div>
              <div className="bg-red-700/50 rounded-lg p-4 border-l-4 border-red-300 backdrop-blur-sm">
                <h3 className="font-semibold text-white mb-1">National Suicide Prevention Lifeline:</h3>
                <p className="text-red-100">988</p>
              </div>
            </div>
            <div className="bg-red-700/50 rounded-lg p-4 border-l-4 border-red-300 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-1">Emergency Services:</h3>
              <p className="text-red-100">911</p>
            </div>
          </div>
        </div>
      </section>

      {/* Immediate Relief Tools */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-cyan-400">
            Immediate Relief Tools
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-gray-800/70 transition-all cursor-pointer backdrop-blur-sm">
              <Wind className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Deep Breathing</h3>
              <p className="text-gray-400">Calm your nervous system in 2 minutes</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-gray-800/70 transition-all cursor-pointer backdrop-blur-sm">
              <Anchor className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">5-4-3-2-1 Grounding</h3>
              <p className="text-gray-400">Reconnect with the present moment</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border-2 border-gray-600/50 hover:border-gray-500 hover:bg-gray-800/50 transition-all cursor-pointer backdrop-blur-sm">
              <MessageCircle className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calming Statements</h3>
              <p className="text-gray-400">Gentle reminders for difficult moments</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border-2 border-gray-600/50 hover:border-gray-500 hover:bg-gray-800/50 transition-all cursor-pointer backdrop-blur-sm">
              <Hand className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sensory Reset</h3>
              <p className="text-gray-400">Quick ways to reduce overwhelm</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-gray-800/70 transition-all cursor-pointer backdrop-blur-sm">
              <Brain className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gentle Distraction</h3>
              <p className="text-gray-400">Redirect your thoughts kindly</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 border-2 border-gray-600/50 hover:border-gray-500 hover:bg-gray-800/50 transition-all cursor-pointer backdrop-blur-sm">
              <Leaf className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Self-Soothing</h3>
              <p className="text-gray-400">Comfort yourself with kindness</p>
            </div>
          </div>
        </div>
      </section>

      {/* Progressive Muscle Relaxation */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <User className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-semibold text-cyan-400">Progressive Muscle Relaxation</h2>
            </div>
            <p className="text-gray-300 mb-6 text-lg">
              Release physical tension by tensing and relaxing different muscle groups.
            </p>
            
            <button className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black px-8 py-3 rounded-lg font-semibold flex items-center mb-8 transition-all">
              <Play className="w-5 h-5 mr-2" />
              Start Guided Relaxation
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">What this involves:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">5-10 minutes of gentle muscle exercises</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Audio-guided instructions</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Can be done sitting or lying down</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Helps release physical stress and anxiety</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gentle Reminders */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-4 text-cyan-400">
            💬 Gentle Reminders
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Sometimes we need to hear these truths, especially when we're struggling.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <Heart className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "This feeling is temporary. It will pass."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "I am safe right now in this moment."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <Sprout className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "I don't have to be perfect. I just have to be here."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <Star className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "I've survived difficult moments before. I can get through this."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <RefreshCw className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "It's okay to ask for help. It's okay to need support."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <Sun className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "I am worthy of kindness, especially from myself."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <Anchor className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "I can take this one breath at a time, one moment at a time."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <Brain className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-gray-300 italic text-center">
                "My brain works differently, and that's not something to fix."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When You're Feeling Better */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="border-l-4 border-green-500 pl-8">
            <div className="flex items-center mb-4">
              <Check className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-semibold text-cyan-400">When You're Feeling Better</h2>
            </div>
            <p className="text-gray-300 mb-12 text-lg">
              Take your time. There's no rush. When you're ready, these gentle next steps might help.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-gray-600/50 backdrop-blur-sm">
                <Coffee className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Basic Self-Care</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Drink some water</li>
                  <li>• Have a small snack if you're hungry</li>
                  <li>• Rest if you need to</li>
                  <li>• Change into comfortable clothes</li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-gray-600/50 backdrop-blur-sm">
                <Smile className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Gentle Reflection</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• What triggered the overwhelm?</li>
                  <li>• What helped you feel better?</li>
                  <li>• What do you need right now?</li>
                  <li>• How can you be kind to yourself?</li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-gray-600/50 backdrop-blur-sm">
                <Share2 className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Moving Forward</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Talk to SORA about what happened</li>
                  <li>• Use clarity tools to break down challenges</li>
                  <li>• Plan some gentle self-care</li>
                  <li>• Remember: you handled this, you're strong</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black px-8 py-3 rounded-lg font-semibold flex items-center transition-all">
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to SORA
              </button>
              <button className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-3 rounded-lg font-semibold flex items-center border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all backdrop-blur-sm">
                <Lightbulb className="w-5 h-5 mr-2" />
                Use Clarity Tools
              </button>
              <button className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-3 rounded-lg font-semibold flex items-center border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all backdrop-blur-sm">
                <HandHeart className="w-5 h-5 mr-2" />
                Sensory Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t border-gray-800">
        <p className="text-gray-400">
          Your 24/7 AI companion designed for ADHD + Autism. Not here to "fix" you, but to help you work with your brain, not against it.
        </p>
      </footer>
    </div>
  );
};

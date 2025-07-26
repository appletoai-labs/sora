const mongoose = require("mongoose")
const EmotionalStrategy = require("../models/EmotionalStrategy")
require("dotenv").config()

const strategies = [
  {
    title: "4-7-8 Breathing Technique",
    description: "A calming breathing technique that activates your parasympathetic nervous system to reduce anxiety.",
    category: "breathing",
    difficulty: "Easy",
    effectiveness: 4,
    steps: [
      "Sit comfortably and place one hand on your chest, one on your belly",
      "Breathe in through your nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale through your mouth for 8 counts",
      "Repeat 3-4 times until you feel calmer",
    ],
    timeNeeded: "2-5 minutes",
    bestUsedWhen: "Feeling anxious, before stressful situations, or when you need quick calm",
    emotions: ["anxious", "overwhelmed", "stressed"],
    intensityRange: { min: 1, max: 10 },
    neurodivergentAdaptations: [
      "Use visual counting aids if needed",
      "Start with shorter counts if 4-7-8 feels overwhelming",
      "Practice in a quiet, familiar environment first",
    ],
  },
  {
    title: "5-4-3-2-1 Grounding Technique",
    description: "A mindfulness technique that brings you back to the present moment by engaging your senses.",
    category: "sensory",
    difficulty: "Easy",
    effectiveness: 5,
    steps: [
      "Look around and name 5 things you can see",
      "Listen and identify 4 things you can hear",
      "Touch and notice 3 things you can feel",
      "Find 2 things you can smell",
      "Think of 1 thing you can taste",
    ],
    timeNeeded: "3-5 minutes",
    bestUsedWhen: "During panic attacks, anxiety spirals, or feeling disconnected",
    emotions: ["anxious", "overwhelmed", "panicked"],
    intensityRange: { min: 6, max: 10 },
    neurodivergentAdaptations: [
      "Adapt for sensory sensitivities - skip overwhelming senses",
      "Use familiar objects for touch if in public",
      "Write down items if verbal processing is difficult",
    ],
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Systematically tense and release muscle groups to reduce physical anxiety and tension.",
    category: "movement",
    difficulty: "Medium",
    effectiveness: 4,
    steps: [
      "Start with your toes - tense for 5 seconds, then relax",
      "Move to your calves - tense and relax",
      "Continue with thighs, abdomen, arms",
      "Finish with shoulders and face muscles",
      "Notice the difference between tension and relaxation",
    ],
    timeNeeded: "10-15 minutes",
    bestUsedWhen: "Before sleep, after stressful days, or when physically tense",
    emotions: ["stressed", "anxious", "overwhelmed"],
    intensityRange: { min: 3, max: 8 },
    neurodivergentAdaptations: [
      "Use guided audio if following steps is difficult",
      "Focus on problem areas rather than full body",
      "Adjust pressure based on sensory preferences",
    ],
  },
  {
    title: "Cognitive Reframing",
    description: "Challenge and reframe negative thought patterns using evidence-based questioning.",
    category: "cognitive",
    difficulty: "Medium",
    effectiveness: 4,
    steps: [
      "Identify the negative thought or belief",
      'Ask: "What evidence supports this thought?"',
      'Ask: "What evidence contradicts this thought?"',
      'Consider: "What would I tell a friend in this situation?"',
      "Create a more balanced, realistic thought",
    ],
    timeNeeded: "5-10 minutes",
    bestUsedWhen: "Stuck in negative thinking patterns or catastrophizing",
    emotions: ["sad", "anxious", "frustrated"],
    intensityRange: { min: 2, max: 7 },
    neurodivergentAdaptations: [
      "Write thoughts down if mental processing is overwhelming",
      "Use concrete examples rather than abstract concepts",
      "Practice with low-stakes situations first",
    ],
  },
  {
    title: "Sensory Self-Soothing Kit",
    description: "Use personalized sensory tools to regulate your nervous system and find calm.",
    category: "sensory",
    difficulty: "Easy",
    effectiveness: 5,
    steps: [
      "Gather your preferred sensory items (fidgets, textures, scents)",
      "Find a quiet, comfortable space",
      "Engage with one sensory tool at a time",
      "Notice how each tool affects your body and mind",
      "Continue until you feel more regulated",
    ],
    timeNeeded: "5-15 minutes",
    bestUsedWhen: "Sensory overload, meltdowns, or need for regulation",
    emotions: ["overwhelmed", "anxious", "frustrated"],
    intensityRange: { min: 4, max: 10 },
    neurodivergentAdaptations: [
      "Customize kit based on your sensory profile",
      "Include both calming and alerting options",
      "Keep portable version for public spaces",
    ],
  },
  {
    title: "Social Battery Check-In",
    description: "Assess and manage your social energy levels to prevent burnout and overwhelm.",
    category: "social",
    difficulty: "Easy",
    effectiveness: 4,
    steps: [
      "Rate your current social energy from 1-10",
      "Identify what has drained your social battery today",
      "Consider what social activities would recharge you",
      "Plan appropriate social boundaries for the rest of the day",
      "Communicate your needs to others if necessary",
    ],
    timeNeeded: "3-5 minutes",
    bestUsedWhen: "Before social events, after social interactions, or feeling drained",
    emotions: ["exhausted", "overwhelmed", "anxious"],
    intensityRange: { min: 1, max: 8 },
    neurodivergentAdaptations: [
      "Use visual scales or apps to track energy",
      "Prepare scripts for communicating boundaries",
      "Plan recovery time after social activities",
    ],
  },
]

async function seedStrategies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing strategies
    await EmotionalStrategy.deleteMany({})
    console.log("Cleared existing strategies")

    // Insert new strategies
    await EmotionalStrategy.insertMany(strategies)
    console.log(`Inserted ${strategies.length} emotional strategies`)

    console.log("Seeding completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedStrategies()

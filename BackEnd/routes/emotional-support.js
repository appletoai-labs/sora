const express = require("express")
const EmotionalStrategy = require("../models/EmotionalStrategy")
const EmotionalEntry = require("../models/EmotionalEntry")
const auth = require("../middleware/auth")
const OpenAI = require("openai")

const router = express.Router()

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Get personalized coping strategies using AI
router.post("/strategies", auth, async (req, res) => {
  try {
    const { emotion, intensity, triggers } = req.body

    if (!emotion || !intensity) {
      return res.status(400).json({ message: "Emotion and intensity are required" })
    }

    // Create AI prompt for generating personalized strategies
    const aiPrompt = `You are SORA, a specialized AI therapist for neurodivergent individuals (ADHD, autism, etc.). 

User's Current State:
- Primary Emotion: ${emotion}
- Intensity Level: ${intensity}/10
- Triggers: ${triggers || "Not specified"}

Generate exactly 4 personalized coping strategies in JSON format. Each strategy should be evidence-based (CBT, DBT, mindfulness) and adapted for neurodivergent minds.

Requirements:
- For intensity 8-10: Focus on immediate, simple techniques
- For intensity 6-7: Include moderate difficulty options
- For intensity 1-5: Can include more complex strategies
- Consider sensory processing differences
- Include executive function support
- Validate neurodivergent experiences

Return ONLY valid JSON in this exact format:
{
  "strategies": [
    {
      "title": "Strategy Name",
      "description": "Brief description of what this strategy does",
      "difficulty": "Easy|Medium|Hard",
      "effectiveness": 4,
      "steps": [
        "Step 1 with clear, specific instructions",
        "Step 2 with timing if relevant",
        "Step 3 with sensory considerations",
        "Step 4 with validation/self-compassion",
        "Step 5 with follow-up action"
      ],
      "timeNeeded": "2-5 minutes",
      "bestUsedWhen": "Specific situations when this works best",
      "category": "breathing|movement|sensory|cognitive|social|mindfulness"
    }
  ],
  "quickAccessTools": [
    {
      "title": "Tool Name",
      "description": "Brief description",
      "icon": "🌬️"
    }
  ]
}

Focus on:
- Immediate relief techniques for high intensity
- Sensory regulation strategies
- Executive function support
- Social energy management
- Validation and self-compassion
- Practical, actionable steps`

    try {
      // Generate strategies using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are SORA, an expert AI therapist specializing in neurodivergent mental health support. You provide evidence-based, personalized coping strategies adapted for ADHD and autistic individuals. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: aiPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const aiResponse = completion.choices[0].message.content

      // Parse AI response
      let parsedResponse
      try {
        parsedResponse = JSON.parse(aiResponse)
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError)
        throw new Error("Invalid AI response format")
      }

      // Validate response structure
      if (!parsedResponse.strategies || !Array.isArray(parsedResponse.strategies)) {
        throw new Error("Invalid strategies format from AI")
      }

      // Save the emotional entry with AI-generated flag
      const emotionalEntry = new EmotionalEntry({
        user: req.userId,
        emotion,
        intensity,
        triggers: triggers || "",
        aiGenerated: true,
        aiResponse: aiResponse,
      })
      await emotionalEntry.save()

      // Optionally save strategies to database for future reference
      const savedStrategies = []
      for (const strategy of parsedResponse.strategies) {
        try {
          const newStrategy = new EmotionalStrategy({
            title: strategy.title,
            description: strategy.description,
            category: strategy.category,
            difficulty: strategy.difficulty,
            effectiveness: strategy.effectiveness,
            steps: strategy.steps,
            timeNeeded: strategy.timeNeeded,
            bestUsedWhen: strategy.bestUsedWhen,
            emotions: [emotion],
            intensityRange: {
              min: Math.max(1, intensity - 2),
              max: Math.min(10, intensity + 2),
            },
            generatedByAI: true,
            aiPromptUsed: aiPrompt,
          })

          const saved = await newStrategy.save()
          savedStrategies.push({
            id: saved._id,
            ...strategy,
          })
        } catch (saveError) {
          console.error("Error saving strategy:", saveError)
          // Continue with other strategies
          savedStrategies.push({
            id: `temp_${Date.now()}_${Math.random()}`,
            ...strategy,
          })
        }
      }

      // Return the AI-generated strategies
      res.json({
        strategies: savedStrategies,
        quickAccessTools: parsedResponse.quickAccessTools || getDefaultQuickAccessTools(intensity),
        emotionalEntryId: emotionalEntry._id,
        aiGenerated: true,
      })
    } catch (aiError) {
      console.error("OpenAI API error:", aiError)

      // Fallback to default strategies if AI fails
      const fallbackStrategies = await getFallbackStrategies(emotion, intensity)
      const quickAccessTools = getDefaultQuickAccessTools(intensity)

      const emotionalEntry = new EmotionalEntry({
        user: req.userId,
        emotion,
        intensity,
        triggers: triggers || "",
        aiGenerated: false,
      })
      await emotionalEntry.save()

      res.json({
        strategies: fallbackStrategies,
        quickAccessTools,
        emotionalEntryId: emotionalEntry._id,
        aiGenerated: false,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("Get strategies error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's emotional history
router.get("/history", auth, async (req, res) => {
  try {
    const { days = 30 } = req.query
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(days))

    const entries = await EmotionalEntry.find({
      user: req.userId,
      createdAt: { $gte: startDate },
    })
      .populate("strategiesUsed.strategyId", "title category")
      .sort({ createdAt: -1 })

    res.json(entries)
  } catch (error) {
    console.error("Get emotional history error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update strategy effectiveness
router.post("/strategy-feedback", auth, async (req, res) => {
  try {
    const { emotionalEntryId, strategyId, effectiveness, completed, notes } = req.body

    const entry = await EmotionalEntry.findOne({
      _id: emotionalEntryId,
      user: req.userId,
    })

    if (!entry) {
      return res.status(404).json({ message: "Emotional entry not found" })
    }

    // Update or add strategy feedback
    const existingStrategyIndex = entry.strategiesUsed.findIndex((s) => s.strategyId.toString() === strategyId)

    if (existingStrategyIndex >= 0) {
      entry.strategiesUsed[existingStrategyIndex] = {
        ...entry.strategiesUsed[existingStrategyIndex],
        effectiveness,
        completed,
        notes,
      }
    } else {
      entry.strategiesUsed.push({
        strategyId,
        effectiveness,
        completed,
        notes,
      })
    }

    await entry.save()
    res.json({ message: "Feedback recorded successfully" })
  } catch (error) {
    console.error("Strategy feedback error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get emotional insights
router.get("/insights", auth, async (req, res) => {
  try {
    const entries = await EmotionalEntry.find({ user: req.userId }).sort({ createdAt: -1 }).limit(100)

    // Calculate insights
    const insights = {
      totalEntries: entries.length,
      averageIntensity: entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length || 0,
      mostCommonEmotion: getMostCommonEmotion(entries),
      intensityTrend: getIntensityTrend(entries),
      commonTriggers: getCommonTriggers(entries),
      strategyEffectiveness: getStrategyEffectiveness(entries),
      aiGeneratedPercentage: (entries.filter((e) => e.aiGenerated).length / entries.length) * 100 || 0,
    }

    res.json(insights)
  } catch (error) {
    console.error("Get insights error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper functions
function getDefaultQuickAccessTools(intensity) {
  const allTools = [
    {
      title: "4-7-8 Breathing",
      description: "Immediate calm",
      icon: "🌬️",
    },
    {
      title: "5-4-3-2-1 Grounding",
      description: "Present moment focus",
      icon: "👁️",
    },
    {
      title: "Self-Compassion",
      description: "Gentle self-talk",
      icon: "💝",
    },
    {
      title: "Muscle Relaxation",
      description: "Release tension",
      icon: "🧘",
    },
  ]

  // Adjust tools based on intensity
  if (intensity >= 8) {
    return allTools.slice(0, 2) // Only breathing and grounding for high intensity
  } else if (intensity >= 6) {
    return allTools.slice(0, 3) // Add self-compassion for moderate intensity
  }

  return allTools // All tools for lower intensity
}

async function getFallbackStrategies(emotion, intensity) {
  // Try to find existing strategies first
  const existingStrategies = await EmotionalStrategy.find({
    emotions: { $regex: new RegExp(emotion, "i") },
    "intensityRange.min": { $lte: intensity },
    "intensityRange.max": { $gte: intensity },
    isActive: true,
  }).limit(4)

  if (existingStrategies.length > 0) {
    return existingStrategies.map((strategy) => ({
      id: strategy._id,
      title: strategy.title,
      description: strategy.description,
      difficulty: strategy.difficulty,
      effectiveness: strategy.effectiveness,
      steps: strategy.steps,
      timeNeeded: strategy.timeNeeded,
      bestUsedWhen: strategy.bestUsedWhen,
      category: strategy.category,
    }))
  }

  // Return hardcoded fallback strategies
  return [
    {
      id: "fallback_1",
      title: "4-7-8 Breathing Technique",
      description:
        "A calming breathing technique that activates your parasympathetic nervous system to reduce anxiety.",
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
      category: "breathing",
    },
    {
      id: "fallback_2",
      title: "5-4-3-2-1 Grounding",
      description: "A mindfulness technique that brings you back to the present moment by engaging your senses.",
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
      category: "sensory",
    },
  ]
}

function getMostCommonEmotion(entries) {
  if (entries.length === 0) return "No data"

  const emotionCounts = {}
  entries.forEach((entry) => {
    emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1
  })

  return Object.keys(emotionCounts).reduce((a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b))
}

function getIntensityTrend(entries) {
  if (entries.length < 2) return "stable"

  const recent = entries.slice(0, 7)
  const older = entries.slice(7, 14)

  if (older.length === 0) return "stable"

  const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length
  const olderAvg = older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length

  if (recentAvg > olderAvg + 0.5) return "increasing"
  if (recentAvg < olderAvg - 0.5) return "decreasing"
  return "stable"
}

function getCommonTriggers(entries) {
  const triggers = entries
    .filter((entry) => entry.triggers)
    .map((entry) => entry.triggers.toLowerCase())
    .join(" ")

  if (!triggers) return []

  const words = triggers.split(/\s+/).filter((word) => word.length > 3)
  const wordCounts = {}

  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })

  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
}

function getStrategyEffectiveness(entries) {
  const strategyStats = {}

  entries.forEach((entry) => {
    entry.strategiesUsed.forEach((strategy) => {
      if (strategy.effectiveness) {
        if (!strategyStats[strategy.strategyId]) {
          strategyStats[strategy.strategyId] = {
            totalRating: 0,
            count: 0,
          }
        }
        strategyStats[strategy.strategyId].totalRating += strategy.effectiveness
        strategyStats[strategy.strategyId].count += 1
      }
    })
  })

  return Object.entries(strategyStats).map(([strategyId, stats]) => ({
    strategyId,
    averageEffectiveness: stats.totalRating / stats.count,
    usageCount: stats.count,
  }))
}

module.exports = router

const { openai } = require("../config/openai")

// Helper to safely extract the first JSON object from a string
function extractJSON(text) {
  const jsonStart = text.indexOf("{")
  const jsonEnd = text.lastIndexOf("}")
  if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found in response.")
  const jsonString = text.slice(jsonStart, jsonEnd + 1)
  return JSON.parse(jsonString)
}

async function generateRoutine(routineType, preferences = "") {
  const routineTypeMap = {
    morning: "Morning Routine",
    evening: "Evening/Bedtime Routine",
    work: "Work/Study Routine",
    selfcare: "Self-Care Routine",
    cleaning: "Cleaning/Household Routine",
    exercise: "Exercise/Movement Routine",
    social: "Social Energy Management",
    custom: "Custom Routine",
  }

  const routineTypeName = routineTypeMap[routineType] || "Custom Routine"

  const prompt = `
You are an expert in neurodivergent-friendly routine creation. Create a personalized ${routineTypeName} that works with neurodivergent brains, not against them.

Routine Type: ${routineTypeName}
User Preferences/Needs: ${preferences || "No specific preferences provided"}

Create a routine that includes:
- Realistic time estimates
- Built-in flexibility options
- Sensory considerations
- Energy management
- Transition support

Respond in JSON format:
{
  "routine_title": "Your Personalized Neurodivergent-Friendly ${routineTypeName}",
  "routine_type": "${routineType}",
  "steps": [
    {
      "time": "7:00 AM",
      "duration": "(15 minutes)",
      "title": "Wake Up & Gentle Start",
      "description": "Allow for slow waking up, use a calming alarm sound or a light-based alarm.",
      "flexibility_options": [
        "Snooze for 5 more minutes if needed",
        "Use soothing music if the light-based alarm isn't enough"
      ]
    }
  ],
  "sensory_breaks": [
    "Sit in a quiet space for 5 minutes",
    "Use noise-cancelling headphones if the environment is overwhelming",
    "Take deep breaths or practice grounding exercises"
  ],
  "tips_for_success": [
    "Prepare as much as you can the night before to ease into the morning.",
    "Use a visual schedule or checklist to keep track of your routine.",
    "Be kind to yourself and allow for variations in the routine based on how you feel each day."
  ]
}

Make sure the routine is:
- Neurodivergent-friendly with built-in accommodations
- Flexible and adaptable
- Includes sensory considerations
- Has realistic time estimates
- Provides multiple options for different energy levels
- Includes transition support
`

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  })

  const content = response.choices[0].message.content
  return extractJSON(content)
}

async function generateRoutineFromBrainDump(brainDumpText) {
  const prompt = `
You are an expert in neurodivergent-friendly routine creation. The user has done a "brain dump" of everything on their mind. Analyze this text and create a personalized routine that addresses their needs, concerns, and challenges.

Brain Dump Text: ${brainDumpText}

Based on this brain dump, create a routine that:
- Addresses the specific challenges mentioned
- Works with neurodivergent brains
- Includes built-in flexibility
- Considers energy levels and sensory needs
- Provides structure while allowing adaptability

Respond in JSON format:
{
  "routine_title": "Your Personalized Routine Based on Your Brain Dump",
  "routine_type": "custom",
  "steps": [
    {
      "time": "Start Time",
      "duration": "(estimated time)",
      "title": "Step Title",
      "description": "Detailed description of what to do",
      "flexibility_options": [
        "Alternative option 1",
        "Alternative option 2"
      ]
    }
  ],
  "sensory_breaks": [
    "Sensory break option 1",
    "Sensory break option 2"
  ],
  "tips_for_success": [
    "Success tip 1",
    "Success tip 2"
  ]
}

Make the routine specifically tailored to address what the user shared in their brain dump.
`

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  })

  const content = response.choices[0].message.content
  return extractJSON(content)
}

module.exports = {
  generateRoutine,
  generateRoutineFromBrainDump,
}

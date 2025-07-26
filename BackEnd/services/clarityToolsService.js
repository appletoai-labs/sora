const { openai } = require("../config/openai");

// Helper to safely extract the first JSON object from a string
function extractJSON(text) {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found in response.");
  const jsonString = text.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonString);
}

async function getTaskBreakdown(taskDescription, userContext = null) {
  const prompt = `
You are a productivity assistant. Break down the following task into clear, manageable steps. 
Include step number, description, estimated time, tools needed, potential challenges, and solutions.

Task: ${taskDescription}

Respond in JSON format like this:
{
  "task_title": "...",
  "steps": [
    {
      "step_number": 1,
      "description": "...",
      "estimated_time": "...",
      "tools_needed": ["..."],
      "potential_challenges": ["..."],
      "solutions": ["..."]
    }
  ],
  "total_estimated_time": "...",
  "difficulty_level": "..."
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  return extractJSON(content);
}

async function getOverwhelmSupport(situation, triggers = []) {
  const prompt = `
You are a mental wellness assistant. The user is feeling overwhelmed. Provide support strategies.
Situation: ${situation}
Triggers: ${triggers.join(", ")}

Respond in JSON format:
{
  "immediate_actions": ["..."],
  "grounding_techniques": ["..."],
  "sensory_strategies": ["..."],
  "next_steps": ["..."],
  "affirmation": "..."
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  return extractJSON(content);
}

module.exports = {
  getTaskBreakdown,
  getOverwhelmSupport,
};

const AcademicConnection = require("../models/AcademicConnection");
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


/**
 * Searches for academic references based on a query using OpenAI.
 * Note: This function generates fictional academic references as OpenAI does not have real-time access to research databases.
 * It's intended for demonstration or conceptual purposes.
 * @param {string} query - The user's search query for academic references.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of academic reference objects.
 */
// Your async function
async function searchAcademicReferences(query) {
    const prompt = `Based on the query "${query}", find 3-5 academic research paper references from web.
  Each reference should include a title, a list of 1-3 author names, a concise summary (2-4 sentences).
  Focus on topics relevant to neurodiversity, cognitive science, psychology, or related fields if the query allows.
  Ensure the output is a JSON array of objects, each with 'title', 'authors', 'summary', and 'sourceUrl' fields.
  `;

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            instructions: prompt,
            input: prompt,
            tools: [{ type: "web_search_preview" }],
        });

        // The text result is in response.choices[0].message.content
        const rawText = response.output_text;

        if (!rawText) {
            console.warn("Warning: OpenAI response content is empty or undefined:", response);
            return [];
        }

        // Extract JSON part from the response (between ```json and ```)
        const jsonMatch = rawText.match(/```json([\s\S]*?)```/);
        if (!jsonMatch) {
            console.warn("No JSON block found in OpenAI response");
            return [];
        }

        const jsonString = jsonMatch[1].trim();

        // Now parse JSON safely
        const parsed = JSON.parse(jsonString);

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Error generating academic references with OpenAI Responses API:", error);
        return [];
    }
}


/**
 * Saves an academic connection for a user.
 * @param {string} userId - The ID of the user.
 * @param {Object} connectionData - The academic connection data (title, summary, authors, sourceUrl).
 * @returns {Promise<Object>} A promise that resolves to the saved academic connection.
 */
async function saveAcademicConnection(userId, connectionData) {
    const newConnection = new AcademicConnection({
        userId,
        title: connectionData.title,
        summary: connectionData.summary,
        authors: connectionData.authors || [],
        sourceUrl: connectionData.sourceUrl || "",
    })
    await newConnection.save()
    return newConnection
}

/**
 * Retrieves all saved academic connections for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of saved academic connections.
 */
async function getAcademicConnections(userId) {
    const connections = await AcademicConnection.find({ userId }).sort({ createdAt: -1 })
    return connections
}


module.exports = {
    getAcademicConnections,
    searchAcademicReferences,
    saveAcademicConnection,
}
require("dotenv").config();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function getFinalAnswer(query, context) {
  const prompt = `
        Based *only* on the following news articles, please provide a concise answer to the user's question.
        If the answer cannot be found in the articles, say "I could not find information about that in the news articles."

        Context from News Articles:
        ---
        ${context}
        ---

        User Question: "${query}"

        Answer:
    `;

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

module.exports = { getFinalAnswer };

require("dotenv").config();

const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const MODEL = "jina-embeddings-v2-base-en";

async function getEmbeddings(texts) {
  try {
    const { JinaClient } = require("@jinaai/node-sdk");
    const jina = new JinaClient({
      headers: {
        "x-api-key": process.env.JINA_API_KEY,
      },
    });
    const response = await jina.embed({ texts, model: MODEL });
    return response.results.map((r) => r.embedding);
  } catch (error) {
    console.warn(
      "Jina SDK not found or failed. Falling back to direct API call."
    );

    const response = await fetch(JINA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      },
      body: JSON.stringify({
        input: texts,
        model: MODEL,
      }),
    });

    if (!response.ok) {
      throw new Error(`Jina API fetch error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((item) => item.embedding);
  }
}

module.exports = { getEmbeddings };

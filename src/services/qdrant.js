const { QdrantClient } = require("@qdrant/js-client-rest");
require("dotenv").config();

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "news_articles";

async function searchQdrant(queryEmbedding) {
  const results = await qdrant.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: 3,
    with_payload: true,
  });

  return results.map((result) => result.payload.content).join("\n\n---\n\n");
}

module.exports = { searchQdrant, COLLECTION_NAME, qdrant };

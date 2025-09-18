const express = require("express");
const { getEmbeddings } = require("../services/jina");
const { searchQdrant } = require("../services/qdrant");
const { getFinalAnswer } = require("../services/gemini");
const { getHistory, addToHistory, clearHistory } = require("../services/redis");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.get("/session", (req, res) => {
  res.json({ sessionId: uuidv4() });
});

router.post("/chat", async (req, res) => {
  const { query, sessionId } = req.body;

  if (!query || !sessionId) {
    return res.status(400).json({ error: "Query and sessionId are required." });
  }

  try {
    const [queryEmbedding] = await getEmbeddings([query]);
    const context = await searchQdrant(queryEmbedding);
    const answer = await getFinalAnswer(query, context);

    await addToHistory(sessionId, { user: query, bot: answer });

    res.json({ answer });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
});

router.get("/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const history = await getHistory(sessionId);
  res.json(history);
});

router.post("/clear/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  await clearHistory(sessionId);
  res.status(200).json({ message: "Session cleared successfully." });
});

module.exports = router;

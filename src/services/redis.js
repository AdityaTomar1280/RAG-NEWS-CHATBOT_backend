const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

const HISTORY_TTL_SECONDS = 3600;

async function addToHistory(sessionId, message) {
  const key = `session:${sessionId}`;
  await client.lPush(key, JSON.stringify(message));
  await client.expire(key, HISTORY_TTL_SECONDS);
}

async function getHistory(sessionId) {
  const key = `session:${sessionId}`;
  const history = await client.lRange(key, 0, -1);
  return history.map((item) => JSON.parse(item)).reverse();
}

async function clearHistory(sessionId) {
  const key = `session:${sessionId}`;
  await client.del(key);
}

module.exports = { addToHistory, getHistory, clearHistory };

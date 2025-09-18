require("dotenv").config();
const { getEmbeddings } = require("../services/jina");
const { qdrant, COLLECTION_NAME } = require("../services/qdrant");
const Parser = require("rss-parser");
const { v4: uuidv4 } = require("uuid");

const RSS_FEED_URL = "http://rss.cnn.com/rss/cnn_topstories.rss";
const BATCH_SIZE = 10;

function stripHtml(html) {
  return html ? html.replace(/<[^>]*>?/gm, "") : "";
}

async function main() {
  console.log("Starting news ingestion...");
  const collections = await qdrant.getCollections();
  if (!collections.collections.some((c) => c.name === COLLECTION_NAME)) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: 768, distance: "Cosine" }, // jina-embeddings-v2-base-en size
    });
    console.log(`Collection "${COLLECTION_NAME}" created.`);
  }

  const parser = new Parser();
  const feed = await parser.parseURL(RSS_FEED_URL);
  const articles = feed.items.slice(0, 50);
  console.log(`Fetched ${articles.length} articles.`);

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    console.log(`- Processing batch ${i / BATCH_SIZE + 1}...`);

    const textsToEmbed = batch.map((article) => {
      const content = stripHtml(
        article.content || article.contentSnippet || ""
      );
      return `${article.title}: ${content}`;
    });

    const embeddings = await getEmbeddings(textsToEmbed);

    const points = embeddings.map((embedding, index) => ({
      id: uuidv4(),
      vector: embedding,
      payload: {
        title: batch[index].title,
        content: textsToEmbed[index],
        url: batch[index].link,
      },
    }));

    await qdrant.upsert(COLLECTION_NAME, { wait: true, points });
  }

  console.log("Ingestion complete!");
}

main().catch(console.error);

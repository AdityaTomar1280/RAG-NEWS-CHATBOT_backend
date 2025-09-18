# News RAG Agent - Backend

A Node.js backend service that powers a Retrieval-Augmented Generation (RAG) news chatbot. This service processes user queries by retrieving relevant news articles and generating contextual responses using AI.

## Features

- **RAG Pipeline**: Retrieves relevant news articles using vector similarity search
- **AI Integration**: Uses Google Gemini 2.0 Flash for intelligent responses
- **Vector Search**: Leverages Qdrant for efficient similarity search
- **Session Management**: Redis-backed chat history and session storage
- **News Ingestion**: Automated RSS feed processing and indexing
- **RESTful API**: Clean API endpoints for frontend integration

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **Google Gemini 2.0 Flash** - Large language model
- **Jina AI** - Embeddings generation (jina-embeddings-v2-base-en)
- **Qdrant** - Vector database for similarity search
- **Redis** - Session storage and caching
- **RSS Parser** - News feed ingestion

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd news-rag-agent/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:

   ```env
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key
   JINA_API_KEY=your_jina_api_key
   QDRANT_API_KEY=your_qdrant_api_key
   QDRANT_URL=your_qdrant_url
   REDIS_URL=your_redis_url

   # Server Configuration
   PORT=3001
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### Session Management

- `GET /api/session` - Create a new chat session
- `GET /api/history/:sessionId` - Get chat history for a session
- `POST /api/clear/:sessionId` - Clear session history

### Chat Processing

- `POST /api/chat` - Process user query and return AI response
  ```json
  {
    "query": "What's the latest news about AI?",
    "sessionId": "uuid-session-id"
  }
  ```

## RAG Pipeline Flow

1. **Query Processing**: User query is received via API
2. **Embedding Generation**: Query is converted to vector using Jina AI
3. **Vector Search**: Similar articles are retrieved from Qdrant
4. **Context Building**: Retrieved articles are formatted as context
5. **AI Generation**: Gemini generates response based on context
6. **Session Storage**: Query and response are stored in Redis
7. **Response**: Generated answer is returned to frontend

## Data Ingestion

### Running the Ingestion Script

```bash
node src/scripts/ingest.js
```

This script:

- Fetches news from CNN RSS feed
- Processes and cleans article content
- Generates embeddings using Jina AI
- Stores vectors and metadata in Qdrant
- Handles batch processing for efficiency

### Supported News Sources

- CNN Top Stories RSS feed
- Easily extensible to other RSS sources

## Services Overview

### Gemini Service (`services/gemini.js`)

- Integrates with Google Gemini 2.0 Flash
- Generates contextual responses
- Handles API errors gracefully

### Jina Service (`services/jina.js`)

- Converts text to embeddings
- Uses jina-embeddings-v2-base-en model
- Fallback to direct API calls if SDK fails

### Qdrant Service (`services/qdrant.js`)

- Vector similarity search
- Configurable result limits
- Payload extraction for context

### Redis Service (`services/redis.js`)

- Session-based chat history
- TTL-based expiration (1 hour)
- JSON serialization for complex data

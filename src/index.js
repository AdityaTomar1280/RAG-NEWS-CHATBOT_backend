// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./api/chat");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

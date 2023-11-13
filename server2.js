const express = require("express");
const http = require("http");
const { fetchData } = require("./controllers/instrumentController");
const path = require("path");
const WebSocket = require("ws"); // Import the 'ws' library
const cors = require("cors");

const app = express();
const port = process.env.ENDPOINT_PORT || 5001;
const server = http.createServer(app);

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

const wss = new WebSocket.Server({ server }); // Initialize WebSocket

const allowedOrigins = ["https://xyz.com", "http://localhost:3000"];

// Use the cors middleware with specific options
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});
app.use(express.static(path.resolve(__dirname, "client")));

wss.on("connection", (ws) => {
  // Change 'socket' to 'ws'
  fetchData();
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Handle incoming WebSocket messages from clients
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

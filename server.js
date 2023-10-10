const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public"))); // to serve our HTML and JS files

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

wss.on("connection", (ws) => {
  console.log("Client connected");
});

app.get("/trigger-refresh", (req, res) => {
  // Send a message to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ refresh: true }));
    }
  });

  res.send("Triggered Refresh");
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

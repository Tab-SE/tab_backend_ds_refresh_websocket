const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// to serve our HTML, JS files, and favicon
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const BROADCAST_TO_ALL = false; // This still exists in case you ever want to revert to broadcasting to all.

let clientMap = new Map();
let clientsToRefresh = new Set();

wss.on("connection", (ws) => {
  const clientUUID = uuidv4();
  clientMap.set(clientUUID, ws);
  ws.send(JSON.stringify({ uuid: clientUUID }));
  console.log(`Client connected with UUID: ${clientUUID}`);
});

app.get("/trigger-refresh", (req, res) => {
  if (BROADCAST_TO_ALL) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ refresh: true }));
      }
    });
  } else {
    clientsToRefresh.forEach((uuid) => {
      const client = clientMap.get(uuid);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ refresh: true }));
      }
    });
  }

  res.send("Triggered Refresh");
});

app.get("/add-to-refresh-list/:uuid", (req, res) => {
  const { uuid } = req.params;
  clientsToRefresh.add(uuid);
  res.send(`Added UUID: ${uuid} to the refresh list.`);
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

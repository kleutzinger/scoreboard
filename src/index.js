const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

// Connect to SQLite database
const db = new Database(":memory:");

// Create a table to store room state data
db.exec(`CREATE TABLE IF NOT EXISTS roomState (
  roomId TEXT PRIMARY KEY,
  state TEXT
)`);

// Load default state from default_state.json
const defaultState = JSON.parse(
  fs.readFileSync(__dirname + "/default_state.json", "utf8"),
);

// Serve Vue.js app
app.use(express.static("public"));

// HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

// Map to store WebSocket connections by room ID
const roomConnections = new Map();

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  // Extract room ID from URL
  const roomId = req.url.split("/")[1];

  // Store WebSocket connection in the map based on room ID
  if (!roomConnections.has(roomId)) {
    roomConnections.set(roomId, new Set());
  }
  roomConnections.get(roomId).add(ws);

  // Handle messages from the client
  ws.on("message", (message) => {
    // Broadcast message to all clients in the same room
    const connectionsInRoom = roomConnections.get(roomId);
    for (const client of connectionsInRoom) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    roomConnections.get(roomId).delete(ws);
    if (roomConnections.get(roomId).size === 0) {
      roomConnections.delete(roomId);
    }
  });
});

// Endpoint to retrieve state for a specific room
app.get("/getState/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const stmt = db.prepare("SELECT state FROM roomState WHERE roomId = ?");
  const row = stmt.get(roomId);

  if (row) {
    // If the row exists, return the parsed JSON state
    res.json(JSON.parse(row.state));
  } else {
    // If the row doesn't exist, set the initial state and return it
    const stmtInsert = db.prepare(
      "INSERT INTO roomState (roomId, state) VALUES (?, ?)",
    );
    stmtInsert.run(roomId, JSON.stringify(defaultState));
    res.json(defaultState);
  }
});

// Endpoint to update state for a specific room
app.post("/updateState/:roomId", express.json(), (req, res) => {
  const roomId = req.params.roomId;
  const state = req.body;

  const stmt = db.prepare(
    "REPLACE INTO roomState (roomId, state) VALUES (?, ?)",
  );
  stmt.run(roomId, JSON.stringify(state));

  res.json({ status: "success", data: state });
});

// Fallback route to serve the Vue.js app
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

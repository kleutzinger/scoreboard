const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

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

// Socket.IO server
const io = socketIo(server);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    console.log("Client", socket.id, "joined room:", roomId);
    socket.join(roomId);
  });

  // Handle state updates
  socket.on("updateState", ({ roomId, state }) => {
    console.log("Received state update for room", roomId);
    // Update state in the database
    const stmt = db.prepare(
      "REPLACE INTO roomState (roomId, state) VALUES (?, ?)",
    );
    stmt.run(roomId, JSON.stringify(state));

    // Broadcast updated state to all clients in the room
    io.to(roomId).emit("stateUpdate", state);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
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

  // Broadcast the updated state to all clients in the room
  io.to(roomId).emit("stateUpdate", state);

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

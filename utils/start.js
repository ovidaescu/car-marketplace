const { startWebSocketServer } = require('./websocket');

// Start the WebSocket server on port 8080 and get the broadcastUpdate function
const broadcastUpdate = startWebSocketServer(8081);

module.exports = { broadcastUpdate };
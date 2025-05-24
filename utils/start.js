const { startWebSocketServer } = require('./websocket');

(async () => {
  // Start the WebSocket server on port 8081 and get the broadcastUpdate function
  const broadcastUpdate = await startWebSocketServer(8081);
  module.exports = { broadcastUpdate };
})();
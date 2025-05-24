const { startWebSocketServer } = require('./websocket');

// Export a promise that resolves to broadcastUpdate
module.exports = startWebSocketServer(8081);
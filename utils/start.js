const { startWebSocketServer } = require('./websocket');

if (!global.broadcastUpdate) {
  global.broadcastUpdate = startWebSocketServer(8081);
}

module.exports = { broadcastUpdate: global.broadcastUpdate };
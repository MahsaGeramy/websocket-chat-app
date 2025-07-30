import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

const PORT = 8080;

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 New client connected');
  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    const payload = {
      message: data.message,
      sender: data.sender,
      time: new Date().toLocaleTimeString(),
    };
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
});

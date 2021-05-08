import http from "http";
import { Server } from "ws";
import { v4 as uuid } from "uuid";

const HttpServer = http.createServer();
const WebSocketServer = new Server({ server: HttpServer });

WebSocketServer.on("connection", (socket, request) => {
  // Add unique id to client
  socket.isAlive = true;
  socket.id = uuid();

  socket.on("message", (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
      case "pong":
        socket.isAlive = true;
        break;

      case "start-task":
        startTask(socket);
        break;

      case "end-task":
        endTask(socket);
        break;

      default:
        console.log(message);
    }
  });
});

const aliveClientsInterval = setInterval(() => {
  WebSocketServer.clients.forEach((client) => {
    if (client.isAlive === false) {
      return client.terminate();
    }
    client.isAlive = false;
    client.send(JSON.stringify({ type: "ping" }));
  });
}, 30000);

const startTask = (socket) => {
  socket.taskInterval = setInterval(() => {
    socket.send(JSON.stringify({ type: "task", data: Math.random() * 100 }));
  }, 3000);
};

const endTask = (socket) => {
  clearInterval(socket.taskInterval);
};

WebSocketServer.on("close", () => {
  clearInterval(aliveClientsInterval);
});

HttpServer.listen(process.env.PORT || 8080, () => {
  const { port: PORT } = HttpServer.address();
  console.log(`[Web Server]: https://localhost:${PORT}`);
});

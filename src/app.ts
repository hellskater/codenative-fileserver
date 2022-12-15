import { createServer, Server } from "http";
import { SocketController } from "./controller/socket.controller";

const server = createServer();

const PORT = 1338;

server.listen(PORT, (): void => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);

  const socketController = new SocketController();
  try {
    socketController.init(server);
  } catch (error) {
    console.log("Something went wrong");
  }
});

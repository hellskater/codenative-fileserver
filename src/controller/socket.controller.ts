import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
import { fileController } from "./files.controller";
import { Watcher } from "./watcher.controller";
import { Terminal } from "./terminal.controller";

type FileInput = {
  name: string;
  content?: string;
  request: "create" | "update" | "delete" | "list" | "content";
};

export class SocketController {
  init(server: HttpServer): void {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    console.log("Waiting for client");

    io.on("connection", (socket: Socket) => {
      const terminal = new Terminal(socket);

      console.log(`Client: ${socket.id} connected`);

      socket.on("disconnect", (reason) => {
        console.log(`Client: ${socket.id} disconnected because of ${reason}`);
      });

      setTimeout(() => {
        socket.on("input", (input: string) => {
          terminal.write(input);
        });
      }, 5000);

      socket.on("fileInput", async (input: string) => {
        const parsedData: FileInput = JSON.parse(input);
        fileController(parsedData, socket);
      });

      const watcher = new Watcher(socket);
      watcher.init();
    });
  }
}

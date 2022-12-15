import chokidar, { FSWatcher } from "chokidar";
import { Socket } from "socket.io";
import { getFiles } from "../utils/getFiles";

const base = "/home/coder/app";

export class Watcher {
  watcher: FSWatcher = chokidar.watch(base, {
    depth: 2,
    ignoreInitial: true,
    ignored: /^\/?(?:\w+\/)*(\.\w+)/,
  });
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  init() {
    this.watcher.on("all", async () => {
      const files = await getFiles(`${base}/`);
      this.socket.emit("watcher", JSON.stringify({ files, status: "success" }));
    });

    this.socket.on("disconnect", () => {
      this.watcher.unwatch(base);
    });
  }
}

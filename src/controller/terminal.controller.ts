import os from "os";
import * as terminalPTY from "node-pty";
import { Socket } from "socket.io";

const base = "/home/coder/app";

export class Terminal {
  shell: string = os.platform() === "win32" ? "powershell.exe" : "bash";
  terminalPTYProcess: terminalPTY.IPty;
  socket: Socket;
  word: string = "";

  constructor(socket: Socket) {
    this.socket = socket;
    this.terminalPTYProcess = terminalPTY.spawn(this.shell, [], {
      name: "xterm-color",
      cwd: process.env.HOME,
      // @ts-ignore
      env: process.env,
    });

    this.start();
  }

  start() {
    this.write("clear\r");
    this.write("su coder\r");
    this.write(`cd ${base}\r`);
    this.write("clear\r");

    setTimeout(() => {
      this.write("\r");
      this.terminalPTYProcess.onData((data) => {
        this.emitData(data);
      });
    }, 5000);

    this.socket.on("disconnect", () => {
      this.write("\u0003\r");
      this.terminalPTYProcess.kill();
    });
  }

  emitData(data: string) {
    this.socket.emit("output", data);
  }

  write(data: string) {
    if (
      data === "\r" ||
      data === " " ||
      data === "" ||
      data === "\n" ||
      data === "\b" ||
      data === "\t"
    ) {
      this.word = "";
    } else {
      this.word += data;
    }

    if (this.terminalPTYProcess) {
      this.terminalPTYProcess.write(data);
    }
  }
}

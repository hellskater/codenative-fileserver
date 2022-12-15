import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import { promises as fsp } from "fs";
import { getFiles } from "../utils/getFiles";

const { rename, unlink, appendFile } = fsp;

const base = "/home/coder/app";
const temp = "/home/coder/temp";

type FileInput = {
  name: string;
  content?: string;
  request: "create" | "update" | "delete" | "list" | "content";
};

const updateFile = async (name: string, content: string) => {
  const uuid = uuidv4();

  await appendFile(`${temp}/${uuid}`, content);
  await rename(`${temp}/${uuid}`, `${base}/${name}`);
};

const deleteFile = async (name: string) => {
  await unlink(`${base}/${name}`);
};

const createFile = async (name: string) => {
  await appendFile(`${base}/${name}`, "");
};

const list = async (content?: boolean) => {
  const files = await getFiles(`${base}/`, [], content);
  return files;
};

export const fileController = async (parsedData: FileInput, socket: Socket) => {
  const { name, content, request } = parsedData;

  if (request === "list") {
    try {
      const files = await list();
      socket.emit(
        "fileOutput",
        JSON.stringify({ files, status: "success" })
      );
    } catch (error) {
      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "content") {
    try {
      const filesAndFolders = await list(true);
      socket.emit(
        "fileOutputWithContent",
        JSON.stringify({ filesAndFolders, status: "success" })
      );
    } catch (error) {
      socket.emit("fileOutputWithContent", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "update" && content) {
    try {
      await updateFile(name, content);
      socket.emit("fileOutput", JSON.stringify({ status: "success" }));
    } catch (error) {
      console.log(error);

      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "delete") {
    try {
      await deleteFile(name);
      socket.emit("fileOutput", JSON.stringify({ status: "success" }));
    } catch (error) {
      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }

  if (request === "create") {
    try {
      await createFile(name);
      socket.emit("fileOutput", JSON.stringify({ status: "success" }));
    } catch (error) {
      socket.emit("fileOutput", JSON.stringify({ status: "error" }));
    }
  }
};

import { promises as fsp } from "fs";

const { readdir, readFile } = fsp;

type File = {
  name: string;
  content?: string;
};

export const getFiles = async (
  path: string,
  files: File[] = [],
  content?: boolean
) => {
  const dirContent = await readdir(path, { withFileTypes: true });

  for await (const element of dirContent) {
    if (element.name.charAt(0) === ".") {
      continue;
    }

    const file: File = {
      name: element.name,
    };

    if (content) {
      const content = (await readFile(`${path}${element.name}`)).toString();
      file.content = content;
    }

    files.push(file);
  }
  return files;
};

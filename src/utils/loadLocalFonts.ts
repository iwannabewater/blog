import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontRoot = join(process.cwd(), "public", "fonts");

async function readFont(path: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(fontRoot, path));
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}

export default async function loadLocalFonts() {
  const tsangerRegular = await readFont("tsanger/TsangerJinKai02-W04.ttf");

  return [
    {
      name: "TsangerJinKai02",
      data: tsangerRegular,
      weight: 400,
      style: "normal",
    },
  ];
}

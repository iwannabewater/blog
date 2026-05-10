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
  const lxgwWenkai = await readFont("lxgw-wenkai/lxgw-wenkai-500.otf");
  const charter = await readFont("charter/charter_regular.otf");

  return [
    {
      name: "LXGW WenKai",
      data: lxgwWenkai,
      weight: 500,
      style: "normal",
    },
    {
      name: "Charter",
      data: charter,
      weight: 400,
      style: "normal",
    },
  ];
}

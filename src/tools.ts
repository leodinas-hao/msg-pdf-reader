import * as fs from 'fs/promises';
import * as path from 'path';

import MsgReader from '@kenjiuno/msgreader';
import Pdf from 'pdf-parse';


export async function getFiles(dir: string, pattern?: RegExp): Promise<string[]> {
  const list = await fs.readdir(dir)

  return list
    .filter((file) => pattern ? pattern.test(file) : true)
    .map((file) => path.join(dir, file))
}

export async function getAttachments(file: string, pattern: RegExp = /.pdf$/i)
  : Promise<{ fileName: string; content: Uint8Array }[]> {
  const fileBuffer = await fs.readFile(file)
  const msg = new MsgReader(fileBuffer)
  const info = msg.getFileData()

  const attachments: { fileName: string; content: Uint8Array }[] = []
  if (info.attachments) {
    for (const att of info.attachments) {
      if (new RegExp(pattern, 'i').test(att.fileName || '')) {
        attachments.push(msg.getAttachment(att))
      }
    }
  }
  return attachments
}

export async function readPdf(pdf: Buffer, patterns: RegExp[] = [], opts = { max: 1 }): Promise<string[]> {
  // default option: {max: 1}, to only read 1 page
  const txt = (await Pdf(pdf, opts)).text;
  let matches: string[] = [];
  // search each line in the pdf text and only returns the ones matching one of the search patterns
  if (txt?.length > 0) {
    const lines = txt.split('\n');
    for (const pattern of patterns) {
      let match = ''
      for (const line of lines) {
        const found = line.match(pattern)
        if (found) {
          match = found.toString();
          break;
        }
      }
      matches.push(match)
    }
  }
  return matches;
}
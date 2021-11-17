import * as fs from 'fs/promises';
import * as path from 'path';

import MsgReader from '@kenjiuno/msgreader'

export async function getFiles(dir: string, pattern?: string): Promise<string[]> {
  const list = await fs.readdir(dir)

  return list
    .filter((file) => pattern ? (new RegExp(pattern)).test(file) : true)
    .map((file) => path.join(dir, file))
}

export async function getAttachments(file: string, pattern: string = '.pdf$')
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

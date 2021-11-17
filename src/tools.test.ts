import * as fs from 'fs/promises';

import { getFiles, getAttachments, readPdf } from './tools';

const dir = 'C:/Users/lhao/Downloads/a';

test('should work', () => {
  expect.anything();
})

test('should get msg files', async () => {
  const msgs = await getFiles(dir, /.msg$/i)
  for (const msg of msgs) {
    expect(msg.includes('.msg')).toBeTruthy()
  }
})

test('should get attachment info', async () => {
  const files = await getFiles(dir, /.msg$/i)
  for (const file of files) {
    const pdfs = await getAttachments(file, /.pdf$/i)
    expect(pdfs.length > 0).toBeTruthy()
  }
})

test('should read pdf', async () => {
  const data: string[] = [];
  const patterns = [
    /^Claim No.\d+$/,
    /^Return Authority\w+$/,
    /^Bill Of Lading\w*/,
  ];
  const files = await getFiles(dir, /.msg$/i)
  for (const file of files) {
    const pdfs = await getAttachments(file, /.pdf$/i);
    expect(pdfs.length > 0).toBeTruthy();
    for (const pdf of pdfs) {
      data.push(pdf.fileName);
      const lines = await readPdf(Buffer.from(pdf.content), patterns);
      expect(lines.length > 0).toBeTruthy();
      data.push(...lines);
    }
  }

  await fs.writeFile('dpfs.txt', data.join('\n'));
})
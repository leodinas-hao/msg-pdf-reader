import { getFiles, getAttachments } from './index';

const dir = 'C:/Users/lhao/Downloads/a';

test('should work', () => {
  expect.anything();
})

test('should get msg files', async () => {
  const msgs = await getFiles(dir, '.msg$')
  for (const msg of msgs) {
    expect(msg.includes('.msg')).toBeTruthy()
  }
})

test('should get attachment info', async () => {
  const files = await getFiles(dir, '.msg$')
  for (const file of files) {
    const pdfs = await getAttachments(file, '.pdf$')
    expect(pdfs.length > 0).toBeTruthy()
  }
})
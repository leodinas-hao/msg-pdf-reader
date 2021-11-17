import * as fs from 'fs/promises';

import * as Yargs from 'yargs';
import RegexParser from 'regex-parser';

import { getAttachments, getFiles, readPdf } from './tools';

export async function main(...args: string[]) {
  const yargs = Yargs
    .usage(`Usage: iread <options>`)
    .options({
      dir: {
        alias: 'd',
        describe: 'directory to read',
        string: true,
        default: '.',
      },
      msgPattern: {
        alias: 'm',
        describe: 'pattern to filer files',
        string: true,
        default: '/.msg$/i',
      },
      pdfPattern: {
        alias: 'p',
        describe: 'pattern to filer the pdf attachment in the message',
        string: true,
        default: '/.pdf$/i',
      },
      contentPattern: {
        alias: 'c',
        describe: 'a list of patterns to filter pdf contents',
        array: true,
        string: true,
      },
      output: {
        alias: 'o',
        describe: 'output path',
        string: true,
      }
    })
    .version()
    .showHelpOnFail(true)
    .recommendCommands()
    .help();

  const argv = yargs.parse(args);
  const files = await getFiles(argv.dir, RegexParser(argv.msgPattern));
  const data: string[] = [];
  const patterns = (argv.contentPattern || []).map(p => RegexParser(p));
  for (const file of files) {
    const pdfs = await getAttachments(file, RegexParser(argv.pdfPattern));
    for (const pdf of pdfs) {
      data.push(pdf.fileName);
      const contents = await readPdf(Buffer.from(pdf.content), patterns);
      data.push(...contents);
    }
  }

  if (argv.output) {
    await fs.writeFile(argv.output, data.join('\n'));
  } else {
    console.log(data.join('\n'));
  }

}

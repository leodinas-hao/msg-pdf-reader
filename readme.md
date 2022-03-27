# MSG-PDF-READER

**personal use only**

## what does it do?
- bulk read pdf contents attached in msg files from a directory
- extract contents by regex patterns

## cli
```sh
iread -c "/(?<=^Claim No.)\d+$/" -c "/(?<=^Return Authority)\S+$/" -c "/(?<=^Bill Of Lading)\w*/" -c "/(?<=Issued by:\s*)\w+$/" -d "." -o "read.csv"
```
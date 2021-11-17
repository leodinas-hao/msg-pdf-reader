# MSG-PDF-READER

**personal use only**

## what does it do?
- bulk read pdf contents attached in msg files from a directory
- extract contents by regex patterns

## cli
```sh
iread -d "." -c "/^Claim No.\d+$/" -c "/^Return Authority\w+$/" -c "/^Bill Of Lading\w*/"
```
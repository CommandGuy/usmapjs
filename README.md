# Usmap.js

NodeJS library to read and decompress usmap files

## Example Usage

```js
const Usmap = require('usmapjs');
const fs = require('fs');

const reader = new Usmap({
  debug: console.log
})

let start = Date.now();

let buf = fs.readFileSync('./test.usmap')
let mappings = reader.decompress(buf)

let end = Date.now();
let duration = end - start;
console.log(`Done in ${duration / 1000}ms (${Object.keys(mappings.enums).length} enums, ${Object.keys(mappings.schemas).length} schemas)`);
```
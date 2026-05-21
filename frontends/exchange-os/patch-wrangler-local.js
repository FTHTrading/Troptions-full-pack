const fs = require('fs');
const cliPath = 'C:\\Users\\Kevan\\troptions\\node_modules\\wrangler\\wrangler-dist\\cli.js';
let cli = fs.readFileSync(cliPath, 'utf8');

// Find checkRawWorker and add format: 'esm'
const idx = cli.indexOf('async function checkRawWorker(scriptPath4, nodejsCompatMode, onEnd)');
if (idx === -1) {
  console.error('checkRawWorker not found!');
  process.exit(1);
}

// Find the esbuild.build call and insert format: 'esm'
const writeIdx = cli.indexOf('write: false,', idx);
if (writeIdx === -1) {
  console.error('write: false not found');
  process.exit(1);
}

// Check if already patched
if (cli.substring(writeIdx - 50, writeIdx).includes("format:")) {
  console.log('Already patched');
  process.exit(0);
}

// Insert format: 'esm', before write: false,
const before = cli.substring(0, writeIdx);
const after = cli.substring(writeIdx);
cli = before + "format: 'esm',\n    " + after;

fs.writeFileSync(cliPath, cli);
console.log('Patched local wrangler 4.85.0 checkRawWorker with format: esm at index', writeIdx);

// Verify
const newIdx = cli.indexOf('async function checkRawWorker(scriptPath4, nodejsCompatMode, onEnd)');
console.log(cli.substring(newIdx, newIdx + 400));

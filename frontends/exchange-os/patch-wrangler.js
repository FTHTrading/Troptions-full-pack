const fs = require('fs');
const cliPath = 'node_modules/wrangler/wrangler-dist/cli.js';
let cli = fs.readFileSync(cliPath, 'utf8');

// Find checkRawWorker and add format: 'esm'
const idx = cli.indexOf('async function checkRawWorker(scriptPath4, nodejsCompatMode, onEnd)');
if (idx === -1) {
  console.error('checkRawWorker not found!');
  process.exit(1);
}

// Find the esbuild.build call and insert format: 'esm'
// Look for 'write: false,' after the function start
const searchFrom = idx;
const writeIdx = cli.indexOf('write: false,', searchFrom);
if (writeIdx === -1) {
  console.error('write: false not found');
  process.exit(1);
}

// Check if already patched
if (cli.substring(writeIdx - 30, writeIdx).includes('format:')) {
  console.log('Already patched');
  process.exit(0);
}

// Insert format: 'esm', before write: false,
const before = cli.substring(0, writeIdx);
const after = cli.substring(writeIdx);
cli = before + "format: 'esm',\n    " + after;

fs.writeFileSync(cliPath, cli);
console.log('Patched checkRawWorker with format: esm at index', writeIdx);

// Verify
const newIdx = cli.indexOf('async function checkRawWorker(scriptPath4, nodejsCompatMode, onEnd)');
console.log('Patch result:');
console.log(cli.substring(newIdx, newIdx + 400));

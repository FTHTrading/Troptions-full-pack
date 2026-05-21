const fs = require('fs');
const workerPath = '.open-next/pages-deploy/_worker.js';
let worker = fs.readFileSync(workerPath, 'utf8');

const nodeBuiltins = [
  'async_hooks', 'assert', 'buffer', 'child_process', 'cluster',
  'console', 'constants', 'crypto', 'dgram', 'diagnostics_channel',
  'dns', 'domain', 'events', 'fs', 'http', 'http2', 'https', 'inspector',
  'module', 'net', 'os', 'path', 'perf_hooks', 'process', 'punycode',
  'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'sys',
  'timers', 'tls', 'trace_events', 'tty', 'url', 'util', 'v8', 'vm',
  'wasi', 'worker_threads', 'zlib'
];

let count = 0;
for (const mod of nodeBuiltins) {
  const regex = new RegExp('from "' + mod + '"', 'g');
  const matches = worker.match(regex);
  const before = matches ? matches.length : 0;
  if (before > 0) {
    worker = worker.replace(regex, 'from "node:' + mod + '"');
    count += before;
    console.log('Converted', before, 'imports of', mod);
  }
}

fs.writeFileSync(workerPath, worker);
console.log('Total conversions:', count);

// Verify
const lines = worker.split('\n').filter(l => l.startsWith('import '));
console.log('All import lines after fix:');
lines.forEach(l => console.log(' ', l));

import { readFileSync, writeFileSync } from 'fs';
const current = readFileSync('dist/Setup.js', 'utf8');
writeFileSync('dist/Setup.js', `process.env.NODE_ENV = 'production';\n${current}`);
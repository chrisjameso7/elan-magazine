// Cloudflare Workers caps PBKDF2 at 100,000 iterations; Payload hashes with
// 600,000, so sign-in and password resets fail on Workers. On Workers only,
// new hashes use PBKDF2-SHA256 at 100,000 iterations under their own prefix.
// Every runtime can verify that prefix, and Node runtimes still upgrade such
// hashes to Payload's 600,000-iteration format at the next sign-in.
// Fail loudly if the reviewed upstream files change.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const root = join(
  dirname(require.resolve("payload")),
  "auth",
  "strategies",
  "local",
);
const marker = "/* Lumiere: Workers-compatible password hashing. */";
function patch(file, edits) {
  const path = join(root, file);
  let code = readFileSync(path, "utf8");
  if (code.includes(marker)) return;
  for (const [from, to] of edits) {
    if (code.split(from).length !== 2)
      throw Error(`Payload ${file} changed; review the Workers hashing patch.`);
    code = code.replace(from, to);
  }
  writeFileSync(path, `${marker}\n${code}`);
}

patch("generatePasswordSaltHash.js", [
  [
    "const legacyPasswordHashIterations = 25000;",
    `const legacyPasswordHashIterations = 25000;
const workersPasswordHashPrefix = 'pbkdf2-sha256-w100k:';
const workersPasswordHashIterations = 100000;
export const isWorkersRuntime = ()=>typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';
export const isWorkersPasswordHash = (hash)=>typeof hash === 'string' && hash.startsWith(workersPasswordHashPrefix);`,
  ],
  [
    `    const hashRaw = await pbkdf2Promisified({
        iterations: currentPasswordHashIterations,`,
    `    if (isWorkersRuntime()) {
        const workersRaw = await pbkdf2Promisified({
            iterations: workersPasswordHashIterations,
            keyLength: currentPasswordHashKeyLength,
            password: passwordToSet,
            salt
        });
        return {
            hash: \`\${workersPasswordHashPrefix}\${workersRaw.toString('hex')}\`,
            salt
        };
    }
    const hashRaw = await pbkdf2Promisified({
        iterations: currentPasswordHashIterations,`,
  ],
  [
    "export const getPasswordHashParameters = (hash)=>{",
    `export const getPasswordHashParameters = (hash)=>{
    if (isWorkersPasswordHash(hash)) {
        return {
            hash: hash.slice(workersPasswordHashPrefix.length),
            iterations: workersPasswordHashIterations,
            keyLength: currentPasswordHashKeyLength
        };
    }`,
  ],
]);

patch("authenticate.js", [
  [
    "import { getPasswordHashParameters, isCurrentPasswordHash } from './generatePasswordSaltHash.js';",
    "import { getPasswordHashParameters, isCurrentPasswordHash, isWorkersPasswordHash, isWorkersRuntime } from './generatePasswordSaltHash.js';",
  ],
  [
    "        if (typeof salt === 'string' && typeof hash === 'string') {",
    `        // Workers cannot recompute Payload's 600,000-iteration hashes; ask for a reset.
        if (isWorkersRuntime() && isCurrentPasswordHash(hash)) return null;
        if (typeof salt === 'string' && typeof hash === 'string') {`,
  ],
  [
    "shouldUpdatePasswordHash: !isCurrentPasswordHash(hash)",
    "shouldUpdatePasswordHash: !isCurrentPasswordHash(hash) && !(isWorkersRuntime() && isWorkersPasswordHash(hash))",
  ],
]);

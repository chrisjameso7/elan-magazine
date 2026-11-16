// Temporary mitigation for GHSA-gcqx-w48m-w2h4 until upstream releases a fix.
// Apply to both distributed module formats; fail if the reviewed upstream changes.
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
const require=createRequire(import.meta.url);
const root=dirname(require.resolve('deepmerge/package.json'));
const marker='/* Lumiere: block prototype keys in both merge operands. */';
for(const format of ['cjs.js','umd.js']){
 const file=join(root,'dist',format);let code=readFileSync(file,'utf8');
 if(code.includes(marker))continue;
 const target='getKeys(target).forEach(function(key) {';
 const source='getKeys(source).forEach(function(key) {';
 if(!code.includes(target)||!code.includes(source))throw Error('deepmerge distribution changed; review the security mitigation.');
 const guard="\n\t\t\tif (key === '__proto__' || key === 'constructor' || key === 'prototype') return;";
 code=marker+'\n'+code.replace(target,target+guard).replace(source,source+guard);
 writeFileSync(file,code);
}

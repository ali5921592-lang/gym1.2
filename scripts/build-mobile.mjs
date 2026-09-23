import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
const root=process.cwd(),source=path.join(root,'dist'),target=path.join(root,'www');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});
await build({entryPoints:[path.join(source,'native-bridge.js')],outfile:path.join(target,'native-bridge.js'),bundle:true,format:'esm',platform:'browser',target:['ios15','chrome100'],minify:true,sourcemap:false});
console.log('Fitness Copilot mobile web bundle created.');

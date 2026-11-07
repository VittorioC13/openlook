import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await mkdir('work',{recursive:true});
await build({entryPoints:['scripts/checks.ts'],bundle:true,platform:'node',format:'cjs',outfile:'work/checks.cjs'});
const result=spawnSync(process.execPath,['work/checks.cjs'],{stdio:'inherit'});process.exit(result.status??1);

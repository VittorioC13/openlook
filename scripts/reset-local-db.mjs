import {spawnSync} from 'node:child_process';
const sql='DROP TABLE IF EXISTS shared_looks; CREATE TABLE shared_looks (token text PRIMARY KEY NOT NULL, owner text NOT NULL, payload text NOT NULL, created_at integer NOT NULL);';
const r=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--command',sql],{stdio:'inherit'});process.exit(r.status??1);

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postgresPool } from '../src/lib/postgresPool';
test('Supabase pool uses a bundled CA and no workstation certificate path', () => {
 const pool=postgresPool('postgresql://postgres:secret@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=verify-full&sslrootcert=C%3A%2Flocal.crt');
 assert.equal(pool.max,3);assert.equal(pool.ssl?.rejectUnauthorized,true);assert.match(pool.ssl!.ca,/BEGIN CERTIFICATE/);
 assert.equal(new URL(pool.connectionString!).searchParams.has('sslrootcert'),false);
 assert.deepEqual(postgresPool('postgres://localhost/elan'),{connectionString:'postgres://localhost/elan'});
});

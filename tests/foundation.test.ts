import {test} from 'node:test';
import assert from 'node:assert/strict';
import {brand,siteURL} from '../src/lib/brand';
import {cmsEnvironment} from '../src/cms/environment';
import {isOwner,ownerOnly,releasedArticlesWhere} from '../src/cms/access';
import {newsroomCollections,Users,Media,Articles} from '../src/cms/collections';

test('brand uses the confirmed domain; unsafe origins fail explicitly',()=>{
 assert.equal(brand.name,'Lumière Index');assert.equal(siteURL('').origin,'https://lumiereindex.com');
 for(const url of ['javascript:alert(1)','https://user:secret@example.com','https://example.com/path','https://example.com?x=1'])assert.throws(()=>siteURL(url));
});
test('CMS configuration fails closed and cannot target a remote database in Phase 1',()=>{
 assert.throws(()=>cmsEnvironment({}),/DATABASE_URI/);
 const config={DATABASE_URI:'postgresql://local@127.0.0.1:55441/postgres',PAYLOAD_SECRET:'x'.repeat(40),LUMIERE_OWNER_EMAIL:'Owner@Lumiere.test'};
 assert.equal(cmsEnvironment(config).owner,'owner@lumiere.test');
 assert.throws(()=>cmsEnvironment({...config,PAYLOAD_SECRET:'short'}),/32/);
 assert.throws(()=>cmsEnvironment({...config,DATABASE_URI:'postgresql://user@db.example.com/app'}),/isolated local/);
});
test('authorization rejects anonymous users, other users and missing owner configuration',async()=>{
 const before=process.env.LUMIERE_OWNER_EMAIL;
 try{process.env.LUMIERE_OWNER_EMAIL='owner@lumiere.test';assert.equal(isOwner(null),false);assert.equal(isOwner({email:'reporter@lumiere.test'}),false);assert.equal(isOwner({email:'OWNER@LUMIERE.TEST'}),true);
 for(const collection of [Users,Media])for(const action of ['read','create','update','delete'] as const)assert.equal(await collection.access![action]!({req:{user:null}} as never),false);
 delete process.env.LUMIERE_OWNER_EMAIL;assert.equal(isOwner({email:'owner@lumiere.test'}),false);assert.equal(await ownerOnly({req:{user:null}} as never),false);
 }finally{if(before===undefined)delete process.env.LUMIERE_OWNER_EMAIL;else process.env.LUMIERE_OWNER_EMAIL=before;}
});
test('public article reads require published status and an elapsed release time',()=>{
 assert.deepEqual(releasedArticlesWhere(new Date('2026-11-06T00:00:00Z')),{and:[{_status:{equals:'published'}},{publishedAt:{less_than_equal:'2026-11-06T00:00:00.000Z'}}]});
 assert.ok(Articles.versions);assert.ok(Articles.fields.some(f=>'name'in f&&f.name==='publishedAt'&&'index'in f&&f.index));
 assert.deepEqual(newsroomCollections.map(c=>c.slug),['users','contributors','sections','media','articles']);
});

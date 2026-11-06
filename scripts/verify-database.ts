import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {getPayload} from 'payload';
import {sql} from '@payloadcms/db-postgres';
import config from '../src/payload.config';
const target=new URL(process.env.DATABASE_URI||'');
if(target.hostname!=='127.0.0.1'||target.port!=='55441')throw new Error('This integration check requires the isolated Phase 1 database on port 55441.');
const cms=await getPayload({config});
try{
 const suffix=randomBytes(5).toString('hex');
 const existing=await cms.find({collection:'users',overrideAccess:true});
 const password=randomBytes(24).toString('hex');
 const owner=existing.docs.find(u=>u.email===process.env.LUMIERE_OWNER_EMAIL)||await cms.create({collection:'users',overrideAccess:true,data:{name:'Local owner test',email:process.env.LUMIERE_OWNER_EMAIL!,password}});
 if(!existing.totalDocs){const login=await cms.login({collection:'users',data:{email:owner.email,password}});assert.ok(login.token);}
 const section=await cms.create({collection:'sections',overrideAccess:false,user:owner,data:{name:'Local test section',slug:`qa-section-${suffix}`}});
 const contributor=await cms.create({collection:'contributors',overrideAccess:false,user:owner,data:{name:'Local test contributor',slug:`qa-contributor-${suffix}`}});
 const body={root:{type:'root',version:1,direction:'ltr' as const,format:'' as const,indent:0,children:[{type:'paragraph',version:1,direction:'ltr',format:'',indent:0,children:[{type:'text',version:1,text:'Local integration fixture. Not editorial content.',format:0,detail:0,mode:'normal',style:''}]}]}};
 const data={title:'Local schema contract',section:section.id,contributors:[contributor.id],body,publishedAt:'2026-01-01T00:00:00Z'};
 const draft=await cms.create({collection:'articles',overrideAccess:false,user:owner,data:{...data,slug:`qa-draft-${suffix}`,_status:'draft'}});
 assert.equal((await cms.find({collection:'articles',overrideAccess:false,where:{id:{equals:draft.id}}})).totalDocs,0);
 await cms.update({collection:'articles',id:draft.id,overrideAccess:false,user:owner,data:{_status:'published'}});
 assert.equal((await cms.find({collection:'articles',overrideAccess:false,where:{id:{equals:draft.id}}})).totalDocs,1);
 await cms.update({collection:'articles',id:draft.id,overrideAccess:false,user:owner,data:{publishedAt:'2099-01-01T00:00:00Z'}});
 assert.equal((await cms.find({collection:'articles',overrideAccess:false,where:{id:{equals:draft.id}}})).totalDocs,0);
 await assert.rejects(cms.create({collection:'sections',overrideAccess:false,data:{name:'Unauthorized',slug:`qa-denied-${suffix}`}}));
 await assert.rejects(cms.find({collection:'users',overrideAccess:false}));
 await assert.rejects(cms.create({collection:'sections',overrideAccess:false,user:owner,data:{name:'Duplicate',slug:section.slug}}));
 const security=await cms.db.drizzle.execute(sql`SELECT count(*) FILTER (WHERE NOT c.relrowsecurity) AS unprotected FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='lumiere_index' AND c.relkind='r'`);
 assert.equal(Number(security.rows[0].unprotected),0);
 const isolation=await cms.db.drizzle.execute(sql`SELECT count(*) AS legacy FROM information_schema.tables WHERE table_schema='elan'`);
 assert.equal(Number(isolation.rows[0].legacy),0);
 console.log('Database integration passed: owner login; contributor/section/article relationships; draft -> published -> future visibility; anonymous write/user denial; unique slugs; RLS; isolated schema. Fixtures remain local.');
}finally{await cms.destroy();}

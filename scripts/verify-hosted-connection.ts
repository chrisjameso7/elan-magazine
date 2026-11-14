import {readFileSync} from 'node:fs';
const env=JSON.parse(readFileSync('work/hosted-setup-private.json','utf8'));
for(const [key,value] of Object.entries(env))if(typeof value==='string')process.env[key]=value;
delete process.env.MEDIA_STORAGE;delete process.env.RESEND_API_KEY;
const {getPayload}=await import('payload');const {default:config}=await import('../src/payload.config');
const cms=await getPayload({config});
try{const result=await cms.find({collection:'articles',overrideAccess:true,limit:1});if(result.totalDocs)throw Error('Hosted newsroom unexpectedly contains articles.');console.log('Verified TLS connection using restricted hosted role. Hosted article count: 0.');}finally{await cms.destroy();}

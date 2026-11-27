import {readFileSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
const env=JSON.parse(readFileSync('work/hosted-setup-private.json','utf8'));
if(env.LUMIERE_DATABASE_MODE!=='hosted'||env.S3_PREFIX!=='lumiere-index/preview')throw Error('Staging-only configuration required.');
for(const [key,value]of Object.entries(env))if(typeof value==='string')process.env[key]=value;
delete process.env.MEDIA_STORAGE;delete process.env.RESEND_API_KEY;
const {getPayload}=await import('payload');const {default:config}=await import('../src/payload.config');const cms=await getPayload({config});
try{
 const email=env.LUMIERE_OWNER_EMAIL;
 let owner=(await cms.find({collection:'users',where:{email:{equals:email}},overrideAccess:true,limit:1})).docs[0];
 if(!owner)owner=await cms.create({collection:'users',overrideAccess:true,context:{bootstrapOwner:true},data:{name:'Chris James',email,role:'administrator',password:randomBytes(32).toString('base64url')}});
 let contributor=(await cms.find({collection:'contributors',where:{slug:{equals:'chris-james'}},user:owner,overrideAccess:false,limit:1})).docs[0];
 if(!contributor)contributor=await cms.create({collection:'contributors',user:owner,overrideAccess:false,data:{name:'Chris James',slug:'chris-james',bio:'Founder and CEO of Lumiere Media.'}});
 await cms.update({collection:'users',id:owner.id,user:owner,overrideAccess:false,data:{contributor:contributor.id}});
 for(const [i,[name,slug]]of [['Celebrity','celebrity'],['Film & TV','film-tv'],['Music','music'],['Culture','culture'],['Exclusives','exclusives']].entries()){
  if(!(await cms.find({collection:'sections',where:{slug:{equals:slug}},user:owner,overrideAccess:false,limit:1})).totalDocs)await cms.create({collection:'sections',user:owner,overrideAccess:false,data:{name,slug,navOrder:i}});
 }
 const token=await cms.forgotPassword({collection:'users',data:{email},disableEmail:true,expiration:3600000});
 writeFileSync('work/hosted-owner-setup-private.json',JSON.stringify({email,token,ownerId:owner.id,createdAt:new Date().toISOString()}),{mode:0o600});
 console.log('Hosted owner, byline and canonical sections provisioned. Private reset token saved without sending email.');
}finally{await cms.destroy();}

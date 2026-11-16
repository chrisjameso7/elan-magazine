import {sql} from '@payloadcms/db-postgres';
import {getCMS} from '@/lib/cms';
export const dynamic='force-dynamic';
export async function GET(){try{const cms=await getCMS();await cms.db.drizzle.execute(sql`SELECT 1`);return Response.json({ready:true},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({ready:false},{status:503,headers:{'Cache-Control':'no-store'}});}}

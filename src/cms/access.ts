import {sql} from '@payloadcms/db-postgres';
import type { Access, Where, PayloadRequest } from 'payload';
export type StaffUser = {id?:number|string;email?:string|null;role?:string|null};
export function isOwner(user:StaffUser|null|undefined):boolean{const owner=process.env.LUMIERE_OWNER_EMAIL?.trim().toLowerCase();return !!owner&&user?.email?.trim().toLowerCase()===owner;}
export function isAdmin(user:StaffUser|null|undefined):boolean{return isOwner(user)||user?.role==='administrator';}
export function isEditor(user:StaffUser|null|undefined):boolean{return isAdmin(user)||user?.role==='editor';}
export function isStaff(user:StaffUser|null|undefined):boolean{return isEditor(user)||user?.role==='writer';}
export const ownerOnly=({req}:{req:PayloadRequest})=>isOwner(req.user);
export const adminOnly=({req}:{req:PayloadRequest})=>isAdmin(req.user);
export const editorOnly=({req}:{req:PayloadRequest})=>isEditor(req.user);
export const staffOnly=({req}:{req:PayloadRequest})=>isStaff(req.user);
export function ownedArticles(user:StaffUser):Where{return {or:[{createdBy:{equals:user.id}},{assignedTo:{equals:user.id}}]};}
export function releasedArticlesWhere(now=new Date()):Where{return {and:[{_status:{equals:'published'}},{reviewStatus:{equals:'approved'}},{publishedAt:{less_than_equal:now.toISOString()}},{isTestData:{not_equals:true}}]};}
export const readArticles:Access=({req})=>isEditor(req.user)?true:isStaff(req.user)?ownedArticles(req.user!):releasedArticlesWhere();
export const updateArticles:Access=({req})=>isEditor(req.user)?true:isStaff(req.user)?ownedArticles(req.user!):false;
type PublicRelations={sections:number[];contributors:number[];media:number[]};
async function publicRelations(req:PayloadRequest):Promise<PublicRelations>{
 if(!req.context.lumierePublicRelations){
  req.context.lumierePublicRelations=req.payload.db.drizzle.execute(sql`
   WITH released AS (SELECT id, section_id, hero_id FROM lumiere_index.articles
     WHERE _status='published' AND review_status='approved' AND published_at<=NOW() AND is_test_data IS DISTINCT FROM true)
   SELECT jsonb_build_object(
     'sections',COALESCE((SELECT jsonb_agg(DISTINCT section_id) FROM released WHERE section_id IS NOT NULL),'[]'::jsonb),
     'contributors',COALESCE((SELECT jsonb_agg(DISTINCT ar.contributors_id) FROM lumiere_index.articles_rels ar JOIN released r ON r.id=ar.parent_id WHERE ar.path='contributors' AND ar.contributors_id IS NOT NULL),'[]'::jsonb),
     'media',COALESCE((SELECT jsonb_agg(DISTINCT media_id) FROM (
       SELECT hero_id AS media_id FROM released WHERE hero_id IS NOT NULL
       UNION SELECT ar.media_id FROM lumiere_index.articles_rels ar JOIN released r ON r.id=ar.parent_id WHERE ar.path='linkedMedia' AND ar.media_id IS NOT NULL
     ) assets),'[]'::jsonb)) AS eligibility
  `).then(result=>result.rows[0].eligibility as PublicRelations);
 }
 return req.context.lumierePublicRelations as Promise<PublicRelations>;
}
export const publicRecordRead=(collection:keyof PublicRelations):Access=>async({req})=>{if(isStaff(req.user))return true;const ids=(await publicRelations(req))[collection];if(collection==='media')return {and:[{id:{in:ids}},{rightsConfirmed:{equals:true}},{or:[{licenseExpiresAt:{exists:false}},{licenseExpiresAt:{greater_than:new Date().toISOString()}}]}]} as Where;return {id:{in:ids}} as Where;};

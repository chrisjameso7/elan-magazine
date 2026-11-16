import {headers} from 'next/headers';
import {redirect,notFound} from 'next/navigation';
import {getCMS} from '@/lib/cms';
import ArticleView from '@/components/ArticleView';
import {isStaff} from '@/cms/access';
export const dynamic='force-dynamic';
export const metadata={title:'Private story preview',robots:{index:false,follow:false}};
export default async function Preview({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^\d+$/.test(id))notFound();const cms=await getCMS();const {user}=await cms.auth({headers:await headers()});if(!isStaff(user))redirect(`/admin/login?redirect=${encodeURIComponent('/preview/'+id)}`);let article;try{article=await cms.findByID({collection:'articles',id:Number(id),user,overrideAccess:false,draft:true,depth:2});}catch(error){const status=(error as {status?:number}).status;if(status===403||status===404)notFound();throw error;}return <ArticleView article={article} preview/>;}

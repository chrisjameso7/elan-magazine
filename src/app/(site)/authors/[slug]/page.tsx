import {notFound} from 'next/navigation';
import {getContributor,storyList} from '@/lib/publication';
import StoryArchive from '@/components/StoryArchive';
export const dynamic='force-dynamic';
type Props={params:Promise<{slug:string}>;searchParams:Promise<{page?:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;const a=await getContributor(slug);return {title:a?.name||'Contributor not found',description:a?.bio,alternates:{canonical:`/authors/${slug}`}};}
export default async function Author({params,searchParams}:Props){const {slug}=await params;const author=await getContributor(slug);if(!author)notFound();const page=Math.max(1,Math.min(10000,Number((await searchParams).page)||1));const stories=await storyList({contributor:author.id,page});if(!stories.totalDocs)notFound();return <StoryArchive title={author.name} intro={author.bio||undefined} stories={stories.docs} page={page} totalPages={stories.totalPages} href={p=>`/authors/${slug}?page=${p}`}/>;}

import Link from 'next/link';
import {getSections} from '@/lib/publication';
export const dynamic='force-dynamic';
export const metadata={title:'Sections',alternates:{canonical:'/sections'}};
export default async function Sections(){const sections=await getSections();return <main id="main-content" className="editorial-body archive-page"><header><p className="eyebrow">The publication</p><h1>Our sections.</h1></header>{sections.length?<div className="section-directory">{sections.map(s=><Link href={`/sections/${s.slug}`} key={s.id}><h2>{s.name} ↗</h2>{s.description&&<p>{s.description}</p>}</Link>)}</div>:<p className="empty-edition">Sections will appear with their first published stories.</p>}</main>;}

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StoryCard from '@/components/editorial/StoryCard';
import EditorialImage from '@/components/editorial/EditorialImage';
import { getArticles } from '@/lib/cmsAdapter';
import { homepageStories, storyHref } from '@/lib/presentation';

export const metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const articles = await getArticles();
  const { lead, wave, feature, edit, latest } = homepageStories(articles);
  return <><Header /><main id="main-content" className="publication-shell homepage">
    <div className="edition-line"><span>An independent eye on culture</span><Link href="/about">People worth knowing. Stories worth your time. <span aria-hidden="true">↗</span></Link></div>
    {lead ? <section aria-label="The lead story" className="home-lead">
      <div className="home-lead-photo"><Link href={storyHref(lead)} tabIndex={-1} aria-hidden="true"><EditorialImage image={lead.coverImage} direction={lead.artDirection} priority sizes="(min-width: 900px) 60vw, 100vw" /></Link></div>
      <div className="home-lead-copy"><span className="eyebrow">{lead.franchise === 'new_guard' ? 'The Next Wave' : 'In focus'} / <Link href={`/category/${lead.category}`}>{lead.categoryLabel}</Link></span>
        <h1><Link href={storyHref(lead)}>{lead.title}</Link></h1><p className="story-dek">{lead.dek}</p>
        <p className="story-meta">By {lead.author.name}{lead.dateFormatted && <time dateTime={lead.publishedAt}>{lead.dateFormatted}</time>}</p>
        <Link href={storyHref(lead)} className="text-link">Read the story <span aria-hidden="true">↗</span></Link>
      </div>
    </section> : <section className="empty-editorial"><span className="eyebrow">The Élan</span><h1>There is more to discover.</h1><p>Our editors are preparing the next stories. Explore the publication in the meantime.</p><Link href="/about" className="text-link">About The Élan ↗</Link></section>}

    {wave.length > 0 && <section className="next-wave" aria-labelledby="wave-title">
      <div className="wave-intro"><span className="eyebrow">The discovery series</span><h2 id="wave-title">The Next{' '}<br /><em>Wave</em><span aria-hidden="true">↗</span></h2><p>Meet the people shaping what comes next.</p><Link href="/category/people" className="text-link">Explore People <span aria-hidden="true">↗</span></Link></div>
      <div className={`wave-stories wave-stories--${wave.length}`}>{wave.map((article, index) => <div key={article.id}><span className="wave-index">{String(index + 1).padStart(2, '0')} / THE NEXT WAVE</span><StoryCard article={article} /></div>)}</div>
    </section>}

    {latest.length > 0 && <section className="editorial-section" aria-labelledby="latest-title"><div className="section-heading"><h2 id="latest-title">The latest</h2><span className="eyebrow">Across our world</span></div>
      <div className="latest-layout"><StoryCard article={latest[0]} />{latest.length > 1 && <div className="latest-list">{latest.slice(1).map(article => <StoryCard key={article.id} article={article} variant="horizontal_split" />)}</div>}</div>
    </section>}

    {feature && <section className="conversation-feature" aria-labelledby="feature-title"><div className="conversation-photo"><EditorialImage image={feature.interview?.portrait ?? feature.coverImage} direction={feature.artDirection} sizes="(min-width: 900px) 45vw, 100vw" /></div>
      <div className="conversation-copy"><span className="eyebrow">{feature.type === 'interview' ? 'ÉLAN Conversations' : 'The long read'}</span><h2 id="feature-title"><Link href={storyHref(feature)}>{feature.title}</Link></h2><p>{feature.dek}</p><p className="story-meta">By {feature.author.name} <span>{feature.readTime}</span></p><Link className="text-link" href={storyHref(feature)}>{feature.type === 'interview' ? 'Read the conversation' : 'Read the feature'} <span aria-hidden="true">↗</span></Link></div>
    </section>}

    {edit.length > 0 && <section className="editorial-section" aria-labelledby="edit-title"><div className="section-heading"><h2 id="edit-title">The Élan <em>Edit</em></h2><span className="eyebrow">A considered selection</span></div><div className="edit-grid">{edit.map(article => <StoryCard key={article.id} article={article} variant="horizontal_split" />)}</div></section>}
  </main><Footer /></>;
}

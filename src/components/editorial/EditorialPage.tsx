import Link from 'next/link';
import type { Article } from '@/types/editorial';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleBody, { PhotoCaption } from './ArticleBody';
import EditorialImage from './EditorialImage';
import StoryCard from './StoryCard';
import StoryTools from './StoryTools';
import { profileHref } from '@/lib/presentation';

export default function EditorialPage({ article, articles, format }: { article: Article; articles: Article[]; format: 'article' | 'feature' | 'interview' }) {
  const interview = format === 'interview' ? article.interview : undefined;
  const instagram = !article.isDevMock ? profileHref(interview?.socialLinks?.instagram, 'instagram') : undefined;
  const portfolio = profileHref(interview?.socialLinks?.portfolio);
  const related = articles.filter(a => a.id !== article.id).sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category)).slice(0, 3);
  const byline = <div className="reading-byline"><Link href={`/author/${encodeURIComponent(article.author.id)}`}>By {article.author.name}</Link>{article.dateFormatted && <time dateTime={article.publishedAt}>{article.dateFormatted}</time>}{article.readTime && <span>{article.readTime}</span>}<StoryTools slug={article.slug} title={article.title} /></div>;
  const headline = <><Link className="eyebrow" href={`/category/${article.category}`}>{article.categoryLabel}{interview ? ' / ÉLAN Conversations' : format === 'feature' ? ' / Feature' : ''}</Link><h1>{article.title}</h1></>;
  return <><Header /><main id="main-content" className={`publication-shell reading-page reading-${format}`}>
    <Link href={`/category/${article.category}`} className="reading-breadcrumb">← Back to {article.categoryLabel}</Link>
    {interview ? <div className="interview-opening"><header className="reading-header">{headline}<p className="reading-dek">{article.dek}</p>{byline}</header><figure><EditorialImage image={interview.portrait} direction={article.artDirection} priority sizes="(min-width: 900px) 45vw, 100vw" /><PhotoCaption image={interview.portrait} /></figure></div> : <><header className="reading-header">{format === 'feature' ? <><div>{headline}</div><div><p className="reading-dek">{article.dek}</p>{byline}</div></> : <>{headline}<p className="reading-dek">{article.dek}</p>{byline}</>}</header><figure className="reading-hero"><EditorialImage image={article.coverImage} direction={article.artDirection} priority /><PhotoCaption image={article.coverImage} /></figure></>}
    <article className="reading-body" aria-label="Story content">
      {interview && <><p>{interview.intro}</p>{interview.keyQuote && <figure className="reading-quote"><blockquote>“{interview.keyQuote}”</blockquote><figcaption>{interview.subjectName}{interview.subjectTitle && ` / ${interview.subjectTitle}`}</figcaption></figure>}{interview.qas.map((qa, index) => <section key={index} className="interview-qa"><span className="eyebrow">{qa.speaker || 'ÉLAN'}</span><h2>{qa.question}</h2><p>{qa.answer}</p></section>)}{interview.secondaryPortrait && <figure><EditorialImage image={interview.secondaryPortrait} sizes="(min-width: 720px) 680px, 100vw" /><PhotoCaption image={interview.secondaryPortrait} /></figure>}</>}
      <ArticleBody blocks={article.content} />
      {(instagram || portfolio) && <nav className="reading-tags" aria-label="Subject links">{instagram && <a href={instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}{portfolio && <a href={portfolio} target="_blank" rel="noopener noreferrer">Portfolio ↗</a>}</nav>}
      {!interview && article.content.length === 0 && <p className="text-sm text-neutral-600">The full text of this story is not available yet.</p>}
      {article.tags.length > 0 && <nav aria-label="Story topics" className="reading-tags">{article.tags.map(tag => <Link key={tag} href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`}>{tag}</Link>)}</nav>}
      <aside className="author-note"><span className="eyebrow">The contributor</span><h2><Link href={`/author/${encodeURIComponent(article.author.id)}`}>{article.author.name}</Link></h2>{article.author.role && <p>{article.author.role}</p>}{article.author.bio && <p>{article.author.bio}</p>}</aside>
    </article>
    {related.length > 0 && <section className="editorial-section" aria-labelledby="related-title"><div className="section-heading"><h2 id="related-title">Keep reading</h2><Link className="eyebrow" href={`/category/${article.category}`}>More in {article.categoryLabel} ↗</Link></div><div className="related-grid">{related.map(a => <StoryCard key={a.id} article={a} />)}</div></section>}
  </main><Footer /></>;
}

import type { Article, Cover } from '@/types/editorial';
export function curateWorld(articles: Article[], covers: Cover[]) {
  const cover = covers.find((c) => c.isHomepage);
  const used = new Set<string>(cover?.story ? [cover.story.id] : []);
  const take = (items: Article[], count: number) =>
    items
      .filter((a) => !used.has(a.id))
      .slice(0, count)
      .map((a) => {
        used.add(a.id);
        return a;
      });
  const sorted = [...articles].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  const lead = cover
    ? undefined
    : take(
        sorted.filter((a) => a.isLead),
        1,
      )[0] ||
      take(
        sorted.filter((a) => a.type === 'feature' || a.type === 'interview'),
        1,
      )[0] ||
      take(sorted, 1)[0];
  const next = take(
    sorted.filter((a) => a.franchise === 'new_guard'),
    3,
  );
  const originals = take(
    sorted.filter((a) => a.type === 'original'),
    3,
  );
  const edit = take(
    sorted.filter(
      (a) => a.franchise === 'the_edit' || a.franchise === 'culture_edit',
    ),
    3,
  );
  const entertainment = take(
    sorted.filter(
      (a) => a.category === 'entertainment' || a.category === 'music',
    ),
    3,
  );
  const culture = take(
    sorted.filter((a) => ['style', 'culture'].includes(a.category)),
    3,
  );
  const latest = take(sorted, 5);
  return { cover, lead, next, originals, edit, entertainment, culture, latest };
}

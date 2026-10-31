import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://localhost:3101';
const response = await fetch(`${base}/api/editorial/search`);
assert.equal(response.status, 200);
const stories = await response.json();
const paths = new Set(['/', '/about', '/privacy', '/terms', '/robots.txt', '/sitemap.xml', ...['culture','people','entertainment','style','life','places'].map(s => `/category/${s}`)]);
for (const story of stories) {
 paths.add(`/${story.type === 'standard' ? 'article' : story.type}/${story.slug}`);
 paths.add(`/author/${encodeURIComponent(story.author.id)}`);
 for (const tag of story.tags) paths.add(`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g,'-'))}`);
}
let count=0;
for (const path of paths) {
 const result = await fetch(base+path);
 assert.equal(result.status,200,`${path} returned ${result.status}`);
 const body = await result.text();
 if (!path.endsWith('.xml') && !path.endsWith('.txt')) {
   assert.match(body, /<h1[\s>]/, `${path} needs a page heading`);
   assert.ok(body.includes('main-content'), `${path} needs a skip target`);
 }
 if (path === '/') {
   const lead = stories.find(story => story.isLead) || stories[0];
   if (stories.some(story => story.franchise === 'new_guard' && story.id !== lead?.id)) assert.ok(body.includes('id="wave-title"'));
   assert.ok(!body.includes('24m ago'));
   assert.ok(!body.includes('You are now subscribed'));
 }
 count++;
}
for (const path of ['/category/no-such-desk','/article/no-such-story','/interview/no-such-person']) {
 assert.equal((await fetch(base+path)).status,404,path);
}
console.log(JSON.stringify({base,stories:stories.length,publicRoutesPassed:count,notFoundRoutesPassed:3}));

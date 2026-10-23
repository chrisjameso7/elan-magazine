import {test} from 'node:test';import assert from 'node:assert/strict';
import {resolveMedia,hasMedia} from '../src/lib/media';
import {storageConfigured} from '../src/lib/storage';
import {toArticle,toStoredArticle} from '../src/lib/payload-adapter';
import {MOCK_ARTICLES} from '../src/data/mockArticles';
import {Media} from '../src/collections/Media';
test('uploads override legacy URLs while preserving editorial overrides',()=>{
 const asset={id:7,url:'/api/media/file/photo.jpg',alt:'Uploaded alt',credit:'Photographer'};
 assert.deepEqual(resolveMedia({url:'https://old.test/image.jpg',asset,caption:'Our caption'}),{url:asset.url,alt:asset.alt,caption:'Our caption',credit:asset.credit});
 assert.equal(resolveMedia({asset,alt:'Our alt'}).alt,'Our alt');assert.equal(hasMedia({asset:7}),true);
 assert.equal(hasMedia({url:'https://example.test/a.jpg'}),false);
 assert.throws(()=>resolveMedia({asset:7}),/Populate/);
});
test('cover, block, portrait, duo, and contributor uploads adapt to public photos',()=>{
 const source=MOCK_ARTICLES.find(a=>a.interview)!;const asset={id:7,url:'/api/media/file/photo.jpg',alt:'Uploaded photo'};
 const stored={...toStoredArticle(source),author:{...source.author,avatarUpload:asset},coverImage:{asset},
  content:[{blockType:'image' as const,image:{asset}},{blockType:'image_duo' as const,images:[{asset},{asset}]}],
  interview:{...source.interview!,portrait:{asset},secondaryPortrait:{asset}}};
 const article=toArticle(stored);assert.equal(article.coverImage.url,asset.url);assert.equal(article.author.avatar,asset.url);
 assert.equal(article.interview!.portrait.url,asset.url);assert.equal(article.interview!.secondaryPortrait!.url,asset.url);
 assert.equal(article.content[0].type,'image');assert.equal(article.content[1].type,'image_duo');
 assert.ok(!JSON.stringify(article).includes('"asset"'));
});
test('storage requires every server credential and upload access stays with owner',async()=>{
 assert.equal(storageConfigured({S3_BUCKET:'media'}),false);
 assert.equal(storageConfigured({S3_ENDPOINT:'https://s3.test',S3_BUCKET:'media',S3_ACCESS_KEY_ID:'key',S3_SECRET_ACCESS_KEY:'secret'}),true);
 for(const action of ['create','update','delete'] as const)assert.equal(await Media.access![action]!({req:{user:null}} as never),false);
});

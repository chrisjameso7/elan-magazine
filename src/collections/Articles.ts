import type { CollectionConfig } from 'payload';
import { DESKS, FRANCHISES, type InterviewData } from '../types/editorial';
import { text, media, hex, contentBlocks } from './fields';
export const Articles: CollectionConfig = {
  slug: 'articles', admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  access: {
    read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
    create: ({ req }) => !!req.user, update: ({ req }) => !!req.user, delete: ({ req }) => !!req.user,
  },
  fields: [
    text('id', true), { name: 'slug', type: 'text', required: true, unique: true, index: true },
    text('title', true), { name: 'dek', type: 'textarea', required: true },
    { name: 'category', type: 'select', required: true, options: DESKS.map(({ slug, label }) => ({ value: slug, label })) },
    { name: 'categoryLabel', type: 'text', admin: { readOnly: true }, hooks: { beforeValidate: [({ siblingData }) => DESKS.find((d) => d.slug === siblingData.category)?.label] } },
    { name: 'franchise', type: 'select', options: [...FRANCHISES] },
    { name: 'tags', type: 'array', fields: [text('tag', true)] },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
    { name: 'publishedAt', type: 'date', required: true }, text('dateFormatted'), text('readTime', true),
    media('coverImage', true),
    { name: 'type', type: 'select', required: true, options: ['standard', 'feature', 'interview'] },
    ...['isLead', 'isEditorPick', 'isTrending'].map((name) => ({ name, type: 'checkbox' as const })),
    { name: 'trendingRank', type: 'number', min: 1 },
    { name: 'artDirection', type: 'group', fields: [
      { ...hex('accentHex', true), defaultValue: '#6B2236' }, hex('bgOverrideHex'),
      { name: 'heroFocalPoint', type: 'group', fields: ['x', 'y'].map((name) => ({ name, type: 'number' as const, required: true, defaultValue: 50, min: 0, max: 100 })) },
    ] },
    { name: 'content', type: 'blocks', blocks: contentBlocks },
    { name: 'interview', type: 'group',
      validate: (value: unknown, { siblingData }) => {
        if ((siblingData as { type?: string }).type !== 'interview') return true;
        const interview = value as Partial<InterviewData> | null;
        return (!!interview?.subjectName?.trim() && !!interview.subjectTitle?.trim() && !!interview.intro?.trim() && !!interview.keyQuote?.trim() && !!interview.portrait?.url && !!interview.portrait?.alt && !!interview.qas?.length) || 'Interviews require a subject, introduction, portrait, key quote, and Q&A.';
      },
      admin: { condition: (_, siblingData) => siblingData.type === 'interview' }, fields: [
      text('subjectName'), text('subjectTitle'), { name: 'intro', type: 'textarea' }, media('portrait'), media('secondaryPortrait'),
      { name: 'keyQuote', type: 'textarea' },
      { name: 'qas', type: 'array', fields: [text('question', true), { name: 'answer', type: 'textarea', required: true }, text('speaker')] },
      { name: 'socialLinks', type: 'group', fields: [text('instagram'), text('portfolio')] },
    ] },
    { name: 'isDevMock', type: 'checkbox', defaultValue: false },
  ],
};

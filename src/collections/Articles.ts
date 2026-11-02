import { hasMedia } from '../lib/media';
import { headAdminOnly, publicEditorialRead } from './access';
import { productionField, sponsorshipField } from './worldFields';
import { videoSource } from '../lib/video';
import type { CollectionConfig } from 'payload';
import { DESKS, FRANCHISES, type InterviewData } from '../types/editorial';
import { text, media, mediaFields, hex, contentBlocks } from './fields';
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  access: {
    read: publicEditorialRead,
    create: headAdminOnly,
    update: headAdminOnly,
    delete: headAdminOnly,
  },
  fields: [
    {
      ...text('id', true),
      defaultValue: () => crypto.randomUUID(),
      admin: { readOnly: true },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) =>
            value ||
            (typeof siblingData.title === 'string'
              ? siblingData.title
                  .normalize('NFKD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')
              : ''),
        ],
      },
    },
    text('title', true),
    { name: 'dek', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        ...DESKS.map(({ slug, label }) => ({ value: slug, label })),
        { value: 'life', label: 'Life (legacy; shown in Culture)' },
        { value: 'places', label: 'Places (legacy; shown in Culture)' },
      ],
    },
    {
      name: 'categoryLabel',
      type: 'text',
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ siblingData }) =>
            DESKS.find((d) => d.slug === siblingData.category)?.label,
        ],
      },
    },
    { name: 'franchise', type: 'select', options: [...FRANCHISES] },
    { name: 'tags', type: 'array', fields: [text('tag', true)] },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        description:
          'Publish with a future date to schedule public visibility. Drafts remain private.',
      },
    },
    text('dateFormatted'),
    text('readTime', true),
    media('coverImage', true),
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['standard', 'feature', 'interview', 'original'],
    },
    {
      name: 'personalities',
      type: 'relationship',
      relationTo: 'personalities',
      hasMany: true,
    },
    {
      name: 'gallery',
      type: 'array',
      validate: (value: unknown) =>
        !value ||
        (Array.isArray(value) && value.every(hasMedia)) ||
        'Every gallery photo needs an upload or an image URL and alt text.',
      fields: mediaFields(),
    },
    {
      ...productionField,
      validate: (
        value: unknown,
        { siblingData }: { siblingData: { type?: string } },
      ) =>
        (siblingData as { type?: string }).type !== 'original' ||
        !!videoSource((value as { videoUrl?: string })?.videoUrl) ||
        'Original productions require a playable video URL.',
    },
    sponsorshipField,
    ...['isLead', 'isEditorPick', 'isTrending'].map((name) => ({
      name,
      type: 'checkbox' as const,
    })),
    { name: 'trendingRank', type: 'number', min: 1 },
    {
      name: 'artDirection',
      type: 'group',
      fields: [
        { ...hex('accentHex', true), defaultValue: '#6B2236' },
        hex('bgOverrideHex'),
        {
          name: 'heroFocalPoint',
          type: 'group',
          fields: ['x', 'y'].map((name) => ({
            name,
            type: 'number' as const,
            required: true,
            defaultValue: 50,
            min: 0,
            max: 100,
          })),
        },
      ],
    },
    { name: 'content', type: 'blocks', blocks: contentBlocks },
    {
      name: 'interview',
      type: 'group',
      validate: (
        value: unknown,
        { siblingData }: { siblingData: { type?: string } },
      ) => {
        if ((siblingData as { type?: string }).type !== 'interview')
          return true;
        const interview = value as Partial<InterviewData> | null;
        return (
          (!!interview?.subjectName?.trim() &&
            !!interview.subjectTitle?.trim() &&
            !!interview.intro?.trim() &&
            !!interview.keyQuote?.trim() &&
            hasMedia(interview.portrait) &&
            !!interview.qas?.length) ||
          'Interviews require a subject, introduction, portrait, key quote, and Q&A.'
        );
      },
      admin: {
        condition: (_, siblingData) => siblingData.type === 'interview',
      },
      fields: [
        text('subjectName'),
        text('subjectTitle'),
        { name: 'intro', type: 'textarea' },
        media('portrait'),
        media('secondaryPortrait'),
        { name: 'keyQuote', type: 'textarea' },
        {
          name: 'qas',
          type: 'array',
          fields: [
            text('question', true),
            { name: 'answer', type: 'textarea', required: true },
            text('speaker'),
          ],
        },
        {
          name: 'socialLinks',
          type: 'group',
          fields: [text('instagram'), text('portfolio')],
        },
      ],
    },
    { name: 'isDevMock', type: 'checkbox', defaultValue: false },
  ],
};

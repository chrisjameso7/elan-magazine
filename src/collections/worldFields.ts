import type { Field, GroupField } from 'payload';
import { text } from './fields';
import { videoSource } from '../lib/video';

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) =>
        value ||
        String(siblingData.title || siblingData.name || '')
          .normalize('NFKD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
    ],
  },
};
export const releaseFields: Field[] = [
  {
    name: 'publishedAt',
    type: 'date',
    required: true,
    index: true,
    admin: {
      description:
        'Set a future date and Publish to schedule public visibility. Drafts remain private. Dates are stored in UTC.',
    },
  },
  {
    name: 'isDevMock',
    type: 'checkbox',
    defaultValue: false,
    label: 'Demonstration content — never public',
  },
];
export const productionField: GroupField = {
  name: 'production',
  type: 'group',
  fields: [
    {
      ...text('videoUrl'),
      label: 'Video URL',
      admin: { description: 'HTTPS MP4/WebM, YouTube, or Vimeo. No autoplay.' },
      validate: (value: unknown) =>
        !value ||
        !!videoSource(String(value)) ||
        'Use a supported HTTPS video URL.',
    },
    { name: 'description', type: 'textarea' },
    text('credits'),
    text('duration'),
  ],
};
export const sponsorshipField: Field = {
  name: 'sponsorship',
  type: 'group',
  fields: [
    { name: 'sponsored', type: 'checkbox', label: 'Sponsored production' },
    text('partner'),
    { name: 'disclosure', type: 'textarea' },
  ],
  validate: (value: unknown) => {
    const data = value as {
      sponsored?: boolean;
      partner?: string;
      disclosure?: string;
    } | null;
    return (
      !data?.sponsored ||
      (!!data.partner?.trim() && !!data.disclosure?.trim()) ||
      'Sponsored productions require a partner and a clear disclosure.'
    );
  },
};

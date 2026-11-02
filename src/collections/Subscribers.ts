import { randomUUID } from 'node:crypto';
import type { CollectionConfig } from 'payload';
import { headAdminOnly } from './access';

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'welcomeStatus', 'subscribedAt'],
  },
  access: {
    read: headAdminOnly,
    create: headAdminOnly,
    update: headAdminOnly,
    delete: headAdminOnly,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (typeof data?.email === 'string')
          data.email = data.email.trim().toLowerCase();
        return data;
      },
    ],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: ['active', 'unsubscribed'],
      index: true,
    },
    {
      name: 'subscriptionId',
      type: 'text',
      required: true,
      defaultValue: () => randomUUID(),
      admin: { hidden: true },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    { name: 'unsubscribedAt', type: 'date' },
    {
      name: 'welcomeStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: ['pending', 'sent', 'failed'],
    },
    { name: 'welcomeAttemptedAt', type: 'date', admin: { readOnly: true } },
    { name: 'welcomeMessageId', type: 'text', admin: { readOnly: true } },
  ],
};

// Private, short-lived counters shared by all serverless instances. No raw IPs are stored.
export const NewsletterRateLimits: CollectionConfig = {
  slug: 'newsletter-rate-limits',
  timestamps: false,
  admin: { hidden: true },
  access: {
    read: headAdminOnly,
    create: () => false,
    update: () => false,
    delete: headAdminOnly,
  },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'windowStart', type: 'date', required: true, index: true },
    { name: 'attempts', type: 'number', required: true, defaultValue: 1 },
  ],
};

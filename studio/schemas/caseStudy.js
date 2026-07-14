import {defineField, defineType} from 'sanity'

const VIDEO_SOURCE_OPTIONS = [
  {title: 'None', value: 'none'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Vimeo', value: 'vimeo'},
  {title: 'Cloudflare Stream', value: 'cloudflare'},
]

const CATEGORY_OPTIONS = [
  {title: 'Social Media', value: 'social-media'},
  {title: 'Events', value: 'events'},
  {title: 'Web Build', value: 'web-build'},
  {title: 'Influencer', value: 'influencer'},
  {title: 'Creative Production', value: 'creative-production'},
  {title: 'Brand Strategy', value: 'brand-strategy'},
  {title: 'SEO / Digital', value: 'seo-digital'},
]

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The case study headline — the work described in a sentence',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL: /proof/liberty-international',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'geography',
      title: 'Geography',
      type: 'array',
      description: 'Where the work happened — shown as location credits',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'yearTimeframe',
      title: 'Year or timeframe',
      type: 'string',
      description: 'e.g. 2022–2024 or 2023',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      description: 'Full-viewport atmospheric image at the top — not a client logo or stock photo',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'oneLinerSummary',
      title: 'One-line summary',
      type: 'string',
      description: 'Used on the Proof listing page and in search results',
    }),
    defineField({
      name: 'bodyContent',
      title: 'Body content',
      type: 'array',
      description: 'Full case study. Long-form prose — no internal headers or bullet lists.',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),
    defineField({
      name: 'videoSourceType',
      title: 'Video source type',
      type: 'string',
      options: {list: VIDEO_SOURCE_OPTIONS, layout: 'radio'},
      initialValue: 'none',
    }),
    defineField({
      name: 'videoUrlOrId',
      title: 'Video URL or ID',
      type: 'string',
      description: 'YouTube/Vimeo URL or Cloudflare Stream video ID — matched to source type above',
      hidden: ({document}) => document?.videoSourceType === 'none',
    }),
    defineField({
      name: 'categoryTags',
      title: 'Category tags',
      type: 'array',
      description: 'Used for filtering on the Proof page',
      of: [{type: 'string'}],
      options: {list: CATEGORY_OPTIONS},
    }),
    defineField({
      name: 'teamMembersInvolved',
      title: 'Team members involved',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'teamMember'}]}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show in the homepage Proof Gateway teaser and at the top of the Proof listing',
      initialValue: false,
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO page title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'seoSocialImage',
      title: 'SEO social sharing image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'clientName',
      media: 'heroImage',
    },
  },
})

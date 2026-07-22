import {defineField, defineType} from 'sanity'

const VIDEO_SOURCE_OPTIONS = [
  {title: 'Cloudflare Stream (direct MP4 — plays inline)', value: 'cloudflare'},
  {title: 'YouTube (opens lightbox on click)', value: 'youtube'},
  {title: 'Vimeo (opens lightbox on click)', value: 'vimeo'},
  {title: 'Instagram Reel (opens in new tab)', value: 'instagram'},
]

const LOGO_STYLE_OPTIONS = [
  {title: 'Normal', value: 'normal'},
  {title: 'Accent (teal glow)', value: 'accent'},
  {title: 'Heavy (bold weight)', value: 'heavy'},
]

export default defineType({
  name: 'proofPage',
  title: 'Proof Page',
  type: 'document',
  fields: [
    // Hero
    defineField({
      name: 'heroBgImage',
      title: 'Hero background image',
      type: 'image',
      description: 'Full-viewport atmospheric image behind the hero text',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heroLocations',
      title: 'Hero location credits',
      type: 'string',
      description: 'Shown below the hero text — e.g. "UAE · India · East Africa · Europe"',
      initialValue: 'UAE · India · East Africa · Europe',
    }),
    defineField({
      name: 'heroYears',
      title: 'Hero years',
      type: 'string',
      description: 'Year range shown below locations — e.g. "2020—"',
      initialValue: '2020—',
    }),
    defineField({
      name: 'philosophyText',
      title: 'Philosophy statement',
      type: 'text',
      rows: 3,
      description: 'Short editorial statement shown below the hero. Plain text only.',
      initialValue: 'No awards shelf, no vanity metrics. Just the work: what the brief was, what we did, and what changed.',
    }),

    // Reel strip
    defineField({
      name: 'reelVideos',
      title: 'Reel strip — "Work in motion"',
      type: 'array',
      description: 'Vertical 9:16 video slots shown in the reel strip section. Drag to reorder. Toggle active to show/hide.',
      of: [
        {
          type: 'object',
          name: 'reelEntry',
          title: 'Reel slot',
          fields: [
            {
              name: 'clientName',
              title: 'Client name',
              type: 'string',
              description: 'Displayed in the slot label',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Project title',
              type: 'string',
              description: 'Short descriptor — e.g. "Destination Campaign"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'sourceType',
              title: 'Source type',
              type: 'string',
              options: {list: VIDEO_SOURCE_OPTIONS, layout: 'radio'},
            },
            {
              name: 'videoUrlOrId',
              title: 'Video URL or ID',
              type: 'string',
              description: 'Leave empty to show a colour placeholder instead of playing a video',
            },
            {
              name: 'active',
              title: 'Active',
              type: 'boolean',
              description: 'Switch off to hide without deleting',
              initialValue: true,
            },
          ],
          preview: {
            select: {title: 'clientName', subtitle: 'title'},
          },
        },
      ],
    }),

    // Logo wall
    defineField({
      name: 'logoWallRow1',
      title: 'Logo wall — row 1 (left scroll)',
      type: 'array',
      description: 'Brand names in the first marquee row. No need to duplicate — the marquee loops automatically.',
      of: [
        {
          type: 'object',
          name: 'logoEntry',
          title: 'Brand',
          fields: [
            {
              name: 'name',
              title: 'Brand name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'style',
              title: 'Display style',
              type: 'string',
              options: {list: LOGO_STYLE_OPTIONS, layout: 'radio'},
              initialValue: 'normal',
            },
          ],
          preview: {
            select: {title: 'name', subtitle: 'style'},
          },
        },
      ],
    }),
    defineField({
      name: 'logoWallRow2',
      title: 'Logo wall — row 2 (right scroll)',
      type: 'array',
      description: 'Brand names in the second marquee row (scrolls in reverse).',
      of: [
        {
          type: 'object',
          name: 'logoEntry',
          title: 'Brand',
          fields: [
            {
              name: 'name',
              title: 'Brand name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'style',
              title: 'Display style',
              type: 'string',
              options: {list: LOGO_STYLE_OPTIONS, layout: 'radio'},
              initialValue: 'normal',
            },
          ],
          preview: {
            select: {title: 'name', subtitle: 'style'},
          },
        },
      ],
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
  ],
  preview: {
    prepare() {
      return {title: 'Proof Page'}
    },
  },
})

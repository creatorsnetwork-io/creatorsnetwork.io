import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'First name — shown as the page heading on arrival',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page slug',
      type: 'slug',
      description: 'The URL for their page: /campaigns, /studio, /experiences, /engine. Set once, do not change after launch.',
      options: {source: 'name'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageNumber',
      title: 'Page number in The Five',
      type: 'string',
      description: '01, 02, 03, 04, or 05',
    }),
    defineField({
      name: 'roleContext',
      title: 'Role context',
      type: 'string',
      description: 'A short phrase to identify the scope of their page internally — not displayed as a job title',
    }),

    // Portraits
    defineField({
      name: 'portraitFull',
      title: 'Portrait — full viewport',
      type: 'image',
      description: 'Cinematic portrait at full size — shown on their own page',
      options: {hotspot: true},
    }),
    defineField({
      name: 'portraitPanel',
      title: 'Portrait — panel crop (homepage)',
      type: 'image',
      description: 'Tighter vertical crop used in The Five panels on the homepage',
      options: {hotspot: true},
    }),

    // Homepage hover
    defineField({
      name: 'fivePanelHoverQuote',
      title: 'Five panel hover quote',
      type: 'string',
      description: 'One line shown on hover on the homepage. Short, first person, not a service description.',
    }),

    // Scroll 01
    defineField({
      name: 'scroll01ArrivalQuote',
      title: 'Scroll 01 arrival quote',
      type: 'string',
      description: 'The full version of the quote that was teased on the homepage panel',
    }),

    // Scroll 02
    defineField({
      name: 'scroll02BgImage',
      title: 'Scroll 02 background image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'scroll02Pov',
      title: 'Scroll 02 — point of view',
      type: 'array',
      description: '2 to 4 sentences. First person. Who they are as a practitioner.',
      of: [{type: 'block', styles: [], lists: [], marks: {decorators: [], annotations: []}}],
    }),

    // Scroll 03
    defineField({
      name: 'scroll03BgImage',
      title: 'Scroll 03 background image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'scroll03Practice',
      title: 'Scroll 03 — practice description',
      type: 'array',
      description: 'Two short paragraphs on how they work. No bullets.',
      of: [{type: 'block', styles: [], lists: [], marks: {decorators: [], annotations: []}}],
    }),

    // Proof Gateway
    defineField({
      name: 'proofGatewayBgImage',
      title: 'Proof Gateway background image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'proofGatewayLocations',
      title: 'Proof Gateway location labels',
      type: 'array',
      description: 'Cities relevant to their specific client work',
      of: [{type: 'string'}],
    }),

    // Scroll 05
    defineField({
      name: 'scroll05ClosingLine',
      title: 'Scroll 05 closing line',
      type: 'string',
      description: 'A final open-ended statement — not a call to action',
    }),
    defineField({
      name: 'nextPage',
      title: 'Next page',
      type: 'reference',
      description: 'Which team member page follows — controls the "Next, 0X" link',
      to: [{type: 'teamMember'}],
    }),
    defineField({
      name: 'featuredCaseStudies',
      title: 'Featured case studies — "The work" section',
      type: 'array',
      description: 'Select which case studies appear in the work section on this page. Drag to reorder. If left empty, the hardcoded placeholder content shows instead.',
      of: [{type: 'reference', to: [{type: 'caseStudy'}]}],
    }),

    // Videos (hover-to-play strip shown on this member's page)
    defineField({
      name: 'videos',
      title: 'Video strip',
      type: 'array',
      description: 'Short-form vertical videos shown in the "Work in motion" strip on this page. Drag to reorder. Switch active off to hide without deleting.',
      of: [
        {
          type: 'object',
          name: 'videoEntry',
          title: 'Video',
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Client name, project name, or short label shown below the video',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'sourceType',
              title: 'Source type',
              type: 'string',
              options: {
                list: [
                  {title: 'Cloudflare Stream (direct MP4 — plays inline)', value: 'cloudflare'},
                  {title: 'YouTube (opens lightbox on click)', value: 'youtube'},
                  {title: 'Vimeo (opens lightbox on click)', value: 'vimeo'},
                  {title: 'Instagram Reel (opens in new tab)', value: 'instagram'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'videoUrlOrId',
              title: 'Video URL or ID',
              type: 'string',
              description: 'Cloudflare: stream video ID. YouTube: full URL or video ID. Vimeo: full URL or video ID. Instagram: full Reel URL.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'thumbnailImage',
              title: 'Thumbnail (optional)',
              type: 'image',
              description: 'Cover image shown before the video plays. If empty, a colour placeholder is used.',
              options: {hotspot: true},
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
            select: {title: 'caption', subtitle: 'sourceType'},
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
    defineField({
      name: 'seoSocialImage',
      title: 'SEO social sharing image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'pageNumber',
      media: 'portraitPanel',
      mediaFull: 'portraitFull',
    },
    prepare({title, subtitle, media, mediaFull}) {
      return {
        title,
        subtitle: subtitle ? `0${subtitle} — The Five` : '',
        media: media || mediaFull,
      }
    },
  },
})

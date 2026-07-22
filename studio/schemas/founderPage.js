import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'founderPage',
  title: 'Founder Page',
  type: 'document',
  fields: [
    defineField({
      name: 'portrait',
      title: 'Portrait — Scroll 01 background',
      type: 'image',
      description: 'Cinematic portrait, full viewport, immersive background on arrival',
      options: {hotspot: true},
    }),
    defineField({
      name: 'openingQuote',
      title: 'Opening quote (Scroll 01)',
      type: 'string',
      description: 'Shown after the portrait loads. Something Himanshu would actually say — not a tagline.',
    }),
    defineField({
      name: 'scroll02BgImage',
      title: 'Scroll 02 background image',
      type: 'image',
      description: 'Optional close-in crop for the point of view section',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      title: 'Bio (Scroll 02)',
      type: 'array',
      description: '2 to 3 paragraphs. His story as a practitioner — not a LinkedIn summary. No bullet points.',
      of: [{type: 'block', styles: [], lists: [], marks: {decorators: [], annotations: []}}],
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      description: 'Year-by-year milestones. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'milestone',
          title: 'Milestone',
          fields: [
            {name: 'year', title: 'Year', type: 'string'},
            {name: 'event', title: 'Event', type: 'string', description: 'e.g. Started CN during COVID'},
          ],
          preview: {
            select: {title: 'year', subtitle: 'event'},
          },
        },
      ],
    }),
    defineField({
      name: 'castTeamOrder',
      title: 'The Cast — team order',
      type: 'array',
      description: 'Which team members appear on The Founder page and in what order. Drag to reorder.',
      of: [{type: 'reference', to: [{type: 'teamMember'}]}],
    }),
    defineField({
      name: 'closingLine',
      title: 'Closing line',
      type: 'string',
      description: 'Final line before The Cast — an open-ended statement, not a CTA',
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
    prepare() {
      return {title: 'Founder Page'}
    },
  },
})

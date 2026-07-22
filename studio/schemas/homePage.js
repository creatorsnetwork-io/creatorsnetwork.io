import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroBgImage',
      title: 'Hero background image',
      type: 'image',
      description: 'Full-bleed image spanning Scroll 01 and 02',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heroBgVideo',
      title: 'Hero background video (optional)',
      type: 'string',
      description: 'Cloudflare Stream video ID — leave blank to use the still photo instead',
    }),
    defineField({
      name: 'openingLine',
      title: 'Opening line (Scroll 01)',
      type: 'string',
      description: 'One sentence that fades in on arrival. Leave blank for pure atmosphere.',
    }),
    defineField({
      name: 'cnStoryVideoId',
      title: 'CN Story — Cloudflare Stream video ID',
      type: 'string',
      description: 'The Cloudflare Stream video ID for the CN Story film shown on the homepage. Leave blank to use the local video file.',
    }),
    defineField({
      name: 'bits',
      title: 'The Bit — joke machine',
      type: 'array',
      description: 'Jokes shown in the coin-insert machine. Each entry needs a short preview (the tease shown before dispensing) and a full slip (the punchline printed on the receipt).',
      of: [
        {
          type: 'object',
          name: 'bit',
          title: 'Joke',
          fields: [
            {
              name: 'preview',
              title: 'Preview (short tease shown in the window)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'slip',
              title: 'Slip (full punchline on the receipt)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {title: 'preview', subtitle: 'slip'},
          },
        },
      ],
    }),
    defineField({
      name: 'theFiveOrder',
      title: 'The Five — team order',
      type: 'array',
      description: 'Drag to reorder which team member appears in which panel',
      of: [{type: 'reference', to: [{type: 'teamMember'}]}],
    }),
    defineField({
      name: 'proofGatewayBgImage',
      title: 'Proof Gateway background image (Scroll 03)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'proofGatewayLocations',
      title: 'Proof Gateway location labels',
      type: 'array',
      description: 'Geography names shown as film-credit text: Mumbai, Dubai, Nairobi…',
      of: [{type: 'string'}],
      initialValue: ['Mumbai', 'Dubai', 'Nairobi', 'Frankfurt', 'Bangalore'],
    }),
    defineField({
      name: 'proofGatewayYear',
      title: 'Proof Gateway year marker',
      type: 'string',
      description: 'Opening year shown as "2020—" — the dash signals ongoing',
      initialValue: '2020—',
    }),
    defineField({
      name: 'founderPreviewQuote',
      title: 'Founder preview quote (Scroll 04)',
      type: 'string',
      description: 'One line over the portrait — something Himanshu would actually say',
    }),
    defineField({
      name: 'founderPortrait',
      title: 'Founder portrait — Scroll 04 background',
      type: 'image',
      description: 'Full-viewport background for Scroll 04',
      options: {hotspot: true},
    }),
    defineField({
      name: 'closeEmail',
      title: 'Close section email (Scroll 05)',
      type: 'string',
      description: 'Defaults to Site Settings contact email if left blank',
    }),
    defineField({
      name: 'closeCity',
      title: 'Close section location',
      type: 'string',
      description: 'Text shown below the email in the close section — type exactly what you want displayed, e.g. "Dubai | India" or "Dubai · Mumbai".',
      initialValue: 'Dubai | India',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})

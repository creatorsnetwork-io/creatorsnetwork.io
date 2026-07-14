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
      title: 'Close section city',
      type: 'string',
      initialValue: 'Dubai',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})

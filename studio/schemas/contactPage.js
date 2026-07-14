import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'bgImage',
      title: 'Background image',
      type: 'image',
      description: 'Atmospheric full-viewport image behind the contact form and details',
      options: {hotspot: true},
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email (display)',
      type: 'string',
      description: 'Defaults to Site Settings if blank',
    }),
    defineField({
      name: 'indiaPhone',
      title: 'India phone number',
      type: 'string',
    }),
    defineField({
      name: 'uaePhone',
      title: 'UAE phone number',
      type: 'string',
    }),
    defineField({
      name: 'mumbaiAddress',
      title: 'Mumbai office address',
      type: 'text',
      rows: 3,
      initialValue: '91 Springboard Business Hub, CST Road, Kalina, BKC, Santacruz East, Mumbai 400098',
    }),
    defineField({
      name: 'delhiAddress',
      title: 'Delhi office address',
      type: 'text',
      rows: 3,
      initialValue: 'Unit 111, ACY-Aggarwal City Square, Sector 3, Rohini, New Delhi 110085',
    }),
    defineField({
      name: 'uaeAddress',
      title: 'UAE address',
      type: 'text',
      rows: 2,
      initialValue: 'Shams Business Center, Sharjah Media City Free Zone, Sharjah',
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
      return {title: 'Contact Page'}
    },
  },
})

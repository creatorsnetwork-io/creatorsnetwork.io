import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      description: 'Used in browser tabs and SEO metadata',
      initialValue: 'Creators Network',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO description',
      type: 'text',
      rows: 3,
      description: 'Shown in Google search results for pages without their own SEO description',
    }),
    defineField({
      name: 'defaultSocialImage',
      title: 'Default social sharing image',
      type: 'image',
      description: 'Fallback image when a page is shared on LinkedIn or WhatsApp',
      options: {hotspot: true},
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      initialValue: 'hello@creatorsnetwork.io',
    }),
    defineField({
      name: 'indiaPhone',
      title: 'India phone number',
      type: 'string',
      initialValue: '+91 8750 82 82 00',
    }),
    defineField({
      name: 'uaePhone',
      title: 'UAE phone number',
      type: 'string',
      initialValue: '+971 55 365 3300',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'xUrl',
      title: 'X (Twitter) URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'string',
      initialValue: 'Believe in The Power of Creation',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})

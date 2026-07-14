import {defineField, defineType} from 'sanity'

const ARTICLE_TAGS = [
  {title: 'Creator Economy', value: 'creator-economy'},
  {title: 'Brand Strategy', value: 'brand-strategy'},
  {title: 'Events', value: 'events'},
  {title: 'AI', value: 'ai'},
  {title: 'Dubai', value: 'dubai'},
  {title: 'India', value: 'india'},
  {title: 'Influencer Marketing', value: 'influencer-marketing'},
  {title: 'Social Media', value: 'social-media'},
  {title: 'Founder', value: 'founder'},
]

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL: /lab/creator-economy-india-2026',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      description: 'Links to a team member. Determines which page surfaces this article.',
      to: [{type: 'teamMember'}],
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish date',
      type: 'date',
      description: 'Controls sort order on listing pages',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bodyContent',
      title: 'Body content',
      type: 'array',
      description: 'Full article. Long-form editorial prose in the CJP register — no bullet points, no headers inside the body. Specific named examples, analytical point of view.',
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
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Used for filtering on listing pages',
      of: [{type: 'string'}],
      options: {list: ARTICLE_TAGS},
    }),
    defineField({
      name: 'featuredOnFounder',
      title: 'Featured on Founder page',
      type: 'boolean',
      description: 'Highlight this article in the featured writing section on The Founder page',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOnLab',
      title: 'Featured on Lab page',
      type: 'boolean',
      description: 'Show in the Lab page featured section',
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
      date: 'publishDate',
      media: 'heroImage',
    },
    prepare({title, date, media}) {
      return {
        title,
        subtitle: date,
        media,
      }
    },
  },
})

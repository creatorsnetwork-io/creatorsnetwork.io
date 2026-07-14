import {defineField, defineType} from 'sanity'

const VIDEO_SOURCE_OPTIONS = [
  {title: 'Cloudflare Stream', value: 'cloudflare'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Vimeo', value: 'vimeo'},
  {title: 'Instagram Reel URL', value: 'instagram'},
]

export default defineType({
  name: 'videoStrip',
  title: 'Video Strip',
  type: 'document',
  fields: [
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description: 'Add, remove, and drag to reorder. Changes apply across all pages automatically.',
      of: [
        {
          type: 'object',
          name: 'videoEntry',
          title: 'Video',
          fields: [
            {
              name: 'sourceType',
              title: 'Source type',
              type: 'string',
              options: {list: VIDEO_SOURCE_OPTIONS, layout: 'radio'},
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'videoUrlOrId',
              title: 'Video URL or ID',
              type: 'string',
              description: 'Cloudflare video ID, YouTube URL, Vimeo URL, or Instagram Reel URL',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
              description: 'Shown as hover overlay — client name, project name, or short descriptor',
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
            select: {
              title: 'caption',
              subtitle: 'sourceType',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Untitled video',
                subtitle: subtitle,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Video Strip'}
    },
  },
})

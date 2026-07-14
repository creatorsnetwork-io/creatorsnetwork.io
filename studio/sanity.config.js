import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas/index'

// Replace YOUR_PROJECT_ID with the Project ID from sanity.io/manage
const PROJECT_ID = 'YOUR_PROJECT_ID'
const DATASET = 'production'

export default defineConfig({
  name: 'cn-studio',
  title: 'Creators Network',
  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
              ),
            S.listItem()
              .title('Founder Page')
              .id('founderPage')
              .child(
                S.document()
                  .schemaType('founderPage')
                  .documentId('founderPage')
              ),
            S.listItem()
              .title('Contact Page')
              .id('contactPage')
              .child(
                S.document()
                  .schemaType('contactPage')
                  .documentId('contactPage')
              ),
            S.listItem()
              .title('Video Strip')
              .id('videoStrip')
              .child(
                S.document()
                  .schemaType('videoStrip')
                  .documentId('videoStrip')
              ),
            S.divider(),
            S.documentTypeListItem('teamMember').title('Team Members'),
            S.documentTypeListItem('caseStudy').title('Case Studies'),
            S.documentTypeListItem('article').title('Articles'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})

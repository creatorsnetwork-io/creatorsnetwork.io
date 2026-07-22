import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas/index'

const PROJECT_ID = 'yodi9k1k'
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
            // ── Singletons ──
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('Founder Page')
              .id('founderPage')
              .child(S.document().schemaType('founderPage').documentId('founderPage')),
            S.listItem()
              .title('Contact Page')
              .id('contactPage')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
            S.listItem()
              .title('Proof Page')
              .id('proofPage')
              .child(S.document().schemaType('proofPage').documentId('proofPage')),
            S.divider(),
            // ── Repeating types ──
            S.listItem()
              .title('Team Members')
              .child(S.documentTypeList('teamMember').title('Team Members')),
            S.listItem()
              .title('Case Studies')
              .child(S.documentTypeList('caseStudy').title('Case Studies')),
            S.listItem()
              .title('Articles')
              .child(S.documentTypeList('article').title('Articles')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})

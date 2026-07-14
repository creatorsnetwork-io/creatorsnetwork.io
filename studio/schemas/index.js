import siteSettings from './siteSettings'
import homePage from './homePage'
import teamMember from './teamMember'
import caseStudy from './caseStudy'
import article from './article'
import videoStrip from './videoStrip'
import founderPage from './founderPage'
import contactPage from './contactPage'

export const schemaTypes = [
  // Singletons
  siteSettings,
  homePage,
  founderPage,
  contactPage,
  videoStrip,
  // Repeating types
  teamMember,
  caseStudy,
  article,
]

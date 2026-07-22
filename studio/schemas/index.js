import siteSettings from './siteSettings'
import homePage from './homePage'
import teamMember from './teamMember'
import caseStudy from './caseStudy'
import article from './article'
import founderPage from './founderPage'
import contactPage from './contactPage'
import proofPage from './proofPage'

export const schemaTypes = [
  // Singletons
  siteSettings,
  homePage,
  founderPage,
  contactPage,
  proofPage,
  // Repeating types
  teamMember,
  caseStudy,
  article,
]

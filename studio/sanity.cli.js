import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // Replace YOUR_PROJECT_ID with the Project ID from sanity.io/manage
    projectId: 'YOUR_PROJECT_ID',
    dataset: 'production',
  },
})

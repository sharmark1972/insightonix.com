import prisma from '../prisma.js'

export async function generateDOI(articleId: number): Promise<string> {
  const journal = await prisma.journal.findFirst()
  
  if (!journal || !journal.doi_prefix) {
    throw new Error('DOI prefix not configured. Please configure journal settings first.')
  }
  
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      issue: true
    }
  })
  
  if (!article) {
    throw new Error('Article not found')
  }
  
  if (article.doi) {
    return article.doi
  }
  
  const suffix = `${journal.issn || 'journal'}.${article.issue.volume}.${article.issue.issue_number}.${journal.doi_suffix}`
  const doi = `${journal.doi_prefix}/${suffix}`
  
  await prisma.$transaction([
    prisma.article.update({
      where: { id: articleId },
      data: { doi }
    }),
    prisma.journal.update({
      where: { id: journal.id },
      data: { doi_suffix: journal.doi_suffix + 1 }
    })
  ])
  
  return doi
}

export async function generateBatchDOIs(articleIds: number[]): Promise<{ articleId: number; doi: string }[]> {
  const results: { articleId: number; doi: string }[] = []
  
  for (const articleId of articleIds) {
    try {
      const doi = await generateDOI(articleId)
      results.push({ articleId, doi })
    } catch (error) {
      console.error(`Failed to generate DOI for article ${articleId}:`, error)
      results.push({ articleId, doi: '' })
    }
  }
  
  return results
}

export function validateDOI(doi: string): boolean {
  const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
  return doiRegex.test(doi)
}

export function getDOIMetadata(doi: string): {
  prefix: string
  suffix: string
  publisher?: string
} {
  const [prefix, suffix] = doi.split('/')
  return {
    prefix,
    suffix,
    publisher: prefix.split('.')[0] || '10'
  }
}

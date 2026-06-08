/**
 * Migration script to convert local upload paths to R2 URLs
 * Run: npm run migrate:r2
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-cfbdd8305a414da696e387e1cde70140.r2.dev';

function convertLocalPathToR2Url(localPath: string | null): string | null {
  if (!localPath) return null;
  if (localPath.startsWith('http')) return localPath;

  const fileName = localPath.split('/').pop() || '';
  return fileName ? `${publicUrl}/${fileName}` : null;
}

async function migrateArticles() {
  console.log('Migrating Article PDFs...');
  const articles = await prisma.article.findMany({
    where: {
      pdf_url: {
        startsWith: '/uploads'
      }
    }
  });

  for (const article of articles) {
    const newUrl = convertLocalPathToR2Url(article.pdf_url);
    if (newUrl) {
      await prisma.article.update({
        where: { id: article.id },
        data: { pdf_url: newUrl }
      });
      console.log(`✓ Article ${article.id}: ${article.pdf_url} → ${newUrl}`);
    }
  }
  console.log(`✓ Migrated ${articles.length} articles`);
}

async function migrateIssues() {
  console.log('\nMigrating Issue Cover Images...');
  const issues = await prisma.issue.findMany({
    where: {
      cover_image: {
        startsWith: '/uploads'
      }
    }
  });

  for (const issue of issues) {
    const newUrl = convertLocalPathToR2Url(issue.cover_image);
    if (newUrl) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: { cover_image: newUrl }
      });
      console.log(`✓ Issue ${issue.id}: ${issue.cover_image} → ${newUrl}`);
    }
  }
  console.log(`✓ Migrated ${issues.length} issues`);
}

async function migrateBoardMembers() {
  console.log('\nMigrating Board Member Profile Images...');
  const members = await prisma.boardMember.findMany({
    where: {
      profile_image: {
        startsWith: '/uploads'
      }
    }
  });

  for (const member of members) {
    const newUrl = convertLocalPathToR2Url(member.profile_image);
    if (newUrl) {
      await prisma.boardMember.update({
        where: { id: member.id },
        data: { profile_image: newUrl }
      });
      console.log(`✓ BoardMember ${member.id}: ${member.profile_image} → ${newUrl}`);
    }
  }
  console.log(`✓ Migrated ${members.length} board members`);
}

async function migrateCertificates() {
  console.log('\nMigrating Certificate URLs...');
  const certificates = await prisma.certificate.findMany({
    where: {
      certificate_url: {
        startsWith: '/uploads'
      }
    }
  });

  for (const cert of certificates) {
    const newUrl = convertLocalPathToR2Url(cert.certificate_url);
    if (newUrl) {
      await prisma.certificate.update({
        where: { id: cert.id },
        data: { certificate_url: newUrl }
      });
      console.log(`✓ Certificate ${cert.id}: ${cert.certificate_url} → ${newUrl}`);
    }
  }
  console.log(`✓ Migrated ${certificates.length} certificates`);
}

async function migrateAwards() {
  console.log('\nMigrating Award Certificate URLs...');
  const awards = await prisma.award.findMany({
    where: {
      certificate_url: {
        startsWith: '/uploads'
      }
    }
  });

  for (const award of awards) {
    const newUrl = convertLocalPathToR2Url(award.certificate_url);
    if (newUrl) {
      await prisma.award.update({
        where: { id: award.id },
        data: { certificate_url: newUrl }
      });
      console.log(`✓ Award ${award.id}: ${award.certificate_url} → ${newUrl}`);
    }
  }
  console.log(`✓ Migrated ${awards.length} awards`);
}

async function migrateEbooks() {
  console.log('\nMigrating eBooks (Cover Images & PDFs)...');

  const ebooksWithCovers = await prisma.ebook.findMany({
    where: {
      cover_image: {
        startsWith: '/uploads'
      }
    }
  });

  for (const ebook of ebooksWithCovers) {
    const newUrl = convertLocalPathToR2Url(ebook.cover_image);
    if (newUrl) {
      await prisma.ebook.update({
        where: { id: ebook.id },
        data: { cover_image: newUrl }
      });
      console.log(`✓ eBook ${ebook.id} cover: ${ebook.cover_image} → ${newUrl}`);
    }
  }

  const ebooksWithPdfs = await prisma.ebook.findMany({
    where: {
      pdf_url: {
        startsWith: '/uploads'
      }
    }
  });

  for (const ebook of ebooksWithPdfs) {
    const newUrl = convertLocalPathToR2Url(ebook.pdf_url);
    if (newUrl) {
      await prisma.ebook.update({
        where: { id: ebook.id },
        data: { pdf_url: newUrl }
      });
      console.log(`✓ eBook ${ebook.id} pdf: ${ebook.pdf_url} → ${newUrl}`);
    }
  }

  console.log(`✓ Migrated ${ebooksWithCovers.length} eBook covers and ${ebooksWithPdfs.length} eBook PDFs`);
}

async function migrateEditorialCertificates() {
  console.log('\nMigrating Editorial Certificate URLs...');
  const editorialCerts = await prisma.editorialCertificate.findMany({
    where: {
      certificate_url: {
        startsWith: '/uploads'
      }
    }
  });

  for (const cert of editorialCerts) {
    const newUrl = convertLocalPathToR2Url(cert.certificate_url);
    if (newUrl) {
      await prisma.editorialCertificate.update({
        where: { id: cert.id },
        data: { certificate_url: newUrl }
      });
      console.log(`✓ EditorialCertificate ${cert.id}: ${cert.certificate_url} → ${newUrl}`);
    }
  }
  console.log(`✓ Migrated ${editorialCerts.length} editorial certificates`);
}

async function migrateReviewerCertificates() {
  console.log('\nMigrating Reviewer Certificate URLs...');
  const reviewerCerts = await prisma.reviewerCertificate.findMany({
    where: {
      certificate_url: {
        startsWith: '/uploads'
      }
    }
  });

  for (const cert of reviewerCerts) {
    const newUrl = convertLocalPathToR2Url(cert.certificate_url);
    if (newUrl) {
      await prisma.reviewerCertificate.update({
        where: { id: cert.id },
        data: { certificate_url: newUrl }
      });
      console.log(`✓ ReviewerCertificate ${cert.id}: ${cert.certificate_url} → ${newUrl}`);
    }
  }
  console.log(`✓ Migrated ${reviewerCerts.length} reviewer certificates`);
}

async function main() {
  console.log('🚀 Starting R2 Migration...\n');
  console.log(`Public URL: ${publicUrl}\n`);

  try {
    await migrateArticles();
    await migrateIssues();
    await migrateBoardMembers();
    await migrateCertificates();
    await migrateAwards();
    await migrateEbooks();
    await migrateEditorialCertificates();
    await migrateReviewerCertificates();

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import ScrollToTop from './components/ScrollToTop'

// Public Pages
import Home from './pages/Home'
import EditorialBoard from './pages/EditorialBoard'
import Issues from './pages/Issues'
import IssueDetails from './pages/IssueDetails'
import ArticleDetails from './pages/ArticleDetails'
import Contact from './pages/Contact'
import Conferences from './pages/Conferences'
import APC from './pages/APC'
import SubmissionGuidelines from './pages/SubmissionGuidelines'
import PublicationEthics from './pages/PublicationEthics'
import PeerReviewProcess from './pages/PeerReviewProcess'
import AuthorResources from './pages/AuthorResources'
import ArticleProcessing from './pages/ArticleProcessing'
import Ebooks from './pages/Ebooks'
import EbookDetails from './pages/EbookDetails'

// Admin Pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminIssues from './pages/admin/Issues'
import AdminArticles from './pages/admin/Articles'
import AdminBoardMembers from './pages/admin/BoardMembers'
import AdminConferences from './pages/admin/Conferences'
import AdminSettings from './pages/admin/Settings'
import CertificatesPage from './pages/admin/Certificates'
import AwardsPage from './pages/admin/Awards'
import DOIManagementPage from './pages/admin/DOIManagement'
import AdminEbooks from './pages/admin/Ebooks'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="editorial-board" element={<EditorialBoard />} />
            <Route path="issues" element={<Issues />} />
            <Route path="issues/:id" element={<IssueDetails />} />
            <Route path="articles/:id" element={<ArticleDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="conferences" element={<Conferences />} />
            <Route path="apc" element={<APC />} />
            <Route path="submission-guidelines" element={<SubmissionGuidelines />} />
            <Route path="publication-ethics" element={<PublicationEthics />} />
            <Route path="peer-review-process" element={<PeerReviewProcess />} />
            <Route path="author-resources" element={<AuthorResources />} />
            <Route path="article-processing" element={<ArticleProcessing />} />
            <Route path="ebooks" element={<Ebooks />} />
            <Route path="ebooks/:id" element={<EbookDetails />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="issues" element={<AdminIssues />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="board-members" element={<AdminBoardMembers />} />
            <Route path="conferences" element={<AdminConferences />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="awards" element={<AwardsPage />} />
            <Route path="doi" element={<DOIManagementPage />} />
            <Route path="ebooks" element={<AdminEbooks />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App

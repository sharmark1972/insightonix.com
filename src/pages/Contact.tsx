import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Mail, MapPin, Building, Clock, FileText, CheckCircle, AlertCircle, Send } from 'lucide-react'
import SEO from '../components/SEO'

export default function Contact() {
  const [journal, setJournal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        setJournal(res.data)
      } catch (error) {
        console.error('Failed to fetch settings', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="journal-container max-w-6xl">
        <SEO
          title="Contact & Submissions"
          description={`Contact information and submission guidelines for ${journal?.title || 'Global Insights Journal'}.`}
          keywords="contact, submission, email, guidelines, manuscript submission"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Contact &amp; Submissions</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Reach out to our editorial team for inquiries, submissions, or collaboration opportunities.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building className="text-blue-700" size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Institution</h3>
            <p className="text-slate-500 text-sm">{journal?.institution || 'Visenary Analytics Research Association'}</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-emerald-700" size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Email</h3>
            <a href={`mailto:${journal?.contact_email || 'info@va-ra.co'}`} className="text-blue-600 hover:text-blue-800 text-sm">
              {journal?.contact_email || 'info@va-ra.co'}
            </a>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-purple-700" size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Address</h3>
            <p className="text-slate-500 text-sm">{journal?.address || 'Vrijthof 55, 6211 LE Maastricht\nThe Netherlands'}</p>
          </div>
        </div>

        {/* Submission Guidelines */}
        <div id="submission-guidelines" className="grid lg:grid-cols-3 gap-8">
          {/* Main guidelines */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="px-8 py-5 bg-blue-900 text-white">
                <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                  <FileText size={20} /> Submission Guidelines
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-slate-600 leading-relaxed">
                  We welcome original research articles, comprehensive review papers, case studies, and short communications from researchers worldwide. Please review the following requirements before submitting your manuscript.
                </p>

                <div>
                  <h3 className="font-serif font-bold text-slate-900 mb-3">Manuscript Requirements</h3>
                  <ul className="space-y-3">
                    {[
                      'Manuscripts must be written in English with proper grammar and clarity.',
                      'Include a structured abstract of no more than 300 words.',
                      'Provide 4–6 keywords relevant to the research topic.',
                      'References should follow APA (7th edition) citation style.',
                      'Figures and tables must be high quality (minimum 300 DPI).',
                      'Manuscript length: 5,000–10,000 words for research articles.',
                      'Include a declaration of originality and conflict of interest statement.',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="peer-review-process">
                  <h3 className="font-serif font-bold text-slate-900 mb-3">Submission Process</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                      <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Submit</h4>
                      <p className="text-xs text-slate-500">Email your manuscript to the editorial office</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                      <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Review</h4>
                      <p className="text-xs text-slate-500">Double-blind peer review by expert reviewers</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                      <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Publish</h4>
                      <p className="text-xs text-slate-500">Accepted articles published with DOI assignment</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 flex gap-4 items-start">
                  <Send className="text-blue-700 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Ready to Submit?</h4>
                    <p className="text-sm text-slate-600">
                      Send your manuscript as a Word document (.docx) or LaTeX file to{' '}
                      <a href={`mailto:${journal?.contact_email || 'info@va-ra.co'}`} className="text-blue-600 font-medium hover:underline">
                        {journal?.contact_email || 'info@va-ra.co'}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Timeline */}
            <div className="card p-6">
              <h3 className="font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-blue-700" /> Review Timeline
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Initial Screening</span>
                  <span className="font-medium text-slate-900">3–5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Peer Review</span>
                  <span className="font-medium text-slate-900">2–4 weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revision Period</span>
                  <span className="font-medium text-slate-900">2 weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Final Decision</span>
                  <span className="font-medium text-slate-900">1 week</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-slate-700 font-medium">Total Turnaround</span>
                  <span className="font-bold text-blue-900">4–6 weeks</span>
                </div>
              </div>
            </div>

            {/* Publication Ethics */}
            <div id="publication-ethics" className="card p-6">
              <h3 className="font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-600" /> Publication Ethics
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>COPE guidelines compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Plagiarism detection screening</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Conflict of interest disclosure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Data availability policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Open access CC BY 4.0 license</span>
                </li>
              </ul>
            </div>

            {/* Author Resources */}
            <div id="author-resources" className="card p-6 mt-6">
              <h3 className="font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-blue-700" /> Author Resources
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Manuscript template (Word & LaTeX)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Citation style guide (APA 7th edition)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Formatting guidelines for figures & tables</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Copyright transfer agreement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Authorship & contribution guidelines</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Article Processing Section */}
        <div id="article-processing" className="mt-12">
          <div className="card overflow-hidden">
            <div className="px-8 py-5 bg-emerald-900 text-white">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <CheckCircle size={20} /> Article Processing & Publication
              </h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 mb-4">Processing Charges</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Global Insights Journal is committed to open access publishing. Article Processing Charges (APCs) support peer review, editorial services, and publication infrastructure.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-900">Research Articles</span>
                      <span className="text-lg font-bold text-blue-900">Contact for rates</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-900">Review Papers</span>
                      <span className="text-lg font-bold text-blue-900">Contact for rates</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 mb-4">Publication Benefits</h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Permanent Digital Object Identifier (DOI)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Global indexing in major databases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Unlimited free access worldwide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Professional publication certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Author retains copyright (CC BY 4.0)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>Fast publication (4-6 weeks typical)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

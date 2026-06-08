import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { FileText, CheckCircle, Send } from 'lucide-react'
import SEO from '../components/SEO'

export default function SubmissionGuidelines() {
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
      <div className="journal-container max-w-5xl">
        <SEO
          title="Submission Guidelines"
          description="Manuscript submission requirements and guidelines for authors submitting to Global Insights Journal."
          keywords="submission, guidelines, manuscript, requirements, formatting"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Submission Guidelines</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Review our comprehensive guidelines to ensure your manuscript meets all publication requirements.
          </p>
        </div>

        {/* Main Content */}
        <div className="card overflow-hidden">
          <div className="px-8 py-5 bg-blue-900 text-white">
            <h2 className="text-lg font-serif font-bold flex items-center gap-2">
              <FileText size={20} /> Manuscript Submission Requirements
            </h2>
          </div>
          <div className="p-8 space-y-8">
            <p className="text-slate-600 leading-relaxed">
              We welcome original research articles, comprehensive review papers, case studies, and short communications from researchers worldwide. Please review the following requirements before submitting your manuscript.
            </p>

            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">General Requirements</h3>
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

            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">Manuscript Structure</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3">Research Articles</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Title and author information</li>
                    <li>• Abstract and keywords</li>
                    <li>• Introduction</li>
                    <li>• Materials and Methods</li>
                    <li>• Results</li>
                    <li>• Discussion</li>
                    <li>• Conclusions</li>
                    <li>• References</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3">Review Papers</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Title and author information</li>
                    <li>• Abstract and keywords</li>
                    <li>• Introduction</li>
                    <li>• Systematic methodology</li>
                    <li>• Thematic sections</li>
                    <li>• Critical analysis</li>
                    <li>• Future directions</li>
                    <li>• References</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">Formatting Guidelines</h3>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-900">Font:</span>
                    <span className="text-slate-600 ml-2">Times New Roman, 12pt</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Line Spacing:</span>
                    <span className="text-slate-600 ml-2">Double-spaced</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Margins:</span>
                    <span className="text-slate-600 ml-2">1 inch on all sides</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Page Numbers:</span>
                    <span className="text-slate-600 ml-2">Bottom center</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">File Format & Submission</h3>
              <p className="text-slate-600 text-sm mb-4">
                Please submit your manuscript as a Microsoft Word document (.docx) or LaTeX file. Include all figures and tables embedded within the document, and provide high-resolution versions as separate files.
              </p>
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 flex gap-4 items-start">
                <Send className="text-blue-700 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Ready to Submit?</h4>
                  <p className="text-sm text-slate-600">
                    Send your manuscript to{' '}
                    <a href={`mailto:${journal?.contact_email || 'info@va-ra.co'}`} className="text-blue-600 font-medium hover:underline">
                      {journal?.contact_email || 'info@va-ra.co'}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

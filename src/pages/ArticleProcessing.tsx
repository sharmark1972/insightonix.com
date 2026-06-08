import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { DollarSign, CheckCircle, Award, FileText } from 'lucide-react'
import SEO from '../components/SEO'

export default function ArticleProcessing() {
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
          title="Article Processing & Publication"
          description="Information about article processing charges, publication benefits, and the publishing process."
          keywords="article processing charges, APC, publication fees, open access, DOI"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Article Processing & Publication</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Transparent information about our publication process, fees, and the benefits of publishing with us.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Processing Charges */}
          <div className="card overflow-hidden">
            <div className="px-8 py-5 bg-emerald-900 text-white">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <DollarSign size={20} /> Article Processing Charges (APC)
              </h2>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Global Insights Journal is committed to open access publishing. Article Processing Charges (APCs) support peer review, editorial services, publication infrastructure, and ensure your research is freely available worldwide.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card border-2 border-blue-100 p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Research Articles</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-blue-900">Contact Us</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Standard research articles (5,000-10,000 words) including original research and empirical studies.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>✓ Comprehensive peer review</li>
                    <li>✓ Professional copyediting</li>
                    <li>✓ DOI assignment</li>
                    <li>✓ Global indexing</li>
                  </ul>
                </div>

                <div className="card border-2 border-blue-100 p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Review Papers</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-blue-900">Contact Us</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Comprehensive review articles and systematic literature reviews (up to 15,000 words).
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>✓ Extended peer review</li>
                    <li>✓ Enhanced visibility</li>
                    <li>✓ DOI assignment</li>
                    <li>✓ Featured promotion</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award size={18} className="text-amber-600" /> Fee Waivers Available
                </h4>
                <p className="text-sm text-slate-600">
                  We offer partial or full fee waivers for authors from low-income countries or those facing financial hardship. Please contact our editorial office at{' '}
                  <a href={`mailto:${journal?.contact_email || 'info@va-ra.co'}`} className="text-blue-600 hover:underline">
                    {journal?.contact_email || 'info@va-ra.co'}
                  </a>
                  {' '}for waiver requests.
                </p>
              </div>
            </div>
          </div>

          {/* Publication Benefits */}
          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
              <CheckCircle size={22} className="text-emerald-600" /> Publication Benefits
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              When you publish with Global Insights Journal, you receive comprehensive benefits that maximize the impact and reach of your research:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Permanent DOI</h4>
                    <p className="text-sm text-slate-600">
                      Every article receives a unique Digital Object Identifier for permanent citation and tracking.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Global Indexing</h4>
                    <p className="text-sm text-slate-600">
                      Articles are indexed in major databases including Scopus, Google Scholar, and others.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Unlimited Access</h4>
                    <p className="text-sm text-slate-600">
                      Your research is freely accessible worldwide with no paywalls or restrictions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Publication Certificate</h4>
                    <p className="text-sm text-slate-600">
                      Professional certificate of publication provided for all accepted articles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Copyright Retention</h4>
                    <p className="text-sm text-slate-600">
                      Authors retain copyright under Creative Commons CC BY 4.0 license.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Fast Publication</h4>
                    <p className="text-sm text-slate-600">
                      Typical turnaround time of 4-6 weeks from submission to publication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Process */}
          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
              <FileText size={22} className="text-blue-700" /> Payment Process
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Manuscript Acceptance</h4>
                  <p className="text-sm text-slate-600">
                    APCs are only charged after your manuscript has been accepted following peer review.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Invoice Issued</h4>
                  <p className="text-sm text-slate-600">
                    You will receive a detailed invoice with payment instructions via email.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Payment Methods</h4>
                  <p className="text-sm text-slate-600">
                    We accept bank transfer, credit card, and institutional purchase orders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Publication</h4>
                  <p className="text-sm text-slate-600">
                    Upon payment confirmation, your article is scheduled for publication in the next available issue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card p-8 bg-blue-50 border-2 border-blue-100">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Questions About APCs?</h3>
            <p className="text-slate-600 mb-4">
              For inquiries about article processing charges, payment methods, or fee waiver requests, please contact our editorial office:
            </p>
            <div className="flex items-center gap-2">
              <span className="text-slate-700">Email:</span>
              <a href={`mailto:${journal?.contact_email || 'info@va-ra.co'}`} className="text-blue-600 font-medium hover:underline">
                {journal?.contact_email || 'info@va-ra.co'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

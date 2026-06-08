import { Clock, UserCheck, FileSearch, CheckCircle, AlertTriangle } from 'lucide-react'
import SEO from '../components/SEO'

export default function PeerReviewProcess() {
  return (
    <div className="py-12">
      <div className="journal-container max-w-5xl">
        <SEO
          title="Peer Review Process"
          description="Learn about our rigorous double-blind peer review process and editorial standards."
          keywords="peer review, editorial process, manuscript review, publication timeline"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Peer Review Process</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Our rigorous double-blind peer review ensures the quality and integrity of published research.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h2 className="font-serif font-bold text-slate-900 text-xl mb-6">Review Timeline</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h3 className="font-bold text-slate-900 mb-2">Submit</h3>
              <p className="text-sm text-slate-600 mb-3">Email your manuscript to the editorial office</p>
              <div className="text-xs text-blue-700 font-medium">Same day acknowledgment</div>
            </div>
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="font-bold text-slate-900 mb-2">Review</h3>
              <p className="text-sm text-slate-600 mb-3">Double-blind peer review by expert reviewers</p>
              <div className="text-xs text-blue-700 font-medium">2–4 weeks</div>
            </div>
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="font-bold text-slate-900 mb-2">Publish</h3>
              <p className="text-sm text-slate-600 mb-3">Accepted articles published with DOI assignment</p>
              <div className="text-xs text-blue-700 font-medium">1–2 weeks post-acceptance</div>
            </div>
          </div>
        </div>

        {/* Detailed Timeline */}
        <div className="card p-8 mb-8">
          <h2 className="font-serif font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
            <Clock size={22} className="text-blue-700" /> Detailed Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-slate-700">Initial Screening</div>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '20%'}}></div>
              </div>
              <div className="flex-shrink-0 w-20 text-sm text-slate-600 text-right">3–5 days</div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-slate-700">Peer Review</div>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
              <div className="flex-shrink-0 w-20 text-sm text-slate-600 text-right">2–4 weeks</div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-slate-700">Revision Period</div>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{width: '40%'}}></div>
              </div>
              <div className="flex-shrink-0 w-20 text-sm text-slate-600 text-right">2 weeks</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-32 text-sm font-medium text-slate-700">Final Decision</div>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{width: '30%'}}></div>
              </div>
              <div className="flex-shrink-0 w-20 text-sm text-slate-600 text-right">1 week</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
            <span className="text-slate-700 font-medium">Total Average Turnaround</span>
            <span className="text-xl font-bold text-blue-900">4–6 weeks</span>
          </div>
        </div>

        {/* Review Process Details */}
        <div className="space-y-8">
          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
              <FileSearch size={22} className="text-blue-700" /> Editorial Assessment
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Upon submission, manuscripts undergo an initial editorial assessment to determine their suitability for peer review. This includes checks for:
            </p>
            <ul className="space-y-2">
              {[
                'Alignment with journal scope and aims',
                'Adherence to submission guidelines',
                'Sufficient scientific quality and originality',
                'Appropriate methodology and ethical standards',
                'Proper formatting and presentation'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
              <UserCheck size={22} className="text-blue-700" /> Double-Blind Review
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Manuscripts that pass initial screening are sent to at least two independent expert reviewers. We employ a double-blind review process where:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h4 className="font-bold text-slate-900 mb-2">Reviewer Anonymity</h4>
                <p className="text-sm text-slate-600">
                  Reviewers' identities remain confidential to maintain objectivity and prevent bias in the evaluation process.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h4 className="font-bold text-slate-900 mb-2">Author Anonymity</h4>
                <p className="text-sm text-slate-600">
                  Author names and affiliations are removed from manuscripts before being sent to reviewers to ensure unbiased evaluation.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6">Possible Decisions</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Accept</h4>
                  <p className="text-sm text-slate-600">Manuscript is accepted for publication with minor or no revisions required.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <AlertTriangle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Minor Revisions</h4>
                  <p className="text-sm text-slate-600">Manuscript requires minor changes. Authors have 2 weeks to submit revised version.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Major Revisions</h4>
                  <p className="text-sm text-slate-600">Significant improvements needed. Revised manuscript undergoes additional review.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Reject</h4>
                  <p className="text-sm text-slate-600">Manuscript does not meet quality standards or journal scope. Detailed feedback provided.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

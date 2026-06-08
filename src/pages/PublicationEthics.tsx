import { AlertCircle, CheckCircle, Shield } from 'lucide-react'
import SEO from '../components/SEO'

export default function PublicationEthics() {
  return (
    <div className="py-12">
      <div className="journal-container max-w-5xl">
        <SEO
          title="Publication Ethics"
          description="Publication ethics and standards for Global Insights Journal, including COPE guidelines and plagiarism policies."
          keywords="publication ethics, COPE, plagiarism, authorship, research integrity"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Publication Ethics</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We are committed to maintaining the highest standards of publication ethics and research integrity.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* COPE Compliance */}
          <div className="card overflow-hidden">
            <div className="px-8 py-5 bg-amber-900 text-white">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <Shield size={20} /> Ethical Standards & Compliance
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                Global Insights Journal adheres to the Committee on Publication Ethics (COPE) guidelines and best practices. We expect all contributors—authors, editors, and reviewers—to uphold the highest standards of ethical conduct.
              </p>
              
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">Our Commitments</h3>
                <ul className="space-y-3">
                  {[
                    'COPE guidelines compliance in all editorial decisions',
                    'Plagiarism detection screening using industry-standard tools',
                    'Transparent conflict of interest disclosure requirements',
                    'Data availability and reproducibility policies',
                    'Open access publication under CC BY 4.0 license',
                    'Post-publication corrections and retractions when necessary',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Author Responsibilities */}
          <div className="card p-8">
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-700" /> Author Responsibilities
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Originality</h4>
                <p className="text-sm text-slate-600">
                  Submitted work must be original and not under consideration elsewhere. Authors must cite all sources and acknowledge prior work appropriately.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Authorship</h4>
                <p className="text-sm text-slate-600">
                  All listed authors must have made substantial contributions to the research. Honorary or ghost authorship is prohibited.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Data Integrity</h4>
                <p className="text-sm text-slate-600">
                  Authors must ensure accuracy of data and provide underlying data when requested. Fabrication or falsification is strictly prohibited.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Conflicts of Interest</h4>
                <p className="text-sm text-slate-600">
                  All financial and personal relationships that could influence the work must be disclosed at submission.
                </p>
              </div>
            </div>
          </div>

          {/* Plagiarism Policy */}
          <div className="card p-8">
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">Plagiarism Policy</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              All submissions are screened for plagiarism using advanced detection software. Manuscripts with significant similarity to published work will be rejected.
            </p>
            <div className="bg-red-50 rounded-lg p-5 border border-red-100">
              <p className="text-sm text-slate-700">
                <strong className="text-red-900">Zero Tolerance:</strong> We maintain a strict policy against plagiarism, including self-plagiarism. Minor instances will result in rejection; serious cases may lead to author blacklisting and notification to their institutions.
              </p>
            </div>
          </div>

          {/* Research Ethics */}
          <div className="card p-8">
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">Research Ethics Approval</h3>
            <p className="text-slate-600 leading-relaxed">
              Studies involving human participants, human data, or animals must have received ethics approval from an appropriate institutional review board (IRB) or ethics committee. Proof of approval may be requested during peer review.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

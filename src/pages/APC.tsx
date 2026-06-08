import { CheckCircle, FileText, CreditCard, Clock, Shield } from 'lucide-react'
import SEO from '../components/SEO'

export default function APC() {
  return (
    <div className="py-12">
      <div className="journal-container max-w-4xl">
        <SEO
          title="Article Processing Charge (APC)"
          description="Information about the Article Processing Charge for publishing in Global Insights Journal. No submission fees - only $100 APC upon acceptance."
          keywords="article processing charge, APC, publication fees, open access, no submission fee"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Article Processing Charge (APC)</h1>
          <p className="text-slate-500 max-w-2xl mx-auto mt-4">
            Transparent and affordable publishing for quality research
          </p>
        </div>

        {/* Key highlight - No submission fee */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-green-900 mb-2">
                No Submission Fees
              </h2>
              <p className="text-green-800">
                Submit your manuscript <strong>at no cost</strong>. We believe in fair access to publication opportunities. 
                The Article Processing Charge of <strong>$100 USD</strong> is only applicable <strong>after your manuscript is accepted</strong> for publication.
              </p>
            </div>
          </div>
        </div>

        {/* APC Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-8">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <CreditCard className="text-blue-900" size={28} />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">
              $100 USD APC
            </h3>
            <p className="text-slate-600">
              A nominal, one-time Article Processing Charge of <strong>$100 USD</strong> is required only after your manuscript 
              has been peer-reviewed and <strong>accepted for publication</strong>. This fee covers the cost of editorial processing, 
              DOI assignment, online hosting, and open access dissemination.
            </p>
          </div>

          <div className="card p-8">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Clock className="text-blue-900" size={28} />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-3">
              When is APC Charged?
            </h3>
            <p className="text-slate-600">
              The APC is <strong>not charged at submission</strong>. You will only receive an invoice after your manuscript 
              has been formally <strong>accepted by our editorial board</strong>. This gives you the flexibility to withdraw 
              your manuscript at any point before acceptance without any financial obligation.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">
            What's Included in the APC?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Editorial Processing</h4>
              <p className="text-sm text-slate-600">
                Professional editing, typesetting, and formatting of your manuscript
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">DOI Assignment</h4>
              <p className="text-sm text-slate-600">
                Unique Digital Object Identifier for permanent citation and discoverability
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Open Access</h4>
              <p className="text-sm text-slate-600">
                Free, unrestricted online access to your published article worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Fee Structure Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">
            Fee Structure Overview
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 font-serif font-bold text-slate-900">Stage</th>
                  <th className="text-left px-6 py-4 font-serif font-bold text-slate-900">Fee</th>
                  <th className="text-left px-6 py-4 font-serif font-bold text-slate-900">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-green-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-600" size={18} />
                      <span className="font-medium text-slate-900">Submission</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-700">FREE</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">At submission</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Clock className="text-amber-600" size={18} />
                      <span className="font-medium text-slate-900">Peer Review</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400">No charge</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">During review process</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-blue-600" size={18} />
                      <span className="font-medium text-slate-900">After Acceptance</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-700">$100 USD</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">After acceptance notification</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="card p-6">
              <h4 className="font-bold text-slate-900 mb-2">
                What if my manuscript is rejected?
              </h4>
              <p className="text-slate-600">
                If your manuscript is not accepted for publication, you will <strong>not be charged any fees</strong>. 
                There is absolutely no financial obligation for rejected manuscripts.
              </p>
            </div>
            <div className="card p-6">
              <h4 className="font-bold text-slate-900 mb-2">
                Can I withdraw my manuscript before payment?
              </h4>
              <p className="text-slate-600">
                Yes, you may withdraw your manuscript at any time before acceptance without any charges. 
                Once accepted, if you choose not to proceed, the APC will not be charged.
              </p>
            </div>
            <div className="card p-6">
              <h4 className="font-bold text-slate-900 mb-2">
                Are there any additional charges?
              </h4>
              <p className="text-slate-600">
                No, the $100 APC is a flat fee that covers all publication costs. There are no hidden fees 
                or additional charges for color figures, supplementary materials, or any other publishing services.
              </p>
            </div>
            <div className="card p-6">
              <h4 className="font-bold text-slate-900 mb-2">
                Do you offer APC waivers?
              </h4>
              <p className="text-slate-600">
                We understand that authors from developing countries or those facing financial constraints may need assistance. 
                Please contact our editorial office to discuss waiver options on a case-by-case basis.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-blue-900 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-serif font-bold text-white mb-3">
            Questions about APC?
          </h3>
          <p className="text-blue-200 mb-6">
            Our editorial team is happy to answer any questions about publication fees.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

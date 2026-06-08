import { FileText, Download, BookOpen, CheckCircle } from 'lucide-react'
import SEO from '../components/SEO'

export default function AuthorResources() {
  return (
    <div className="py-12">
      <div className="journal-container max-w-5xl">
        <SEO
          title="Author Resources"
          description="Templates, guides, and resources for authors preparing manuscripts for Global Insights Journal."
          keywords="author resources, manuscript template, citation guide, formatting guidelines"
        />

        {/* Page header */}
        <div className="text-center mb-14">
          <h1 className="section-title-center">Author Resources</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Essential tools and guidelines to help you prepare and submit your manuscript.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Templates */}
          <div className="card overflow-hidden">
            <div className="px-8 py-5 bg-blue-900 text-white">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <Download size={20} /> Manuscript Templates
              </h2>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Use our official templates to ensure your manuscript meets all formatting requirements. Templates include pre-formatted sections, citation styles, and layout guidelines.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-700" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Microsoft Word Template</h3>
                      <p className="text-xs text-slate-500">.docx format</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Recommended for most authors. Includes all necessary sections and formatting.
                  </p>
                  <button className="btn btn-primary w-full text-sm">
                    Download Word Template
                  </button>
                </div>
                <div className="card p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-700" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">LaTeX Template</h3>
                      <p className="text-xs text-slate-500">.tex format</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    For authors familiar with LaTeX. Includes document class and style files.
                  </p>
                  <button className="btn btn-primary w-full text-sm">
                    Download LaTeX Template
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Citation Guide */}
          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
              <BookOpen size={22} className="text-blue-700" /> Citation Style Guide
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              All references must follow APA (7th edition) citation style. Here are examples of the most common citation types:
            </p>
            
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Journal Article</h4>
                <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border border-slate-200">
                  Author, A. A., & Author, B. B. (Year). Title of article. <em>Title of Journal</em>, <em>Volume</em>(Issue), page-page. https://doi.org/xxxxx
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Book</h4>
                <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border border-slate-200">
                  Author, A. A. (Year). <em>Title of book</em> (Edition). Publisher Name. https://doi.org/xxxxx
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Book Chapter</h4>
                <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border border-slate-200">
                  Author, A. A., & Author, B. B. (Year). Title of chapter. In E. E. Editor (Ed.), <em>Title of book</em> (pp. xxx-xxx). Publisher Name.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Website</h4>
                <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border border-slate-200">
                  Author, A. A. (Year, Month Day). Title of webpage. <em>Website Name</em>. URL
                </p>
              </div>
            </div>
          </div>

          {/* Formatting Guidelines */}
          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6">Formatting Guidelines</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Figures and Tables</h3>
                <ul className="space-y-2">
                  {[
                    'All figures must be high resolution (minimum 300 DPI)',
                    'Use common formats: JPEG, PNG, TIFF, or EPS',
                    'Number figures consecutively (Figure 1, Figure 2, etc.)',
                    'Provide descriptive captions below each figure',
                    'Tables should be numbered separately (Table 1, Table 2, etc.)',
                    'Place table titles above the table',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">Mathematical Equations</h3>
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Number equations consecutively on the right side</li>
                    <li>• Use equation editor or MathType for complex formulas</li>
                    <li>• Define all variables and symbols upon first use</li>
                    <li>• Ensure equations are legible and properly formatted</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright and Authorship */}
          <div className="card p-8">
            <h2 className="font-serif font-bold text-slate-900 text-xl mb-6">Copyright & Authorship Guidelines</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-3">Copyright Transfer</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Upon acceptance, authors will be asked to sign a copyright transfer agreement. This grants the journal rights to publish and distribute the work.
                </p>
                <p className="text-xs text-slate-500">
                  Authors retain rights to reuse their work under CC BY 4.0 license.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-3">Authorship Criteria</h4>
                <p className="text-sm text-slate-600 mb-3">
                  All listed authors must have made substantial contributions to the research and approved the final manuscript.
                </p>
                <p className="text-xs text-slate-500">
                  Contributors who don't meet criteria should be listed in acknowledgments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { GraduationCap, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Main footer */}
      <div className="journal-container py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={22} />
              </div>
              <h3 className="font-serif font-bold text-white text-lg leading-tight">
                Global Insights<br />Journal
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A peer-reviewed, open-access journal publishing high-quality research across disciplines to advance global knowledge.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge badge-primary text-[10px] !text-black">Scopus Indexed</span>
              <span className="badge badge-primary text-[10px] !text-black">Open Access</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/issues" className="hover:text-white transition-colors">Issue Archives</Link></li>
              <li><Link to="/editorial-board" className="hover:text-white transition-colors">Editorial Board</Link></li>
              <li><Link to="/conferences" className="hover:text-white transition-colors">Conferences</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">For Authors</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/submission-guidelines" className="hover:text-white transition-colors">Submission Guidelines</Link></li>
              <li><Link to="/publication-ethics" className="hover:text-white transition-colors">Publication Ethics</Link></li>
              <li><Link to="/peer-review-process" className="hover:text-white transition-colors">Peer Review Process</Link></li>
              <li><Link to="/author-resources" className="hover:text-white transition-colors">Author Resources</Link></li>
              <li><Link to="/article-processing" className="hover:text-white transition-colors">Article Processing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
            <address className="not-italic space-y-2.5 text-sm">
              <p>Editorial Office</p>
              <p className="text-slate-400">Visenary Analytics Research Association<br />Vrijthof 55, 6211 LE Maastricht<br />The Netherlands</p>
              <p className="mt-3">
                <a href="mailto:info@va-ra.co" className="text-blue-400 hover:text-blue-300 transition-colors">
                  info@va-ra.co
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="journal-container py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Global Insights Journal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Powered by{' '}
            <a href="https://va-ra.co" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300 transition-colors inline-flex items-center gap-1">
              Visenary Analytics Research Association <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

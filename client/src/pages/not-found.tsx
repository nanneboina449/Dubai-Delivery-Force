import { Link } from "wouter";
import { Home, Users, Truck, Building2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0A1628] to-[#1a2744]">
      <div className="text-center px-6 py-12 max-w-lg">
        <h1 className="text-8xl font-bold text-[#FF6B35] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/">
            <a className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" data-testid="link-home">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>
          </Link>
          <Link href="/rider-application">
            <a className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" data-testid="link-rider-apply">
              <Users className="w-5 h-5" />
              <span>Rider Jobs</span>
            </a>
          </Link>
          <Link href="/contractor-application">
            <a className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" data-testid="link-contractor-apply">
              <Truck className="w-5 h-5" />
              <span>Contractors</span>
            </a>
          </Link>
          <Link href="/business-inquiry">
            <a className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" data-testid="link-business-inquiry">
              <Building2 className="w-5 h-5" />
              <span>Business</span>
            </a>
          </Link>
        </div>
        
        <Link href="/">
          <a className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#ff5722] rounded-full text-white font-medium transition-colors" data-testid="button-back-home">
            <ArrowLeft className="w-5 h-5" />
            Back to Homepage
          </a>
        </Link>
      </div>
    </div>
  );
}

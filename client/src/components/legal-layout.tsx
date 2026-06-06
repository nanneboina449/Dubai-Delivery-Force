import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/logo.png";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-secondary/80 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img
              src={logoImage}
              alt="UrbanFleet Delivery Service"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </a>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: {lastUpdated}</p>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-8 text-gray-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_p]:mb-3 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-300">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

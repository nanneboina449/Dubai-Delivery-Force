import { motion } from "framer-motion";
import { ArrowLeft, Linkedin, Mail, Phone, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import logoImage from "@assets/urbanfleet_logo_generated_hd.png";

const Logo = () => (
  <a href="/" className="flex items-center">
    <img 
      src={logoImage} 
      alt="UrbanFleet Delivery Service" 
      className="h-16 md:h-20 w-auto object-contain"
    />
  </a>
);

const teamMembers = [
  {
    name: "Mr. Gill",
    role: "Co-founder & CEO",
    bio: "With over 15 years of experience in logistics and workforce management across the UAE, Mr. Gill leads UrbanFleet's strategic vision and growth initiatives. His expertise in building scalable delivery operations has been instrumental in establishing UrbanFleet as a trusted partner for businesses across the region.",
    initials: "MG",
    color: "from-[#1a2744] to-[#2d3f5f]"
  },
  {
    name: "Mr. Dharam Singh",
    role: "Co-founder & Managing Director",
    bio: "Dharam brings 10 years of experience in operations management and business development. As Managing Director, he oversees day-to-day operations and ensures UrbanFleet maintains the highest standards of service delivery. His leadership has been key to building strong partnerships with major enterprises in the UAE.",
    initials: "DS",
    color: "from-[#F56A07] to-[#ff8533]"
  },
  {
    name: "Ms. Raj Fatima",
    role: "Chief Financial Officer",
    bio: "Raj oversees all financial operations at UrbanFleet, bringing a wealth of experience in corporate finance and strategic planning. Her expertise ensures sustainable growth while maintaining competitive pricing for our clients and fair compensation for our riders.",
    initials: "RF",
    color: "from-[#1a2744] to-[#2d3f5f]"
  },
  {
    name: "Mr. Faisal Iqbal",
    role: "Operations Manager",
    bio: "Faisal manages UrbanFleet's fleet operations and rider coordination. With deep knowledge of UAE delivery logistics, he ensures efficient deployment of our workforce and maintains our reputation for reliable, on-time deliveries. His focus on rider welfare has helped build a loyal and motivated team.",
    initials: "FI",
    color: "from-[#F56A07] to-[#ff8533]"
  }
];

export default function Team() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1520] via-[#1a2744] to-[#0d1520]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1520]/90 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/#services" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="/team" className="text-primary font-medium text-sm">
              Our Team
            </Link>
            <Link href="/contact/business" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all">
              Get Started
            </Link>
          </nav>
          
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#0d1520] border-t border-white/5 px-6 py-4"
          >
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors py-2">
                Home
              </Link>
              <Link href="/#services" className="text-gray-300 hover:text-white transition-colors py-2">
                Services
              </Link>
              <Link href="/team" className="text-primary py-2">
                Our Team
              </Link>
              <Link href="/contact/business" className="bg-primary text-white px-5 py-2.5 rounded-full text-center font-semibold">
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </header>

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Meet Our <span className="text-primary">Leadership</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The dedicated team driving UrbanFleet's mission to deliver excellence in workforce solutions across the UAE
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all group"
                data-testid={`card-team-member-${index}`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                    <span className="text-2xl font-bold text-white">{member.initials}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1" data-testid={`text-member-name-${index}`}>
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold mb-4" data-testid={`text-member-role-${index}`}>
                      {member.role}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl p-12 max-w-4xl mx-auto border border-primary/20">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join Our Growing Team
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals who share our passion for excellence in delivery services. 
                Whether you're an experienced rider or looking to start your career, we'd love to hear from you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/apply/rider">
                  <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all" data-testid="button-apply-rider">
                    Apply as Rider
                  </button>
                </Link>
                <Link href="/apply/contractor">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-all border border-white/20" data-testid="button-apply-contractor">
                    Partner with Us
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="bg-[#0a0f18] border-t border-white/5 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} UrbanFleet Delivery Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

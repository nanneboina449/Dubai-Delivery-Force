import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Users,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import heroImage from "@assets/generated_images/professional_delivery_rider_on_a_motorcycle_in_dubai_city_setting.png";
import fleetImage from "@assets/stock_images/modern_fleet_of_whit_a8bc0df5.jpg";
import serviceImage from "@assets/stock_images/delivery_rider_handi_31aa869c.jpg";
import brandOverview from "@assets/WhatsApp_Image_2026-01-17_at_15.13.35_1769021311724.jpeg";

const Logo = () => (
  <div className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tight">
    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg text-secondary">
      <span className="text-xl italic">UF</span>
    </div>
    <span className="text-white">Urban<span className="text-primary">Fleet</span></span>
  </div>
);

const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
  <a 
    href={href} 
    className={`
      text-sm font-medium transition-colors hover:text-primary
      ${mobile ? 'text-lg py-2 border-b border-white/10 w-full' : 'text-gray-300'}
    `}
  >
    {children}
  </a>
);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      {/* Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-secondary/95 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo />
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="#features">Why Us</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#fleet">Our Fleet</NavLink>
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6">
              Get Started
            </Button>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-secondary border-t border-white/10"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <NavLink href="#features" mobile>Why Us</NavLink>
                <NavLink href="#services" mobile>Services</NavLink>
                <NavLink href="#fleet" mobile>Our Fleet</NavLink>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Delivery Rider" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary mb-6 border border-white/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">Premier Logistics Partner</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-[1.1] mb-6">
              Smart, Reliable <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">
                Delivery Solutions
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
              Empowering businesses across the UAE with a dedicated, professional workforce. 
              We deliver excellence, one mile at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-14 text-lg backdrop-blur-sm">
                View Fleet
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-white/80">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Licensed<br/>Riders</span>
              </div>
              <div className="flex-1 h-8 border-l border-white/10"></div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Trusted<br/>Platform</span>
              </div>
              <div className="flex-1 h-8 border-l border-white/10"></div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Reliable<br/>Service</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">
              Why Choose UrbanFleet?
            </h2>
            <p className="text-muted-foreground text-lg">
              We provide more than just riders; we provide a complete logistics ecosystem designed for efficiency and trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Fully Licensed & Insured",
                description: "All our riders undergo rigorous background checks and are fully insured, giving you peace of mind."
              },
              {
                icon: Clock,
                title: "On-Time Performance",
                description: "Our advanced fleet management ensures timely deliveries, optimizing your customer satisfaction."
              },
              {
                icon: MapPin,
                title: "UAE-Wide Coverage",
                description: "From Dubai to Abu Dhabi, our extensive network covers key locations across the Emirates."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet & Branding Showcase */}
      <section id="fleet" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={fleetImage} 
                  alt="Delivery Van Fleet" 
                  className="rounded-2xl shadow-xl w-full h-64 object-cover"
                />
                <img 
                  src={serviceImage} 
                  alt="Rider Service" 
                  className="rounded-2xl shadow-xl w-full h-64 object-cover translate-y-8"
                />
              </div>
              {/* Decorative circle */}
              <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
                A Fleet You Can <br/>Trust
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                UrbanFleet maintains a modern, diverse fleet of motorcycles and vans, all branded and maintained to the highest standards. Our equipment represents your brand with professionalism on every street corner.
              </p>

              <div className="space-y-4">
                {[
                  "Modern fleet of eco-friendly bikes and vans",
                  "Professional uniformed riders",
                  "Real-time tracking and monitoring",
                  "Dedicated support team"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-medium text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Identity / Visuals Section (Using the provided asset) */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12">Professionalism in Every Detail</h2>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-w-5xl mx-auto">
             <img 
               src={brandOverview} 
               alt="UrbanFleet Branding Overview" 
               className="w-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
             />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent p-8 md:p-12 text-left">
                <p className="text-xl md:text-2xl font-light text-white/90">
                  "Your brand's reputation is safe in our hands. Our uniformed fleet is an extension of your business."
                </p>
             </div>
          </div>
        </div>
        
        {/* Background texture */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ 
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "40px 40px" 
        }}></div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
                Ready to optimize your delivery operations?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Join the leading businesses in UAE who trust UrbanFleet for their logistics needs.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-10 h-14 text-lg font-bold shadow-xl">
                Get a Quote Today
              </Button>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Logo />
              <p className="text-gray-400 mt-4 max-w-sm">
                UrbanFleet provides top-tier delivery workforce solutions across the UAE. We are committed to reliability, safety, and efficiency.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} UrbanFleet Delivery Services. All rights reserved.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="sr-only">Facebook</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="sr-only">Twitter</span>
                <Truck className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

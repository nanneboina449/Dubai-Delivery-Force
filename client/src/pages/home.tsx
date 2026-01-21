import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Users,
  ArrowRight,
  Menu,
  X,
  Zap,
  Globe,
  Phone,
  Mail,
  Award,
  Headphones,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

// Assets - Generated images matching brand colors
import heroImage from "@assets/generated_images/branded_delivery_rider_on_motorcycle_at_night_in_dubai.png";
import fleetImage from "@assets/generated_images/fleet_of_branded_delivery_vans_parked_professionally.png";
import riderPortrait from "@assets/generated_images/smiling_professional_delivery_person_portrait.png";
import techBg from "@assets/generated_images/abstract_tech_network_background_in_orange_and_navy.png";

// Animated Counter Component
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Floating Particles Animation
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ 
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 4 + 4, 
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// UrbanFleet Logo Component - Matching brand guidelines
const Logo = ({ dark = false }: { dark?: boolean }) => (
  <div className="flex items-center gap-3 font-heading font-bold text-2xl tracking-tight z-50">
    <motion.div 
      whileHover={{ rotate: 10, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary via-orange-500 to-orange-600 rounded-xl text-white shadow-lg shadow-primary/40"
    >
      <span className="text-xl font-black italic">UF</span>
    </motion.div>
    <div className="flex flex-col leading-none">
      <span className={`font-bold ${dark ? 'text-secondary' : 'text-white'}`}>
        Urban<span className="text-primary">Fleet</span>
      </span>
      <span className={`text-[10px] tracking-[0.2em] uppercase ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        Delivery Services
      </span>
    </div>
  </div>
);

// Service Card with Animation
const ServiceCard = ({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700" />
      
      <motion.div 
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="relative w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30"
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  // Navigation items from brand design
  const navItems = ["Home", "About", "Services", "Our Fleet", "Contact"];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-orange-400 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation - Based on brand mockup */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-secondary/95 backdrop-blur-xl shadow-2xl py-3" 
            : "bg-secondary/80 backdrop-blur-md py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo />
          
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button className="hidden md:flex bg-primary hover:bg-orange-600 text-white font-bold rounded-lg px-6 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
              Get Started
            </Button>
          </motion.div>

          <button 
            className="lg:hidden text-white p-2 rounded-lg bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden bg-secondary border-t border-white/10"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-white py-3 border-b border-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button className="mt-4 bg-primary text-white w-full">Get Started</Button>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section - "Smart, Reliable Delivery Solutions" */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary">
        {/* Background with Parallax */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <img 
            src={heroImage} 
            alt="UrbanFleet Delivery Rider" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-secondary/50" />
        </motion.div>

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 pt-20"
        >
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-white/90 text-sm font-medium">Delivery Workforce Solutions in UAE</span>
            </motion.div>

            {/* Main Headline - From Brand Design */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white leading-[1.05] mb-8"
            >
              Smart, Reliable
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">
                Delivery Solutions
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed"
            >
              Providing businesses across the UAE with professional delivery riders workforce.
              <span className="block mt-2 text-primary font-semibold text-2xl italic">
                "Delivery you can trust."
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-primary hover:bg-orange-600 text-white rounded-lg px-8 h-14 text-lg font-bold shadow-2xl shadow-primary/40">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white bg-white/5 hover:bg-white/10 rounded-lg px-8 h-14 text-lg">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.div>
      </section>

      {/* Why Choose UrbanFleet - From Brand Design */}
      <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
              Why Choose <span className="text-primary">UrbanFleet</span>?
            </h2>
            <p className="text-gray-500 text-lg">
              We deliver more than packages — we deliver trust, reliability, and professional service across the UAE.
            </p>
          </motion.div>

          {/* Three Key Features from Brand Guidelines */}
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={ShieldCheck}
              title="Licensed Riders"
              description="All our delivery professionals hold valid UAE licenses and undergo comprehensive background verification. Fully insured for complete peace of mind."
              delay={0.1}
            />
            <ServiceCard 
              icon={Users}
              title="Trusted Platform"
              description="Our technology-driven platform provides real-time tracking, seamless communication, and complete transparency in all operations."
              delay={0.2}
            />
            <ServiceCard 
              icon={Clock}
              title="Reliable Service"
              description="With a 99.8% delivery success rate and round-the-clock support, we guarantee consistent, dependable service every single time."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Fleet Showcase Carousel */}
      <section id="our-fleet" className="py-24 bg-secondary relative overflow-hidden">
        <FloatingParticles />
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Our Professional <span className="text-primary">Fleet</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Modern vehicles and trained delivery professionals ready to represent your brand with excellence across all seven emirates.
            </p>
          </motion.div>

          {/* Fleet Carousel with Autoplay */}
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {[
                { 
                  title: "Motorcycle Delivery Fleet", 
                  desc: "Fast and agile motorcycles for quick urban deliveries. Perfect for food, documents, and small packages across busy city streets.",
                  img: heroImage,
                  features: ["30 min avg delivery", "500+ bikes", "GPS tracked"]
                },
                { 
                  title: "Branded Delivery Vans", 
                  desc: "Professional branded vans for larger cargo and commercial deliveries. Your brand, our excellence.",
                  img: fleetImage,
                  features: ["2.5 ton capacity", "100+ vans", "Temperature controlled"]
                },
                { 
                  title: "Professional Riders", 
                  desc: "Uniformed, trained, and customer-focused delivery professionals representing your business with pride.",
                  img: riderPortrait,
                  features: ["Background verified", "Uniformed", "Customer trained"]
                },
                { 
                  title: "Smart Technology", 
                  desc: "AI-powered route optimization and real-time fleet management for maximum efficiency.",
                  img: techBg,
                  features: ["Live tracking", "Route optimization", "Analytics dashboard"]
                },
              ].map((item, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="group relative h-[480px] rounded-2xl overflow-hidden cursor-pointer border border-white/10"
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.features.map((feature, i) => (
                          <span key={i} className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center gap-4 mt-10">
              <CarouselPrevious className="relative static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white transition-all w-12 h-12" />
              <CarouselNext className="relative static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white transition-all w-12 h-12" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">
              Trusted Across the <span className="text-primary">UAE</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: 1500, suffix: "+", label: "Active Riders", icon: Users },
              { number: 99, suffix: ".8%", label: "Success Rate", icon: CheckCircle2 },
              { number: 7, suffix: "", label: "Emirates Covered", icon: Globe },
              { number: 24, suffix: "/7", label: "Support Available", icon: Headphones },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black text-secondary mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-28 bg-gradient-to-br from-secondary via-secondary to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={techBg} alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <FloatingParticles />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">
              Ready to <span className="text-primary">Get Started</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Partner with UrbanFleet and experience delivery you can trust. Contact us today for a free consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="h-14 px-10 text-lg rounded-lg bg-primary hover:bg-orange-600 text-white font-bold shadow-2xl shadow-primary/30">
                  <Mail className="mr-2 w-5 h-5" /> Get a Quote
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="h-14 px-10 text-lg rounded-lg border-2 border-white/30 text-white bg-white/5 hover:bg-white/10">
                  <Phone className="mr-2 w-5 h-5" /> +971 50 123 4567
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Logo />
              <p className="text-gray-400 mt-6 max-w-md leading-relaxed">
                UrbanFleet provides premium delivery workforce solutions across the UAE. We are committed to reliability, safety, and efficiency in every delivery.
              </p>
              <p className="text-primary font-semibold mt-4 text-xl italic">
                "Delivery you can trust."
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-primary">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                {["Home", "About Us", "Services", "Our Fleet", "Careers", "Contact"].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-primary" /> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-primary">Contact Us</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span>Business Bay, Dubai<br/>United Arab Emirates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  +971 50 123 4567
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  info@urbanfleet.ae
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} UrbanFleet Delivery Services. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Button } from "@/components/ui/button";
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
  ShieldCheck, 
  Users,
  ArrowRight,
  Menu,
  X,
  Globe,
  Phone,
  Mail,
  MapPin,
  Headphones,
  Sparkles,
  Building2,
  Bike,
  Truck,
  BadgeCheck,
  FileCheck,
  Handshake,
  UserPlus,
  Scale,
  Car,
  GraduationCap,
  Heart,
  TrendingUp,
  Award
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "wouter";

// Assets - UrbanFleet Branded Images (Navy & Orange)
import heroImage from "@assets/generated_images/urbanfleet_navy_orange_motorcycle_rider.png";
import fleetImage from "@assets/generated_images/urbanfleet_navy_orange_van_fleet.png";
import riderPortrait from "@assets/generated_images/urbanfleet_uniformed_rider_navy_orange.png";
import techBg from "@assets/generated_images/abstract_tech_network_background_in_orange_and_navy.png";
import carImage from "@assets/generated_images/urbanfleet_navy_orange_car.png";
import truckImage from "@assets/generated_images/urbanfleet_navy_orange_truck.png";

// Magnetic Button Component
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

// Animated Text Reveal
function TextReveal({ children, delay = 0 }: { children: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <span ref={ref} className="inline-block overflow-hidden">
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Animated Counter
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2500;
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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Gradient Blob Animation
function GradientBlob({ className }: { className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

// Floating Card 3D Effect
function FloatingCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set(e.clientX - rect.left - rect.width / 2);
      y.set(e.clientY - rect.top - rect.height / 2);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
}

// Hero Carousel with Rotating Slides
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const slides = [
    {
      image: heroImage,
      badge: "UAE's Premier Delivery Workforce Provider",
      headline: "Lightning Fast",
      subheadline: "Delivery Network",
      description: "Professional riders delivering across the UAE with speed and precision. Your packages arrive on time, every time.",
      tagline: "Speed you can count on."
    },
    {
      image: fleetImage,
      badge: "Scalable Fleet Solutions",
      headline: "Your Fleet",
      subheadline: "Our Expertise",
      description: "From motorcycles to trucks, we provide the right vehicles for every delivery need. Scale up or down as your business grows.",
      tagline: "Flexibility that drives success."
    },
    {
      image: riderPortrait,
      badge: "Trained & Certified Riders",
      headline: "Trusted Riders",
      subheadline: "Reliable Service",
      description: "Every rider is trained, licensed, insured, and background-checked. Complete peace of mind for your business.",
      tagline: "Delivery you can trust."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background with Slide Transition */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img 
            src={slides[currentSlide].image} 
            alt="UrbanFleet" 
            className="w-full h-full object-cover"
          />
          {/* Reduced overlay for better bike visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/60 to-secondary/95" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content - Clean fade transitions */}
      <motion.div 
        style={{ opacity: heroOpacity }}
        className="relative z-20 container mx-auto px-4 pt-32"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-10"
            >
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-white font-medium">{slides[currentSlide].badge}</span>
            </motion.div>
          </AnimatePresence>

          {/* Main Headline */}
          <AnimatePresence mode="wait">
            <motion.h1 
              key={`headline-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white leading-[0.95] mb-8"
            >
              <div>{slides[currentSlide].headline}</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">
                {slides[currentSlide].subheadline}
              </div>
            </motion.h1>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p 
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto"
            >
              {slides[currentSlide].description}
            </motion.p>
          </AnimatePresence>
          
          {/* Tagline */}
          <AnimatePresence mode="wait">
            <motion.p 
              key={`tagline-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl md:text-3xl text-primary font-semibold italic mb-12"
            >
              "{slides[currentSlide].tagline}"
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact/business">
              <MagneticButton className="group flex items-center justify-center gap-3 bg-primary hover:bg-orange-600 text-white rounded-full px-8 py-4 text-lg font-bold shadow-2xl shadow-primary/40 transition-all" data-testid="button-for-businesses">
                <Building2 className="w-5 h-5" />
                For Businesses
              </MagneticButton>
            </Link>
            
            <Link href="/apply/contractor">
              <MagneticButton className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full px-8 py-4 text-lg font-medium border border-white/20 transition-all" data-testid="button-for-contractors">
                <Handshake className="w-5 h-5" />
                For Contractors
              </MagneticButton>
            </Link>
            
            <Link href="/apply/rider">
              <MagneticButton className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full px-8 py-4 text-lg font-medium border border-white/20 transition-all" data-testid="button-join-as-rider">
                <UserPlus className="w-5 h-5" />
                Join as Rider
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentSlide 
                    ? 'bg-primary w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                data-testid={`slide-indicator-${i}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Logo - Navy & Orange UF Design
const Logo = ({ dark = false }: { dark?: boolean }) => (
  <motion.div 
    className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tight z-50"
    whileHover={{ scale: 1.02 }}
  >
    {/* UF Icon with Orange Swoosh */}
    <div className="relative flex items-center justify-center w-10 h-10">
      <svg viewBox="0 0 48 48" className="w-full h-full">
        {/* Navy Background */}
        <rect x="2" y="8" width="28" height="32" rx="4" fill="#1a2744" />
        {/* U Letter */}
        <path d="M10 16 L10 28 Q10 34 16 34 L20 34 Q24 34 24 28 L24 16" 
              stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Orange Swoosh */}
        <path d="M18 20 Q32 18 42 28 Q44 30 42 32 Q38 28 28 26 Q22 25 18 26 Z" 
              fill="#F56A07" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <div className="flex items-baseline">
        <span className={`font-bold text-xl ${dark ? 'text-[#1a2744]' : 'text-white'}`}>Urban</span>
        <span className="font-bold text-xl text-primary">Fleet</span>
      </div>
      <span className="text-[8px] tracking-[0.2em] uppercase text-primary font-semibold">
        Delivery Services
      </span>
    </div>
  </motion.div>
);

// Horizontal Scroll Gallery
function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const items = [
    { title: "Trained Riders", icon: GraduationCap, stat: "100%" },
    { title: "Fully Insured", icon: ShieldCheck, stat: "Covered" },
    { title: "Licensed Drivers", icon: BadgeCheck, stat: "Verified" },
    { title: "Visa Sponsorship", icon: FileCheck, stat: "Available" },
    { title: "UAE Coverage", icon: Globe, stat: "7 Emirates" },
    { title: "Support", icon: Headphones, stat: "24/7" },
  ];

  return (
    <div ref={containerRef} className="overflow-hidden py-12 bg-secondary/50 backdrop-blur-xl border-y border-white/5">
      <motion.div style={{ x }} className="flex gap-8 whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-full border border-white/10">
            <item.icon className="w-6 h-6 text-primary" />
            <span className="text-white font-bold">{item.stat}</span>
            <span className="text-gray-400">{item.title}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 300]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  const navItems = ["Home", "Services", "Compliance", "Fleet", "Contact"];

  return (
    <div className="min-h-screen bg-secondary font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <GradientBlob className="w-[600px] h-[600px] bg-primary/20 top-[-200px] left-[-200px]" />
        <GradientBlob className="w-[500px] h-[500px] bg-blue-600/10 bottom-[-100px] right-[-100px]" />
        <GradientBlob className="w-[400px] h-[400px] bg-orange-500/10 top-[50%] left-[50%]" />
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-400 to-yellow-400 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? "bg-secondary/80 backdrop-blur-2xl border-b border-white/10 py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo />
          
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
              {navItems.map((item) => (
                <motion.a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </nav>

          <a href="#services">
            <MagneticButton className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-full px-6 py-3 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all">
              Get Started <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </a>

          <button 
            className="lg:hidden text-white p-3 rounded-xl bg-white/10 backdrop-blur-xl"
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
              className="lg:hidden bg-secondary/95 backdrop-blur-xl border-t border-white/10"
            >
              <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-white py-4 text-lg border-b border-white/10 flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section with Rotating Slides */}
      <HeroCarousel />

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-8 h-14 rounded-full border-2 border-white/30 flex justify-center pt-3">
          <motion.div 
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ y: [0, 20, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Horizontal Scrolling Stats */}
      <HorizontalGallery />

      {/* Who We Serve Section */}
      <section id="services" className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block text-primary font-bold tracking-widest uppercase text-sm mb-4"
            >
              Our Services
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-6">
              Who We{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Serve
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Whether you're a business needing riders, a contractor with vehicles, or looking to start your delivery career - UrbanFleet has you covered.
            </p>
          </motion.div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "For Businesses",
                subtitle: "Workforce Solutions",
                description: "Need delivery riders for your business? We supply professional, fully trained, insured, and licensed riders. Scale your workforce up or down based on your business demands.",
                features: ["Trained & verified riders", "Scalable workforce", "Fully insured operations", "Real-time tracking"],
                gradient: "from-blue-500 to-cyan-400",
                cta: "Partner With Us",
                link: "/contact/business"
              },
              {
                icon: Truck,
                title: "For Contractors",
                subtitle: "Vehicle Partnerships",
                description: "Own motorcycles, cars, vans, or trucks? Partner with UrbanFleet and put your fleet to work. We connect contractors with businesses needing delivery services.",
                features: ["Monetize your vehicles", "Flexible schedules", "Steady income stream", "Business support"],
                gradient: "from-primary to-orange-400",
                cta: "Become a Contractor",
                link: "/apply/contractor"
              },
              {
                icon: Bike,
                title: "For Riders",
                subtitle: "Career Opportunities",
                description: "Join UrbanFleet as a delivery rider. We offer competitive pay, visa sponsorship for eligible candidates, comprehensive training, and career growth opportunities.",
                features: ["Visa sponsorship available", "Competitive salary", "Full training provided", "Health insurance"],
                gradient: "from-green-500 to-emerald-400",
                cta: "Apply Now",
                link: "/apply/rider"
              }
            ].map((service, i) => (
              <FloatingCard key={i} delay={i * 0.2} className="group h-full">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-primary/50 transition-all duration-500 h-full flex flex-col overflow-hidden">
                  {/* Glow Effect */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${service.gradient} rounded-full opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-500`} />
                  
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`relative w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <div className="text-primary text-sm font-bold uppercase tracking-wider mb-2">{service.subtitle}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={service.link}>
                    <Button className={`w-full bg-gradient-to-r ${service.gradient} text-white font-bold py-6 rounded-xl hover:opacity-90 transition-opacity`} data-testid={`button-service-${i}`}>
                      {service.cta} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* UAE Compliance Section */}
      <section id="compliance" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block text-primary font-bold tracking-widest uppercase text-sm mb-4"
            >
              UAE Regulations
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-heading font-black text-white mb-6">
              Fully Compliant{" "}
              <span className="text-primary">Workforce</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              All UrbanFleet riders operate under UAE Federal Decree-Law No. 33 of 2021, ensuring complete legal compliance and protection.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: GraduationCap, 
                title: "Fully Trained", 
                desc: "Comprehensive training on delivery protocols, customer service, and UAE traffic regulations",
                color: "from-blue-500 to-cyan-400"
              },
              { 
                icon: ShieldCheck, 
                title: "Fully Insured", 
                desc: "Mandatory health insurance coverage and operational liability protection per MOHRE requirements",
                color: "from-green-500 to-emerald-400"
              },
              { 
                icon: BadgeCheck, 
                title: "Licensed Drivers", 
                desc: "Valid UAE driving licenses with verified backgrounds and regular compliance checks",
                color: "from-primary to-orange-400"
              },
              { 
                icon: Scale, 
                title: "Labor Law Compliant", 
                desc: "Operating hours, overtime, and leave policies aligned with UAE Labour Law 2024",
                color: "from-purple-500 to-pink-400"
              },
            ].map((item, i) => (
              <FloatingCard key={i} delay={i * 0.1}>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all h-full group">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FloatingCard>
            ))}
          </div>

          {/* Additional Compliance Info - Image on LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative order-2 md:order-1">
                <img 
                  src={heroImage} 
                  alt="UrbanFleet Delivery Rider" 
                  className="rounded-2xl w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent rounded-2xl" />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold text-white mb-6">Scalable Workforce Solutions</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  UrbanFleet provides businesses with the flexibility to scale their delivery workforce as needed. Whether you need 10 riders or 1,000, we can deploy trained, insured, and licensed professionals within days.
                </p>
                <ul className="space-y-4">
                  {[
                    "MOHRE registered workforce",
                    "Wage Protection System (WPS) compliant",
                    "Summer midday break compliance (June-September)",
                    "8-hour workday with proper overtime compensation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Riders - Visa Sponsorship */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Career Opportunities</span>
              <h2 className="text-5xl md:text-6xl font-heading font-black text-white mb-6">
                Join the{" "}
                <span className="text-primary">UrbanFleet</span>{" "}
                Team
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Looking for a rewarding career in delivery? UrbanFleet offers visa sponsorship for eligible riders, competitive salaries, mandatory health insurance, and opportunities for growth.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: FileCheck, title: "Visa Sponsorship", desc: "Employment visa provided" },
                  { icon: GraduationCap, title: "Full Training", desc: "Comprehensive onboarding" },
                  { icon: Heart, title: "Health Insurance", desc: "Mandatory UAE coverage" },
                  { icon: TrendingUp, title: "Career Growth", desc: "Advancement opportunities" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <MagneticButton className="flex items-center gap-3 bg-primary hover:bg-orange-600 text-white rounded-full px-8 py-4 text-lg font-bold shadow-2xl shadow-primary/40 transition-all">
                Apply to Join <ArrowRight className="w-5 h-5" />
              </MagneticButton>
            </motion.div>
            
            {/* Image on RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden">
                <img 
                  src={riderPortrait} 
                  alt="UrbanFleet Professional Rider" 
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
                    <FileCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-secondary font-bold text-lg">Visa Sponsorship</div>
                    <div className="text-gray-500">Available for riders</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fleet Carousel - All Vehicle Types */}
      <section id="fleet" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block text-primary font-bold tracking-widest uppercase text-sm mb-4"
            >
              Our Fleet
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-6">
              Complete{" "}
              <span className="text-primary">Fleet</span>{" "}
              Solutions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Motorcycles, cars, vans, and trucks - our branded fleet scales to meet any business requirement.
            </p>
          </motion.div>

          {/* Fleet Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Bike, title: "Motorcycles", desc: "Fast urban deliveries", stat: "500+ Bikes", img: heroImage },
              { icon: Car, title: "Cars", desc: "Premium deliveries", stat: "150+ Cars", img: carImage },
              { icon: Truck, title: "Vans", desc: "Medium cargo transport", stat: "100+ Vans", img: fleetImage },
              { icon: Truck, title: "Trucks", desc: "Large cargo logistics", stat: "50+ Trucks", img: truckImage },
            ].map((vehicle, i) => (
              <FloatingCard key={i} delay={i * 0.1}>
                <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={vehicle.img} 
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <vehicle.icon className="w-5 h-5 text-primary" />
                      <span className="text-primary font-bold text-sm">{vehicle.stat}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">{vehicle.title}</h4>
                    <p className="text-gray-400 text-sm">{vehicle.desc}</p>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>

          {/* Carousel */}
          <Carousel
            opts={{ align: "center", loop: true }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-8">
              {[
                { title: "Motorcycle Fleet", desc: "UrbanFleet branded bikes for fast urban deliveries.", img: heroImage, stat: "500+ Bikes" },
                { title: "Car Fleet", desc: "Professional delivery cars for premium services.", img: carImage, stat: "150+ Cars" },
                { title: "Van Fleet", desc: "Branded vans for medium-sized cargo transport.", img: fleetImage, stat: "100+ Vans" },
                { title: "Truck Fleet", desc: "Heavy-duty trucks for large logistics operations.", img: truckImage, stat: "50+ Trucks" },
                { title: "Uniformed Riders", desc: "Professional riders representing your brand.", img: riderPortrait, stat: "1500+ Riders" },
              ].map((item, index) => (
                <CarouselItem key={index} className="pl-8 md:basis-1/2 lg:basis-2/5">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-bold rounded-full mb-4">
                        {item.stat}
                      </span>
                      <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center gap-4 mt-12">
              <CarouselPrevious className="relative static translate-y-0 w-14 h-14 bg-white/10 border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white rounded-full transition-all" />
              <CarouselNext className="relative static translate-y-0 w-14 h-14 bg-white/10 border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white rounded-full transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Stats */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: 1500, suffix: "+", label: "Active Riders", icon: Users, color: "from-primary to-orange-400" },
              { number: 200, suffix: "+", label: "Partner Companies", icon: Building2, color: "from-blue-500 to-cyan-400" },
              { number: 7, suffix: "", label: "Emirates Covered", icon: Globe, color: "from-green-500 to-emerald-400" },
              { number: 24, suffix: "/7", label: "Support Available", icon: Headphones, color: "from-purple-500 to-pink-400" },
            ].map((stat, i) => (
              <FloatingCard key={i} delay={i * 0.1}>
                <div className="relative text-center p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-6xl font-black text-white mb-2">
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-400 font-medium text-lg">{stat.label}</div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={techBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/90 to-secondary" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Get Started
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Whether you need riders, want to partner, or looking to join - contact us today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton className="flex items-center justify-center gap-3 bg-primary hover:bg-orange-600 text-white rounded-full px-10 py-5 text-lg font-bold shadow-2xl shadow-primary/30 transition-all">
                <Mail className="w-5 h-5" /> Contact Us
              </MagneticButton>
              <MagneticButton className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full px-10 py-5 text-lg font-medium border border-white/20 transition-all">
                <Phone className="w-5 h-5" /> +971 50 123 4567
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-xl text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Logo />
              <p className="text-gray-400 mt-6 max-w-md leading-relaxed">
                UrbanFleet supplies professional, trained, insured, and licensed delivery riders workforce to businesses across the UAE. We work with contractors and sponsor visas for our riders.
              </p>
              <p className="text-2xl text-primary font-semibold mt-4 italic">
                "Delivery you can trust."
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-primary text-lg">Work With Us</h4>
              <ul className="space-y-3 text-gray-400">
                {["For Businesses", "For Contractors", "Join as Rider", "Visa Sponsorship", "Careers"].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-primary text-lg">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span>Business Bay, Dubai<br/>UAE</span>
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
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} UrbanFleet Delivery Services. All rights reserved.
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Award className="w-4 h-4 text-primary" />
                <span>Compliant with UAE Federal Decree-Law No. 33 of 2021</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

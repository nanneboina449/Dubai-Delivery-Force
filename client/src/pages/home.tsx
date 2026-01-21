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
  Play,
  Sparkles
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

// Assets - UrbanFleet Branded Images
import heroImage from "@assets/generated_images/urbanfleet_branded_rider_on_motorcycle_at_night.png";
import fleetImage from "@assets/generated_images/urbanfleet_branded_delivery_van_fleet.png";
import riderPortrait from "@assets/generated_images/urbanfleet_uniformed_delivery_person_portrait.png";
import techBg from "@assets/generated_images/abstract_tech_network_background_in_orange_and_navy.png";

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
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

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
      className={`${className} perspective-1000`}
    >
      {children}
    </motion.div>
  );
}

// Logo with Glow Effect
const Logo = ({ dark = false }: { dark?: boolean }) => (
  <motion.div 
    className="flex items-center gap-3 font-heading font-bold text-2xl tracking-tight z-50"
    whileHover={{ scale: 1.02 }}
  >
    <motion.div 
      className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary via-orange-500 to-yellow-500 rounded-xl text-white shadow-2xl"
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 rounded-xl bg-primary/50 blur-xl animate-pulse" />
      <span className="relative text-xl font-black italic">UF</span>
    </motion.div>
    <div className="flex flex-col leading-none">
      <span className={`font-bold ${dark ? 'text-secondary' : 'text-white'}`}>
        Urban<span className="text-primary">Fleet</span>
      </span>
      <span className={`text-[9px] tracking-[0.25em] uppercase ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
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
    { title: "Licensed Riders", icon: ShieldCheck, stat: "100%" },
    { title: "Success Rate", icon: CheckCircle2, stat: "99.8%" },
    { title: "UAE Coverage", icon: Globe, stat: "7 Emirates" },
    { title: "Support", icon: Headphones, stat: "24/7" },
    { title: "Active Fleet", icon: Users, stat: "1500+" },
    { title: "Fast Delivery", icon: Clock, stat: "30 min" },
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
  const [activeSection, setActiveSection] = useState(0);
  
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

  const navItems = ["Home", "Why Us", "Fleet", "Stats", "Contact"];

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
              {navItems.map((item, i) => (
                <motion.a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeSection === i 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </nav>

          <MagneticButton className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-full px-6 py-3 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all">
            Get Started <ArrowRight className="w-4 h-4" />
          </MagneticButton>

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

      {/* Hero Section - Innovative Design */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img 
            src={heroImage} 
            alt="UrbanFleet" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/80 to-secondary" />
        </motion.div>

        {/* Animated Grid */}
        <div className="absolute inset-0 z-10" style={{
          backgroundImage: `
            linear-gradient(rgba(245, 106, 7, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 106, 7, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
        }} />

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-20 container mx-auto px-4 pt-32"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-10"
            >
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-white font-medium">UAE's Premier Delivery Workforce</span>
            </motion.div>

            {/* Main Headline with Text Reveal */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-white leading-[0.9] mb-8">
              <div className="overflow-hidden">
                <TextReveal delay={0.2}>Smart, Reliable</TextReveal>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400"
                >
                  Delivery Solutions
                </motion.span>
              </div>
            </h1>

            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-2xl md:text-3xl text-gray-300 mb-12 font-light"
            >
              <span className="text-primary font-semibold italic">"Delivery you can trust."</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <MagneticButton className="group flex items-center justify-center gap-3 bg-primary hover:bg-orange-600 text-white rounded-full px-10 py-5 text-lg font-bold shadow-2xl shadow-primary/40 transition-all">
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </MagneticButton>
              
              <MagneticButton className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full px-10 py-5 text-lg font-medium border border-white/20 transition-all">
                <Play className="w-5 h-5 fill-current" />
                Watch Video
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

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
      </section>

      {/* Horizontal Scrolling Stats */}
      <HorizontalGallery />

      {/* Why Choose UrbanFleet - 3D Cards */}
      <section id="why-us" className="py-32 relative">
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
              Why Choose Us
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                UrbanFleet
              </span>
              ?
            </h2>
          </motion.div>

          {/* 3D Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Licensed Riders",
                description: "All delivery professionals hold valid UAE licenses with comprehensive background verification. Fully insured for complete peace of mind.",
                gradient: "from-blue-500 to-cyan-400"
              },
              {
                icon: Users,
                title: "Trusted Platform",
                description: "Technology-driven platform with real-time tracking, seamless communication, and complete operational transparency.",
                gradient: "from-primary to-orange-400"
              },
              {
                icon: Clock,
                title: "Reliable Service",
                description: "99.8% delivery success rate with round-the-clock support. Consistent, dependable service every single time.",
                gradient: "from-purple-500 to-pink-400"
              }
            ].map((feature, i) => (
              <FloatingCard key={i} delay={i * 0.2} className="group">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-primary/50 transition-all duration-500 h-full overflow-hidden">
                  {/* Glow Effect */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-500`} />
                  
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 shadow-2xl`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Carousel - Immersive */}
      <section id="fleet" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-6">
              Our Professional{" "}
              <span className="text-primary">Fleet</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Modern vehicles and trained professionals ready to deliver excellence.
            </p>
          </motion.div>

          {/* Immersive Carousel */}
          <Carousel
            opts={{ align: "center", loop: true }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-8">
              {[
                { title: "Motorcycle Fleet", desc: "Fast urban deliveries across busy city streets.", img: heroImage, stat: "500+ Bikes" },
                { title: "Branded Vans", desc: "Professional fleet for larger cargo deliveries.", img: fleetImage, stat: "100+ Vans" },
                { title: "Expert Riders", desc: "Trained professionals representing your brand.", img: riderPortrait, stat: "1500+ Riders" },
                { title: "Smart Tech", desc: "AI-powered route optimization.", img: techBg, stat: "Real-time" },
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
                    
                    {/* Content */}
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

      {/* Stats with Animated Counters */}
      <section id="stats" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: 1500, suffix: "+", label: "Active Riders", icon: Users, color: "from-primary to-orange-400" },
              { number: 99, suffix: ".8%", label: "Success Rate", icon: CheckCircle2, color: "from-green-500 to-emerald-400" },
              { number: 7, suffix: "", label: "Emirates", icon: Globe, color: "from-blue-500 to-cyan-400" },
              { number: 24, suffix: "/7", label: "Support", icon: Headphones, color: "from-purple-500 to-pink-400" },
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
              Partner with UrbanFleet. Experience delivery you can trust.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton className="flex items-center justify-center gap-3 bg-primary hover:bg-orange-600 text-white rounded-full px-12 py-5 text-lg font-bold shadow-2xl shadow-primary/30 transition-all">
                <Mail className="w-5 h-5" /> Get a Quote
              </MagneticButton>
              <MagneticButton className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full px-12 py-5 text-lg font-medium border border-white/20 transition-all">
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
                Premium delivery workforce solutions across the UAE. Committed to reliability, safety, and excellence.
              </p>
              <p className="text-2xl text-primary font-semibold mt-4 italic">
                "Delivery you can trust."
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-primary text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                {["Home", "About", "Services", "Fleet", "Careers", "Contact"].map(link => (
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
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} UrbanFleet Delivery Services. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

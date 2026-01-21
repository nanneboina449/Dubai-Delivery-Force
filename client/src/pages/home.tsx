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
  BarChart3,
  Globe,
  Phone,
  Mail,
  Award,
  Target,
  Headphones
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

// Assets
import heroImage from "@assets/generated_images/branded_delivery_rider_on_motorcycle_at_night_in_dubai.png";
import fleetImage from "@assets/generated_images/fleet_of_branded_delivery_vans_parked_professionally.png";
import riderPortrait from "@assets/generated_images/smiling_professional_delivery_person_portrait.png";
import techBg from "@assets/generated_images/abstract_tech_network_background_in_orange_and_navy.png";

// Animated Counter Component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Floating Particles
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 3 + 3, 
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}

// Logo Component
const Logo = () => (
  <div className="flex items-center gap-3 font-heading font-bold text-2xl tracking-tight z-50">
    <motion.div 
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary via-orange-500 to-orange-600 rounded-xl text-white shadow-lg shadow-primary/40"
    >
      <span className="text-xl font-black italic">UF</span>
    </motion.div>
    <div className="flex flex-col leading-none">
      <span className="text-white font-bold">Urban<span className="text-primary">Fleet</span></span>
      <span className="text-[10px] text-gray-400 tracking-widest uppercase">Delivery Services</span>
    </div>
  </div>
);

// Text Reveal Animation
const TextReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

// Service Card with Hover Effect
const ServiceCard = ({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
      
      <motion.div 
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="relative w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30"
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
      
      <motion.div 
        className="mt-6 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        Learn More <ArrowRight className="ml-2 w-4 h-4" />
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-secondary/95 backdrop-blur-xl shadow-2xl py-3" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-8">
            {["Services", "Fleet", "About", "Contact"].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
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
            <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-8 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
              Get Started
            </Button>
          </motion.div>

          <button 
            className="md:hidden text-white p-2 rounded-lg bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary">
        {/* Animated Background */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <img 
            src={heroImage} 
            alt="UrbanFleet Delivery" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/80 to-secondary" />
        </motion.div>

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(245, 106, 7, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 106, 7, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 text-center pt-20"
        >
          <TextReveal delay={0.2}>
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </span>
              <span className="text-white font-semibold">Trusted Delivery Partner in UAE</span>
            </motion.div>
          </TextReveal>

          <TextReveal delay={0.4}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white leading-[0.95] mb-8">
              Smart, Reliable
              <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-orange-300">
                  Delivery Solutions
                </span>
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-2 bg-primary/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </h1>
          </TextReveal>

          <TextReveal delay={0.6}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Empowering businesses across the UAE with professional delivery riders workforce. 
              <span className="text-primary font-semibold"> Delivery you can trust.</span>
            </p>
          </TextReveal>

          <TextReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-primary hover:bg-orange-600 text-white rounded-full px-10 h-16 text-lg font-bold shadow-2xl shadow-primary/40">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white bg-white/5 hover:bg-white/10 rounded-full px-10 h-16 text-lg backdrop-blur-md">
                  <Phone className="mr-2 w-5 h-5" /> Contact Us
                </Button>
              </motion.div>
            </div>
          </TextReveal>

          {/* Hero Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { icon: ShieldCheck, label: "Licensed Riders", value: "100%" },
              { icon: Users, label: "Trusted Platform", value: "1500+" },
              { icon: Clock, label: "Reliable Service", value: "24/7" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10"
              >
                <div className="p-3 bg-primary/20 rounded-xl">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-primary rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
              Why Choose UrbanFleet?
            </h2>
            <p className="text-gray-500 text-lg">
              We provide more than just delivery riders; we deliver trust, efficiency, and a seamless logistics experience across all seven emirates.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={ShieldCheck}
              title="Licensed Riders"
              description="All our riders undergo rigorous background checks and hold proper UAE driving licenses. Fully insured for your peace of mind."
              delay={0.1}
            />
            <ServiceCard 
              icon={Target}
              title="Trusted Platform"
              description="Our technology-driven platform ensures real-time tracking, seamless communication, and transparent operations."
              delay={0.2}
            />
            <ServiceCard 
              icon={Award}
              title="Reliable Service"
              description="With a 99.8% delivery success rate and 24/7 support, we guarantee dependable service every single time."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Fleet Carousel Section */}
      <section id="fleet" className="py-24 bg-secondary relative overflow-hidden">
        <FloatingParticles />
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">Our Fleet</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Professional Fleet & Workforce
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Modern vehicles and trained professionals ready to represent your brand with excellence.
            </p>
          </motion.div>

          {/* Carousel */}
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {[
                { 
                  title: "Motorcycle Fleet", 
                  desc: "Fast and agile delivery for urban areas. Perfect for food, documents, and small packages.",
                  img: heroImage,
                  stats: ["30 min avg delivery", "500+ bikes"]
                },
                { 
                  title: "Delivery Vans", 
                  desc: "Larger capacity for bulk orders and commercial deliveries. Branded for professionalism.",
                  img: fleetImage,
                  stats: ["2.5 ton capacity", "100+ vans"]
                },
                { 
                  title: "Professional Riders", 
                  desc: "Trained, uniformed, and customer-focused delivery professionals.",
                  img: riderPortrait,
                  stats: ["Background checked", "GPS tracked"]
                },
                { 
                  title: "Smart Logistics", 
                  desc: "AI-powered route optimization and real-time fleet management.",
                  img: techBg,
                  stats: ["Real-time tracking", "30% faster"]
                },
              ].map((item, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-b from-white/10 to-white/5 border border-white/10"
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex gap-2 mb-4">
                        {item.stats.map((stat, i) => (
                          <span key={i} className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30">
                            {stat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center gap-4 mt-10">
              <CarouselPrevious className="relative static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white transition-all" />
              <CarouselNext className="relative static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: 1500, suffix: "+", label: "Active Riders", icon: Users },
              { number: 99, suffix: "%", label: "Success Rate", icon: CheckCircle2 },
              { number: 7, suffix: "", label: "Emirates Covered", icon: Globe },
              { number: 24, suffix: "/7", label: "Support Available", icon: Headphones },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
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
      <section id="contact" className="py-32 bg-gradient-to-br from-secondary via-secondary to-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <img src={techBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
        </div>
        
        <FloatingParticles />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Get Started?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Partner with UrbanFleet and transform your delivery operations. Contact us today for a free consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="h-16 px-12 text-lg rounded-full bg-primary hover:bg-orange-600 text-white font-bold shadow-2xl shadow-primary/40">
                  <Mail className="mr-3 w-5 h-5" /> Get a Quote
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="h-16 px-12 text-lg rounded-full border-2 border-white/30 text-white bg-white/5 hover:bg-white/10">
                  <Phone className="mr-3 w-5 h-5" /> +971 50 123 4567
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
              <p className="text-primary font-semibold mt-4 text-lg italic">
                "Delivery you can trust."
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-primary">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                {["About Us", "Services", "Fleet", "Careers", "Contact"].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-primary">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  Dubai, UAE
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  +971 50 123 4567
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
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

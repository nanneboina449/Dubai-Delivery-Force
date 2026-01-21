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
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Assets
import heroImage from "@assets/generated_images/professional_delivery_rider_on_a_motorcycle_in_dubai_city_setting.png";
import techMapImage from "@assets/generated_images/abstract_digital_logistics_map_with_connecting_lines_and_data_points_in_dark_navy_and_orange.png";
import futuristicVanImage from "@assets/generated_images/futuristic_sleek_delivery_van_in_a_high_tech_tunnel_with_motion_blur.png";

const Logo = () => (
  <div className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tight z-50">
    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg text-white shadow-lg shadow-primary/25">
      <span className="text-xl italic">UF</span>
    </div>
    <span className="text-white">Urban<span className="text-primary">Fleet</span></span>
  </div>
);

const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
  <a 
    href={href} 
    className={`
      text-sm font-medium transition-all hover:text-primary relative group
      ${mobile ? 'text-lg py-3 border-b border-white/10 w-full block' : 'text-gray-300'}
    `}
  >
    {children}
    {!mobile && (
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    )}
  </a>
);

// Marquee Component
const Marquee = ({ items, reverse = false }: { items: string[], reverse?: boolean }) => (
  <div className="relative flex overflow-hidden w-full bg-secondary/30 backdrop-blur-sm py-8 border-y border-white/5">
    <div className={`flex min-w-full gap-16 animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap`}>
      {[...items, ...items, ...items].map((item, i) => (
        <span key={i} className="text-2xl font-bold text-white/20 uppercase tracking-widest hover:text-primary/50 transition-colors cursor-default select-none">
          {item}
        </span>
      ))}
    </div>
    {/* Gradient Fades */}
    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />
  </div>
);

// Stat Card
const StatCard = ({ number, label, icon: Icon }: { number: string, label: string, icon: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-primary/20 rounded-xl">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <TrendingUp className="w-4 h-4 text-green-400" />
    </div>
    <h3 className="text-4xl font-bold text-white mb-1">{number}</h3>
    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
  </motion.div>
);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const partners = ["Amazon", "Noon", "Talabat", "Deliveroo", "Careem", "Fetchr", "Aramex", "DHL"];

  return (
    <div className="min-h-screen bg-secondary font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      {/* Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-secondary/80 backdrop-blur-lg border-b border-white/10 py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md">
            <NavLink href="#tech">Technology</NavLink>
            <NavLink href="#fleet">Our Fleet</NavLink>
            <NavLink href="#stats">Impact</NavLink>
            <div className="w-px h-4 bg-white/20" />
            <a href="#contact" className="text-sm font-bold text-primary hover:text-white transition-colors">Partner with Us</a>
          </nav>

          <Button className="hidden md:flex bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white font-bold rounded-full px-6 shadow-lg shadow-primary/25 transition-all hover:scale-105">
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <button 
            className="md:hidden text-white p-2 rounded-lg bg-white/10 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-secondary/80 z-10" />
          <motion.img 
            style={{ y: y1 }}
            src={heroImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent z-10" />
          {/* Grid Overlay */}
          <div className="absolute inset-0 z-10 opacity-20" 
            style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary mb-8 border border-white/20 backdrop-blur-md shadow-lg"
            >
              <Zap className="w-4 h-4 fill-primary" />
              <span className="text-sm font-bold uppercase tracking-wider">Next-Gen Logistics</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-heading font-extrabold text-white leading-tight mb-8"
            >
              Delivery <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">Reimagined</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Powering the UAE's fastest growing brands with intelligent fleet solutions and elite delivery professionals.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-16 text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105">
                Join Our Fleet
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-full px-10 h-16 text-lg backdrop-blur-md transition-all hover:scale-105">
                For Business
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-0 relative z-20 -mt-20 transform rotate-[-2deg] scale-110 origin-center bg-secondary shadow-2xl">
        <Marquee items={partners} />
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard icon={Users} number="1,500+" label="Active Riders" />
            <StatCard icon={CheckCircle2} number="99.8%" label="Success Rate" />
            <StatCard icon={Globe} number="7" label="Emirates Covered" />
            <StatCard icon={Clock} number="24/7" label="Support Team" />
          </div>
        </div>
      </section>

      {/* Technology & Fleet Showcase (Replaces Brand Image) */}
      <section id="tech" className="py-24 bg-gradient-to-b from-secondary to-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-2xl" />
              <img 
                src={techMapImage} 
                alt="Logistics Technology" 
                className="relative rounded-3xl border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-700"
              />
              {/* Floating Cards */}
              <motion.div 
                style={{ y: y2 }}
                className="absolute -right-8 -bottom-8 bg-secondary/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white font-bold text-sm">Live Tracking</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full" 
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Data-Driven <br/>
                <span className="text-primary">Performance</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Our operations are powered by state-of-the-art logistics software that optimizes routes, predicts delays, and ensures transparency. We don't just deliver packages; we deliver data confidence.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: "Smart Routing AI", desc: "Optimized delivery paths reducing transit time by 30%." },
                  { title: "Real-Time Telemetry", desc: "Live monitoring of fleet status, speed, and location." },
                  { title: "Predictive Analytics", desc: "Machine learning that anticipates demand spikes." }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-4"
                  >
                    <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{item.title}</h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fleet Carousel Section */}
      <section id="fleet" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Fleet</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary">
              Future-Ready Mobility
            </h2>
          </div>
          <div className="hidden md:block">
             <p className="text-muted-foreground text-lg max-w-md text-right">
               From electric vans to agile bikes, our diverse fleet is equipped for every urban challenge.
             </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <Carousel className="w-full">
             <CarouselContent className="-ml-4">
               {[
                 { 
                   title: "Electric Vans", 
                   desc: "Sustainable urban logistics for larger cargo.", 
                   img: futuristicVanImage,
                   stat: "2.5 Ton Capacity"
                 },
                 { 
                   title: "Express Bikes", 
                   desc: "Agile delivery for dense city centers.", 
                   img: heroImage, 
                   stat: "30min Delivery"
                 },
                 { 
                   title: "Cold Chain", 
                   desc: "Temperature controlled units for perishables.", 
                   img: techMapImage, 
                   stat: "-5°C to 20°C"
                 },
                 { 
                   title: "Heavy Haul", 
                   desc: "Bulk transport for commercial clients.", 
                   img: futuristicVanImage,
                   stat: "Nationwide"
                 }
               ].map((item, index) => (
                 <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                   <div className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer">
                     <img 
                       src={item.img} 
                       alt={item.title} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent p-8 flex flex-col justify-end">
                       <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                         <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3">
                           {item.stat}
                         </span>
                         <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                         <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                           {item.desc}
                         </p>
                       </div>
                     </div>
                   </div>
                 </CarouselItem>
               ))}
             </CarouselContent>
             <div className="flex justify-end gap-2 mt-8">
               <CarouselPrevious className="relative static translate-y-0 text-secondary border-secondary hover:bg-secondary hover:text-white" />
               <CarouselNext className="relative static translate-y-0 text-secondary border-secondary hover:bg-secondary hover:text-white" />
             </div>
          </Carousel>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-32 bg-secondary relative overflow-hidden flex items-center justify-center">
         {/* Animated Background */}
         <div className="absolute inset-0">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
         </div>

         <div className="relative z-10 container mx-auto px-4 text-center">
           <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tight">
             Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Scale?</span>
           </h2>
           <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
             Join the revolution in urban logistics. Partner with UrbanFleet today.
           </p>
           <Button className="h-20 px-12 text-2xl rounded-full bg-white text-secondary hover:bg-gray-100 font-bold shadow-2xl hover:scale-105 transition-all">
             Start Now
           </Button>
         </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-black text-white/50 py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <Logo />
          <p className="mt-8 text-sm">
            © 2026 UrbanFleet Technologies. Built for the future.
          </p>
        </div>
      </footer>
    </div>
  );
}

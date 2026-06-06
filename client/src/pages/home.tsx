import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
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
  Building2,
  Bike,
  Truck,
  BadgeCheck,
  FileCheck,
  Handshake,
  UserPlus,
  Scale,
  GraduationCap,
  Heart,
  TrendingUp,
  Award,
} from "lucide-react";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link } from "wouter";

// Optimized WebP assets (resized + compressed, ~95% smaller than the source PNGs)
import logoImage from "@assets/optimized/logo.webp";
import hero1Image from "@assets/optimized/hero-1.webp";
import hero2Image from "@assets/optimized/hero-2.webp";
import hero3Image from "@assets/optimized/hero-3.webp";
import workforceImage from "@assets/optimized/workforce-solutions.webp";
import riderVisaImage from "@assets/optimized/rider-visa.webp";
import fleetCyclistsImage from "@assets/optimized/fleet-cyclists.webp";
import fleetMotorcyclesImage from "@assets/optimized/fleet-motorcycles.webp";
import fleetCarsImage from "@assets/optimized/fleet-cars.webp";
import fleetVansImage from "@assets/optimized/fleet-vans.webp";
import fleetTrucksImage from "@assets/optimized/fleet-trucks.webp";

// Lightweight scroll reveal using IntersectionObserver (no animation library).
// Respects prefers-reduced-motion via the motion-reduce utility.
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Brand logo — optimized WebP (14KB, down from the 2.1MB PNG).
function Logo({ className = "h-12 md:h-14" }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center" aria-label="UrbanFleet Delivery Service home">
      <img
        src={logoImage}
        alt="UrbanFleet Delivery Service"
        width={480}
        height={320}
        className={`${className} w-auto object-contain`}
      />
    </Link>
  );
}

const heroSlides = [
  {
    image: hero1Image,
    badge: "UAE's Premier Delivery Workforce Provider",
    headline: "Lightning Fast",
    subheadline: "Delivery Network",
    description:
      "Professional riders delivering across the UAE with speed and precision. Your packages arrive on time, every time.",
    tagline: "Speed you can count on.",
  },
  {
    image: hero2Image,
    badge: "Scalable Fleet Solutions",
    headline: "Your Fleet",
    subheadline: "Our Expertise",
    description:
      "From motorcycles to trucks, we provide the right vehicles for every delivery need. Scale up or down as your business grows.",
    tagline: "Flexibility that drives success.",
  },
  {
    image: hero3Image,
    badge: "Trained & Certified Riders",
    headline: "Trusted Riders",
    subheadline: "Reliable Service",
    description:
      "Every rider is trained, licensed, insured, and background-checked. Complete peace of mind for your business.",
    tagline: "Delivery you can trust.",
  },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lightweight text-only rotation (no images, no animation library).
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length),
      6000,
    );
    return () => clearInterval(timer);
  }, []);

  const navItems = ["Home", "Services", "Compliance", "Fleet", "Our Team", "Contact"];
  const slide = heroSlides[currentSlide];

  return (
    <div className="min-h-screen bg-background font-sans text-secondary selection:bg-primary selection:text-white">
      {/* Navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const linkClass =
                "flex min-h-12 items-center rounded-full px-4 text-sm font-medium text-secondary/70 transition-colors hover:bg-muted hover:text-secondary";
              return item === "Our Team" ? (
                <Link key={item} href="/team" className={linkClass}>
                  {item}
                </Link>
              ) : (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={linkClass}
                >
                  {item}
                </a>
              );
            })}
          </nav>

          <a href="#services" className="hidden md:inline-flex">
            <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-white shadow-sm transition-colors hover:bg-orange-600">
              Get Started <ArrowRight className="h-4 w-4" />
            </span>
          </a>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-secondary lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-white lg:hidden">
            <nav className="container mx-auto flex flex-col px-4 py-2">
              {navItems.map((item) =>
                item === "Our Team" ? (
                  <Link
                    key={item}
                    href="/team"
                    className="flex min-h-12 items-center justify-between border-b border-border py-4 text-lg text-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="flex min-h-12 items-center justify-between border-b border-border py-4 text-lg text-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </a>
                ),
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero — CSS gradient, no background image */}
      <section
        id="home"
        className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#0c122a]"
      >
        {/* Real photo background (optimized WebP) with a navy overlay for text legibility */}
        <img
          key={slide.image}
          src={slide.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0c122a]/55 via-[#0c122a]/65 to-[#0c122a]/95"
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-4 pt-28 pb-16">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              {slide.badge}
            </span>

            <h1
              className="font-heading font-black leading-[1.02] text-white"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
            >
              <span className="block">{slide.headline}</span>
              <span className="block text-primary">{slide.subheadline}</span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-2xl text-gray-300"
              style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.4rem)" }}
            >
              {slide.description}
            </p>

            <p
              className="mt-4 font-semibold italic text-primary"
              style={{ fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)" }}
            >
              "{slide.tagline}"
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link href="/contact/business">
                <span
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-orange-600 sm:w-auto"
                  data-testid="button-for-businesses"
                >
                  <Building2 className="h-5 w-5" />
                  For Businesses
                </span>
              </Link>
              <Link href="/apply/contractor">
                <span
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
                  data-testid="button-for-contractors"
                >
                  <Handshake className="h-5 w-5" />
                  For Contractors
                </span>
              </Link>
              <Link href="/apply/rider">
                <span
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
                  data-testid="button-join-as-rider"
                >
                  <UserPlus className="h-5 w-5" />
                  Join as Rider
                </span>
              </Link>
            </div>

            {/* Slide indicators with 48px touch targets */}
            <div className="mt-10 flex justify-center gap-1">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className="flex h-12 w-12 items-center justify-center"
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === currentSlide}
                  data-testid={`slide-indicator-${i}`}
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — static responsive grid (replaces infinite marquee) */}
      <section className="border-b border-border/60">
        <div className="container mx-auto grid grid-cols-2 gap-3 px-4 py-8 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { title: "Trained Riders", icon: GraduationCap, stat: "100%" },
            { title: "Fully Insured", icon: ShieldCheck, stat: "Covered" },
            { title: "Licensed Drivers", icon: BadgeCheck, stat: "Verified" },
            { title: "Visa Sponsorship", icon: FileCheck, stat: "Available" },
            { title: "UAE Coverage", icon: Globe, stat: "7 Emirates" },
            { title: "Support", icon: Headphones, stat: "24/7" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3"
            >
              <item.icon className="h-5 w-5 shrink-0 text-primary" />
              <div className="leading-tight">
                <div className="text-sm font-bold text-secondary">{item.stat}</div>
                <div className="text-xs text-muted-foreground">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Serve / Services */}
      <section id="services" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary">
              Our Services
            </span>
            <h2
              className="font-heading font-black text-secondary"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Delivery Workforce{" "}
              <span className="text-primary">Solutions UAE</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you're a business needing riders, a contractor with vehicles, or looking to start your delivery career - UrbanFleet has you covered.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "For Businesses",
                subtitle: "Workforce Solutions",
                description:
                  "Need delivery riders for your business? We supply professional, fully trained, insured, and licensed riders. Scale your workforce up or down based on your business demands.",
                features: [
                  "Trained & verified riders",
                  "Scalable workforce",
                  "Fully insured operations",
                  "Real-time tracking",
                ],
                cta: "Partner With Us",
                link: "/contact/business",
              },
              {
                icon: Truck,
                title: "For Contractors",
                subtitle: "Vehicle Partnerships",
                description:
                  "Own motorcycles, cars, vans, or trucks? Partner with UrbanFleet and put your fleet to work. We connect contractors with businesses needing delivery services.",
                features: [
                  "Monetize your vehicles",
                  "Flexible schedules",
                  "Steady income stream",
                  "Business support",
                ],
                cta: "Become a Contractor",
                link: "/apply/contractor",
              },
              {
                icon: Bike,
                title: "For Riders",
                subtitle: "Career Opportunities",
                description:
                  "Join UrbanFleet as a delivery rider. We offer competitive pay, visa sponsorship for eligible candidates, comprehensive training, and career growth opportunities.",
                features: [
                  "Visa sponsorship available",
                  "Competitive salary",
                  "Full training provided",
                  "Health insurance",
                ],
                cta: "Apply Now",
                link: "/apply/rider",
              },
            ].map((service, i) => (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    {service.subtitle}
                  </div>
                  <h3 className="mt-1 text-xl font-bold text-secondary">
                    {service.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-5 mb-7 flex-grow space-y-2.5">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-secondary/80">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={service.link}>
                    <Button
                      className="min-h-12 w-full rounded-xl bg-primary font-bold text-white hover:bg-orange-600"
                      data-testid={`button-service-${i}`}
                    >
                      {service.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* UAE Compliance */}
      <section id="compliance" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary">
              UAE Regulations
            </span>
            <h2
              className="font-heading font-black text-secondary"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              MOHRE Compliant <span className="text-primary">Delivery Riders</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              All UrbanFleet riders operate under UAE Federal Decree-Law No. 33 of 2021, ensuring complete legal compliance and protection.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GraduationCap,
                title: "Fully Trained",
                desc: "Comprehensive training on delivery protocols, customer service, and UAE traffic regulations",
              },
              {
                icon: ShieldCheck,
                title: "Fully Insured",
                desc: "Mandatory health insurance coverage and operational liability protection per MOHRE requirements",
              },
              {
                icon: BadgeCheck,
                title: "Licensed Drivers",
                desc: "Valid UAE driving licenses with verified backgrounds and regular compliance checks",
              },
              {
                icon: Scale,
                title: "Labor Law Compliant",
                desc: "Operating hours, overtime, and leave policies aligned with UAE Labour Law 2024",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-secondary">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Scalable Workforce panel — gradient block instead of photo */}
          <Reveal className="mt-12">
            <div className="grid items-center gap-8 rounded-2xl border border-border bg-white p-7 shadow-sm md:grid-cols-2 md:p-10">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={workforceImage}
                  alt="UrbanFleet delivery workforce"
                  loading="lazy"
                  width={900}
                  height={600}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary">
                  Scalable Workforce Solutions
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  UrbanFleet provides businesses with the flexibility to scale their delivery workforce as needed. Whether you need 10 riders or 1,000, we can deploy trained, insured, and licensed professionals within days.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "MOHRE registered workforce",
                    "Wage Protection System (WPS) compliant",
                    "Summer midday break compliance (June-September)",
                    "8-hour workday with proper overtime compensation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-secondary/80">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* For Riders — Visa Sponsorship */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-primary">
                Career Opportunities
              </span>
              <h2
                className="font-heading font-black text-secondary"
                style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
              >
                Rider Jobs with <span className="text-primary">Visa Sponsorship</span> UAE
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Looking for a rewarding career in delivery? UrbanFleet offers visa sponsorship for eligible riders, competitive salaries, mandatory health insurance, and opportunities for growth.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {[
                  { icon: FileCheck, title: "Visa Sponsorship", desc: "Employment visa provided" },
                  { icon: GraduationCap, title: "Full Training", desc: "Comprehensive onboarding" },
                  { icon: Heart, title: "Health Insurance", desc: "Mandatory UAE coverage" },
                  { icon: TrendingUp, title: "Career Growth", desc: "Advancement opportunities" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/apply/rider"
                className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-orange-600"
              >
                Apply to Join <ArrowRight className="h-5 w-5" />
              </Link>
            </Reveal>

            <Reveal delay={120} className="relative">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={riderVisaImage}
                  alt="UrbanFleet delivery rider"
                  loading="lazy"
                  width={900}
                  height={600}
                  className="aspect-[4/5] w-full object-cover sm:aspect-square"
                />
              </div>
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-md sm:-left-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                  <FileCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-secondary">Visa Sponsorship</div>
                  <div className="text-sm text-muted-foreground">Available for riders</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fleet — responsive grid (replaces autoplay carousel) */}
      <section id="fleet" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary">
              Our Fleet
            </span>
            <h2
              className="font-heading font-black text-secondary"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Delivery <span className="text-primary">Fleet</span> Management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Cyclists, motorcycles, cars, vans, and trucks - our branded fleet scales to meet any business requirement.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Cyclist Fleet", desc: "Eco-friendly bicycle deliveries for urban areas.", img: fleetCyclistsImage, stat: "200+ Cyclists" },
              { title: "Motorcycle Fleet", desc: "UrbanFleet branded bikes for fast urban deliveries.", img: fleetMotorcyclesImage, stat: "500+ Bikes" },
              { title: "Car Fleet", desc: "Professional delivery cars for premium services.", img: fleetCarsImage, stat: "150+ Cars" },
              { title: "Van Fleet", desc: "Branded vans for medium-sized cargo transport.", img: fleetVansImage, stat: "100+ Vans" },
              { title: "Truck Fleet", desc: "Heavy-duty trucks for large logistics operations.", img: fleetTrucksImage, stat: "50+ Trucks" },
              { title: "Uniformed Riders", desc: "Professional riders representing your brand.", img: riderVisaImage, stat: "1500+ Riders" },
            ].map((item, i) => (
              <Reveal key={i} delay={(i % 3) * 80} className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      width={800}
                      height={450}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-grow flex-col p-6">
                    <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {item.stat}
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-secondary">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { number: "1,500+", label: "Active Riders", icon: Users },
              { number: "200+", label: "Partner Companies", icon: Building2 },
              { number: "7", label: "Emirates Covered", icon: Globe },
              { number: "24/7", label: "Support Available", icon: Headphones },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div
                    className="font-heading font-black text-secondary"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
                  >
                    {stat.number}
                  </div>
                  <div className="mt-1 font-medium text-muted-foreground">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="relative overflow-hidden bg-gradient-to-br from-[#0c122a] via-[#16224a] to-[#0c122a] py-20 md:py-28"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(50% 50% at 85% 15%, rgba(245,106,7,0.18), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-4">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2
              className="font-heading font-black text-white"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
            >
              Ready to <span className="text-primary">Get Started</span>?
            </h2>
            <p className="mt-5 text-lg text-gray-300">
              Whether you need riders, want to partner, or looking to join - contact us today.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href="mailto:info@urbanfleetdelivery.ae"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-orange-600"
              >
                <Mail className="h-5 w-5" /> Contact Us
              </a>
              <a
                href="tel:+971501234567"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-5 w-5" /> +971 50 123 4567
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c122a] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Logo className="h-14 md:h-16" />
              <p className="mt-6 max-w-md leading-relaxed text-gray-400">
                UrbanFleet supplies professional, trained, insured, and licensed delivery riders workforce to businesses across the UAE. We work with contractors and sponsor visas for our riders.
              </p>
              <p className="mt-4 text-xl font-semibold italic text-primary">
                "Delivery you can trust."
              </p>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-bold text-primary">Work With Us</h4>
              <ul className="space-y-3 text-gray-400">
                {[
                  { label: "For Businesses", href: "/contact/business" },
                  { label: "For Contractors", href: "/apply/contractor" },
                  { label: "Join as Rider", href: "/apply/rider" },
                  { label: "Visa Sponsorship", href: "/apply/rider" },
                  { label: "Our Team", href: "/team" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white"
                    >
                      <ArrowRight className="h-3 w-3 text-primary" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-bold text-primary">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <span>
                    Coastal Building, Office 301
                    <br />
                    Al Qusais Metro Station, Exit 2
                    <br />
                    Dubai, UAE
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+971501234567"
                    className="flex min-h-11 items-center gap-3 transition-colors hover:text-white"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    +971 50 123 4567
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@urbanfleetdelivery.ae"
                    className="flex min-h-11 items-center gap-3 transition-colors hover:text-white"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    info@urbanfleetdelivery.ae
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} UrbanFleet Delivery Services. All rights reserved.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
                <a href="/privacy" className="transition-colors hover:text-white">
                  Privacy Policy
                </a>
                <a href="/terms" className="transition-colors hover:text-white">
                  Terms of Use
                </a>
                <span className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Compliant with UAE Federal Decree-Law No. 45 of 2021 (PDPL)
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

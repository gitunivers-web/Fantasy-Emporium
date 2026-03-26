import { Link, useLocation } from 'wouter';
import { ShoppingBag, Search, Menu, X, Heart, ShieldCheck, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { getTotals } = useCartStore();
  const { count } = getTotals();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/shop', label: 'Boutique' },
    { href: '/shop?category=lingerie', label: 'Lingerie' },
    { href: '/shop?featured=true', label: 'Nouveautés' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-white/10 py-3 shadow-lg" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -ml-2 text-foreground/80 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl md:text-3xl font-bold tracking-wider text-foreground group-hover:text-primary transition-colors">
              Plaisir<span className="text-primary italic">Xpress</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-foreground/70"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/shop" className="p-2 text-foreground/80 hover:text-primary transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 text-foreground/80 hover:text-primary transition-colors relative group">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-3xl border-r border-white/10 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="font-display text-2xl font-bold">Plaisir<span className="text-primary italic">Xpress</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-foreground/80 hover:text-primary">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-lg font-medium uppercase tracking-widest text-foreground/80 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#050208] border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <span className="font-display text-2xl font-bold tracking-wider text-foreground mb-4 block">
              Plaisir<span className="text-primary italic">Xpress</span>
            </span>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              L'élégance et la discrétion au service de vos désirs les plus intimes. Une sélection premium pour des moments inoubliables.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>100% Sécurisé & Discret</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-foreground">Boutique</h4>
            <ul className="space-y-3">
              <li><Link href="/shop?category=vibrators" className="text-muted-foreground hover:text-primary transition-colors text-sm">Vibromasseurs</Link></li>
              <li><Link href="/shop?category=dildos" className="text-muted-foreground hover:text-primary transition-colors text-sm">Godes & Dildos</Link></li>
              <li><Link href="/shop?category=lingerie" className="text-muted-foreground hover:text-primary transition-colors text-sm">Lingerie</Link></li>
              <li><Link href="/shop?category=bdsm" className="text-muted-foreground hover:text-primary transition-colors text-sm">BDSM</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-foreground">Service Client</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contactez-nous</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Livraison Discrète</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Retours & Remboursements</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-foreground">Info Légale</h4>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4">
              <p className="text-xs text-primary font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse"></span>
                Site réservé aux 18 ans et plus.
              </p>
            </div>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Conditions d'utilisation</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PlaisirXpress. Tous droits réservés. (Mockup Demo)
          </p>
          <div className="flex gap-4">
            {/* Payment icons mock */}
            <div className="w-8 h-5 bg-white/10 rounded"></div>
            <div className="w-8 h-5 bg-white/10 rounded"></div>
            <div className="w-8 h-5 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

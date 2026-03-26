import { Link } from 'wouter';
import { ShieldCheck, Package, Lock, Heart, ArrowRight } from 'lucide-react';
import { useListProducts } from '@workspace/api-client-react';
import { Button } from '@/components/ui-custom';
import { ProductCard } from '@/components/product-card';

const CATEGORIES = [
  { slug: 'vibrators', name: 'Vibromasseurs', img: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=500&q=80' },
  { slug: 'dildos', name: 'Godes & Dildos', img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500&q=80' },
  { slug: 'lingerie', name: 'Lingerie', img: 'https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?w=500&q=80' },
  { slug: 'bdsm', name: 'BDSM', img: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=500&q=80' },
  { slug: 'sex-dolls', name: 'Poupées', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' },
  { slug: 'pills', name: 'Stimulants', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
];

export default function Home() {
  const { data: featuredProducts, isLoading } = useListProducts({ featured: true });

  // Generate some mock products if API is empty for the demo
  const mockProducts = [
    { id: 1, name: "Le Bijou Rose - Vibromasseur Lapin", price: 129.99, discountPrice: 89.99, category: "Vibromasseurs", categorySlug: "vibrators", imageUrl: "", inStock: true, featured: true, rating: 4.8, reviewCount: 124, description: "" },
    { id: 2, name: "Ensemble Dentelle Noire Séduction", price: 79.99, category: "Lingerie", categorySlug: "lingerie", imageUrl: "", inStock: true, featured: true, rating: 4.9, reviewCount: 89, description: "" },
    { id: 3, name: "Baguette de Verre Élégance", price: 54.99, category: "Dildos", categorySlug: "dildos", imageUrl: "", inStock: true, featured: true, rating: 4.6, reviewCount: 45, description: "" },
    { id: 4, name: "Kit Découverte BDSM Premium", price: 149.99, category: "BDSM", categorySlug: "bdsm", imageUrl: "", inStock: true, featured: true, rating: 4.7, reviewCount: 210, description: "" },
  ];

  const productsToDisplay = featuredProducts?.length ? featuredProducts.slice(0, 4) : mockProducts;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-48 overflow-hidden">
        {/* Declared image from requirements.yaml */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="PlaisirXpress Hero" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block animate-in slide-in-from-bottom-4 duration-700">
              Boutique Premium pour Adultes
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-in slide-in-from-bottom-6 duration-1000">
              Éveillez vos <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-300 text-glow">désirs profonds</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg animate-in slide-in-from-bottom-8 duration-1000 delay-150">
              Découvrez notre collection exclusive de sextoys, lingerie et accessoires conçus pour magnifier votre intimité. Discrétion et élégance garanties.
            </p>
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom-10 duration-1000 delay-300">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto box-glow">
                  Découvrir la collection
                </Button>
              </Link>
              <Link href="/shop?category=lingerie">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  Lingerie Fine
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col items-center py-4 md:py-0 px-4">
              <Package className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-semibold mb-1">Livraison Discrète</h3>
              <p className="text-sm text-muted-foreground">Emballage neutre sans mention du site</p>
            </div>
            <div className="flex flex-col items-center py-4 md:py-0 px-4">
              <Lock className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-semibold mb-1">Paiement Sécurisé</h3>
              <p className="text-sm text-muted-foreground">Transactions cryptées de bout en bout</p>
            </div>
            <div className="flex flex-col items-center py-4 md:py-0 px-4">
              <ShieldCheck className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-semibold mb-1">Qualité Premium</h3>
              <p className="text-sm text-muted-foreground">Silicone médical et matériaux sûrs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Parcourir par Catégorie</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full opacity-50" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`}>
                <div className="group relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden hover-lift border border-white/5">
                  {/* subtle abstract unsplash images for categories to maintain SFW mockup nature */}
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80 mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12 px-4">
                    <h3 className="font-display text-xl md:text-3xl font-semibold text-white mb-2 text-center">{cat.name}</h3>
                    <span className="text-primary text-sm uppercase tracking-widest font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
                      Explorer <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Sélection Premium</h2>
              <p className="text-muted-foreground">Nos pièces les plus convoitées</p>
            </div>
            <Link href="/shop?featured=true" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" />
              ))
            ) : (
              productsToDisplay.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop?featured=true">
              <Button variant="outline" className="w-full">Voir tout</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Discreet Shipping Banner */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-card to-background border border-primary/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Votre secret est en sécurité</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Toutes nos commandes sont expédiées dans des boîtes d'expédition standard, sans logo ni mention de notre boutique. Le relevé bancaire affichera "PX Web Services".
              </p>
              <ul className="space-y-4 text-sm font-medium text-foreground/80 mb-8 inline-block text-left">
                <li className="flex items-center gap-3"><Heart className="w-5 h-5 text-primary" /> Plaisir sans compromis</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-primary" /> Emballage 100% anonyme</li>
                <li className="flex items-center gap-3"><Package className="w-5 h-5 text-primary" /> Expédition en 24h</li>
              </ul>
              <div>
                 <Link href="/shop"><Button className="box-glow">Commander maintenant</Button></Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square relative">
               <img 
                 src={`${import.meta.env.BASE_URL}images/discreet-box.png`} 
                 alt="Boîte discrète" 
                 className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl"
               />
               <div className="absolute -bottom-6 -left-6 bg-background border border-primary/30 p-4 rounded-xl shadow-xl glass-panel">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <div>
                      <div className="font-bold text-sm">Certifié Discret</div>
                      <div className="text-xs text-muted-foreground">Garanti par PX</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

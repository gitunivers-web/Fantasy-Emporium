import { useState } from 'react';
import { useLocation } from 'wouter';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useListProducts, useListCategories } from '@workspace/api-client-react';
import { ProductCard } from '@/components/product-card';
import { Button, Input, Label } from '@/components/ui-custom';

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get('category') || '';
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: categories } = useListCategories();
  
  // Transform filters for API
  const apiParams = {
    ...(filters.category && { category: filters.category }),
    ...(filters.search && { search: filters.search }),
    ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
    ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) }),
  };

  const { data: products, isLoading } = useListProducts(apiParams);

  // Mock categories if API empty
  const displayCategories = categories?.length ? categories : [
    { slug: 'vibrators', name: 'Vibromasseurs', productCount: 42 },
    { slug: 'dildos', name: 'Godes & Dildos', productCount: 38 },
    { slug: 'lingerie', name: 'Lingerie', productCount: 65 },
    { slug: 'bdsm', name: 'BDSM', productCount: 24 },
    { slug: 'sex-dolls', name: 'Poupées Sexuelles', productCount: 12 },
    { slug: 'pills', name: 'Stimulants', productCount: 18 },
  ];

  // Mock products if API empty
  const mockProducts = [
    { id: 101, name: "Vibromasseur Haute Puissance 'Le Rêve'", price: 89.99, category: "Vibromasseurs", categorySlug: "vibrators", imageUrl: "", inStock: true, featured: false, rating: 4.5, reviewCount: 34, description: "" },
    { id: 102, name: "Godemichet Réaliste Premium 20cm", price: 65.50, category: "Dildos", categorySlug: "dildos", imageUrl: "", inStock: true, featured: false, rating: 4.8, reviewCount: 112, description: "" },
    { id: 103, name: "Corset Dentelle Écarlate", price: 110.00, discountPrice: 85.00, category: "Lingerie", categorySlug: "lingerie", imageUrl: "", inStock: true, featured: true, rating: 4.9, reviewCount: 56, description: "" },
    { id: 104, name: "Menottes Cuir et Fausse Fourrure", price: 45.00, category: "BDSM", categorySlug: "bdsm", imageUrl: "", inStock: true, featured: false, rating: 4.4, reviewCount: 23, description: "" },
    { id: 105, name: "Lubrifiant Base Eau Premium 250ml", price: 24.99, category: "Accessoires", categorySlug: "accessories", imageUrl: "", inStock: true, featured: false, rating: 4.7, reviewCount: 305, description: "" },
    { id: 106, name: "Stimulateur Prostatique Ergonomique", price: 75.00, category: "Vibromasseurs", categorySlug: "vibrators", imageUrl: "", inStock: true, featured: false, rating: 4.6, reviewCount: 88, description: "" },
  ].filter(p => !filters.category || p.categorySlug === filters.category);

  const displayProducts = products?.length ? products : mockProducts;

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', search: '', minPrice: '', maxPrice: '' });
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-primary border-b border-white/10 pb-2">Recherche</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Chercher un produit..." 
            className="pl-9"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-primary border-b border-white/10 pb-2">Catégories</h3>
        <div className="space-y-2">
          <button 
            className={`block w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${!filters.category ? 'bg-primary/20 text-primary' : 'text-foreground/80 hover:bg-white/5'}`}
            onClick={() => handleFilterChange('category', '')}
          >
            Toutes les catégories
          </button>
          {displayCategories.map(cat => (
            <button 
              key={cat.slug}
              className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${filters.category === cat.slug ? 'bg-primary/20 text-primary font-medium' : 'text-foreground/80 hover:bg-white/5'}`}
              onClick={() => handleFilterChange('category', cat.slug)}
            >
              <span>{cat.name}</span>
              <span className="text-xs opacity-50">{cat.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-primary border-b border-white/10 pb-2">Prix ($)</h3>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            placeholder="Min" 
            className="w-full text-center px-2" 
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <Input 
            type="number" 
            placeholder="Max" 
            className="w-full text-center px-2"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-2">Boutique</h1>
        <p className="text-muted-foreground">Découvrez notre collection de plaisirs raffinés.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between border-b border-white/10 pb-4">
          <Button variant="outline" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <span className="text-sm text-muted-foreground">{displayProducts.length} résultats</span>
        </div>

        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28 glass-panel rounded-2xl p-6">
            <FilterSidebar />
          </div>
        </aside>

        {/* Sidebar Mobile (Conditionally rendered) */}
        {showMobileFilters && (
          <div className="lg:hidden glass-panel rounded-2xl p-6 mb-6 relative">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setShowMobileFilters(false)}>
              <X className="w-5 h-5" />
            </button>
            <FilterSidebar />
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          <div className="hidden lg:flex justify-between items-center mb-6 text-sm text-muted-foreground">
            <span>Affichage de {displayProducts.length} produits</span>
            {/* Simple mock sort select */}
            <select className="bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:border-primary">
              <option>Pertinence</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Mieux notés</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres ou termes de recherche.</p>
              <Button onClick={clearFilters}>Réinitialiser la recherche</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

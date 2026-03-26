import { useState } from 'react';
import { useRoute } from 'wouter';
import { Check, Star, ShieldCheck, Heart, Truck, AlertCircle } from 'lucide-react';
import { useGetProduct } from '@workspace/api-client-react';
import { Button } from '@/components/ui-custom';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const productId = Number(params?.id);
  
  const { data: product, isLoading, isError } = useGetProduct(productId, {
    query: { enabled: !isNaN(productId) }
  });

  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Fallback mock data if API fails or is empty for this ID
  const mockProduct = {
    id: productId,
    name: "L'Écrin de Velours - Stimulateur Haute Définition",
    description: "Une expérience sensorielle sans précédent. Conçu avec un silicone médical ultra-doux, ce stimulateur offre 10 modes de vibration silencieux. Son design ergonomique épouse parfaitement les courbes de votre corps pour cibler les zones les plus sensibles. Rechargeable par USB magnétique, 100% étanche pour une utilisation sous la douche ou dans le bain.",
    price: 149.99,
    discountPrice: 119.99,
    category: "Vibromasseurs",
    categorySlug: "vibrators",
    imageUrl: "https://images.unsplash.com/photo-1615526685601-52d3a3c20c02?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1615526685601-52d3a3c20c02?w=800&q=80",
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80"
    ],
    colors: ["#D4AF37", "#000000", "#FFC0CB"],
    sizes: ["Standard"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 245,
    brand: "PlaisirXpress Collection",
    material: "Silicone médical 100%",
    length: "15cm",
    diameter: "3.5cm"
  };

  const displayProduct = product || mockProduct;
  
  const [activeImage, setActiveImage] = useState(displayProduct.images?.[0] || displayProduct.imageUrl);

  // Initialize selections once product loads
  if (!selectedColor && displayProduct.colors?.length) setSelectedColor(displayProduct.colors[0]);
  if (!selectedSize && displayProduct.sizes?.length) setSelectedSize(displayProduct.sizes[0]);

  const handleAddToCart = () => {
    addItem(displayProduct as any, quantity, selectedColor, selectedSize);
    // Could add a toast notification here
  };

  if (isLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex animate-pulse gap-12">
        <div className="w-1/2 aspect-square bg-white/5 rounded-3xl"></div>
        <div className="w-1/2 space-y-6 pt-12">
          <div className="h-10 bg-white/5 w-3/4 rounded"></div>
          <div className="h-6 bg-white/5 w-1/4 rounded"></div>
          <div className="h-32 bg-white/5 w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (isError && !product) {
    return <div className="text-center py-24 text-destructive">Erreur de chargement du produit.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] md:aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/10 relative">
            <img 
              src={activeImage} 
              alt={displayProduct.name} 
              className="w-full h-full object-cover mix-blend-luminosity opacity-80"
            />
            {displayProduct.discountPrice && (
              <div className="absolute top-6 left-6 bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                Économisez {formatPrice(displayProduct.price - displayProduct.discountPrice)}
              </div>
            )}
          </div>
          
          {displayProduct.images && displayProduct.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {displayProduct.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover mix-blend-luminosity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col py-4">
          <div className="mb-6">
            <div className="text-primary font-medium tracking-widest text-xs uppercase mb-2">
              {displayProduct.brand || displayProduct.category}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {displayProduct.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(displayProduct.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                {displayProduct.reviewCount} Avis
              </span>
            </div>
          </div>

          <div className="mb-8">
            {displayProduct.discountPrice ? (
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-primary">{formatPrice(displayProduct.discountPrice)}</span>
                <span className="text-xl text-muted-foreground line-through mb-1">{formatPrice(displayProduct.price)}</span>
              </div>
            ) : (
              <span className="text-4xl font-bold text-foreground">{formatPrice(displayProduct.price)}</span>
            )}
            <div className="text-sm text-muted-foreground mt-2">Taxes incluses. Expédition calculée à l'étape suivante.</div>
          </div>

          <p className="text-foreground/80 leading-relaxed mb-8">
            {displayProduct.description}
          </p>

          <div className="space-y-6 mb-10">
            {/* Colors */}
            {displayProduct.colors && displayProduct.colors.length > 0 && (
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">Couleur</span>
                  <span className="text-muted-foreground">{selectedColor || 'Sélectionner'}</span>
                </div>
                <div className="flex gap-3">
                  {displayProduct.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-primary scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'border-white/20 hover:border-white/50'}`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && <Check className={`w-4 h-4 ${color === '#ffffff' || color === '#FDF8FF' ? 'text-black' : 'text-white'}`} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {displayProduct.sizes && displayProduct.sizes.length > 0 && (
              <div>
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>Taille</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {displayProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size ? 'border-primary bg-primary/20 text-primary' : 'border-white/20 hover:border-white/50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border border-white/20 rounded-xl bg-background/50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-muted-foreground hover:text-primary transition-colors">-</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-muted-foreground hover:text-primary transition-colors">+</button>
              </div>
              <Button 
                size="lg" 
                className="flex-1 box-glow" 
                disabled={!displayProduct.inStock}
                onClick={handleAddToCart}
              >
                {displayProduct.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
              </Button>
              <Button variant="outline" size="icon" className="w-14 shrink-0 border-white/20">
                <Heart className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </Button>
            </div>
          </div>

          {/* Details list */}
          <div className="border-t border-white/10 pt-8 mt-auto grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex items-start gap-3">
               <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
               <div>
                 <span className="block font-medium text-foreground">Garantie 1 an</span>
                 <span className="text-muted-foreground">Couvre les défauts d'usine</span>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <Truck className="w-5 h-5 text-primary shrink-0" />
               <div>
                 <span className="block font-medium text-foreground">Expédition 24H</span>
                 <span className="text-muted-foreground">Emballage 100% discret</span>
               </div>
            </div>
            {displayProduct.material && (
               <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                 <div>
                   <span className="block font-medium text-foreground">Matériau</span>
                   <span className="text-muted-foreground">{displayProduct.material}</span>
                 </div>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

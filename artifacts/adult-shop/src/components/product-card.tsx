import { Link } from 'wouter';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@workspace/api-client-react';
import { formatPrice } from '@/lib/utils';
import { Button, Badge } from './ui-custom';
import { useCartStore } from '@/store/cart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  
  // Fallback image if missing
  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1615526685601-52d3a3c20c02?w=800&q=80`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    addItem(product, 1, product.colors?.[0], product.sizes?.[0]);
  };

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group flex flex-col bg-card/40 border border-white/5 rounded-2xl overflow-hidden hover-lift h-full relative">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {discountPercent > 0 && (
            <Badge variant="destructive" className="shadow-lg">-{discountPercent}%</Badge>
          )}
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.4)]">Populaire</Badge>
          )}
        </div>

        {/* Image */}
        <div className="aspect-[4/5] relative overflow-hidden bg-white/5">
          {/* using abstract/subtle unsplash for mock if no image provided */}
          {/* placeholder elegant dark object */}
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
          
          {/* Quick Add Button overlay */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4">
             <Button 
                variant="glass" 
                size="sm" 
                className="w-full bg-background/60 text-primary border-primary/20 backdrop-blur-md hover:bg-primary hover:text-primary-foreground"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajout Rapide
             </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="text-xs text-primary/80 uppercase tracking-wider mb-2 font-medium">
            {product.category}
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="text-xs font-medium text-foreground/90">{product.rating?.toFixed(1) || '5.0'}</span>
            <span className="text-xs text-muted-foreground ml-1">({product.reviewCount || 0} avis)</span>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              {product.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(product.discountPrice)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
              )}
            </div>
            
            {/* Color swatches preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1">
                {product.colors.slice(0,3).map(color => (
                  <div key={color} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color }}></div>
                ))}
                {product.colors.length > 3 && <span className="text-[10px] text-muted-foreground">+{product.colors.length - 3}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

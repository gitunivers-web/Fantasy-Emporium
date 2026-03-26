import { Link } from 'wouter';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui-custom';
import { formatPrice } from '@/lib/utils';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display text-4xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8 text-lg">Il semble que vous n'ayez pas encore fait de choix pour pimenter votre soirée.</p>
        <Link href="/shop">
          <Button size="lg" className="box-glow">
            Découvrir la boutique
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-10">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const price = item.product.discountPrice || item.product.price;
            const img = item.product.imageUrl || "https://images.unsplash.com/photo-1615526685601-52d3a3c20c02?w=200&q=80";

            return (
              <div key={item.id} className="flex gap-6 p-4 rounded-2xl glass-panel relative group">
                <Link href={`/product/${item.product.id}`} className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white/5 rounded-xl overflow-hidden">
                  <img src={img} alt={item.product.name} className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-medium text-lg leading-tight hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {(item.color || item.size) && (
                      <div className="text-sm text-muted-foreground mt-1 flex gap-4">
                        {item.color && <span>Couleur: <span className="inline-block w-3 h-3 rounded-full ml-1 align-middle border border-white/20" style={{ backgroundColor: item.color }}></span></span>}
                        {item.size && <span>Taille: {item.size}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-white/20 rounded-lg bg-background/50 h-9">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 text-muted-foreground hover:text-primary">-</button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 text-muted-foreground hover:text-primary">+</button>
                    </div>
                    <div className="font-bold text-lg text-primary">
                      {formatPrice(price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-3xl sticky top-28">
            <h3 className="font-display text-2xl font-bold mb-6">Résumé</h3>
            
            <div className="space-y-4 text-sm mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expédition (Discrète)</span>
                <span className="font-medium">Calculé à l'étape suivante</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-medium text-lg">Total estimé</span>
              <span className="font-bold text-2xl text-primary">{formatPrice(subtotal)}</span>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full box-glow text-lg h-14">
                Procéder au paiement <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
               <ShieldCheck className="w-4 h-4 text-primary" />
               Paiement crypté SSL 256-bit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

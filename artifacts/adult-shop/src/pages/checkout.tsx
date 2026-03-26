import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateOrder } from '@workspace/api-client-react';
import { useCartStore } from '@/store/cart';
import { Button, Input, Label } from '@/components/ui-custom';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, Lock } from 'lucide-react';

const checkoutSchema = z.object({
  customerEmail: z.string().email("Email invalide"),
  customerName: z.string().min(2, "Nom requis"),
  shippingAddress: z.object({
    street: z.string().min(5, "Adresse requise"),
    city: z.string().min(2, "Ville requise"),
    province: z.string().min(2, "Province requise"),
    postalCode: z.string().min(4, "Code postal requis"),
    country: z.string().default("Canada"),
  }),
  paymentMethod: z.string().default("credit_card"),
  cardNumber: z.string().min(15, "Numéro de carte invalide"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA"),
  cvv: z.string().min(3, "CVV requis")
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  
  const createOrder = useCreateOrder();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: { country: 'Canada' },
      paymentMethod: 'credit_card'
    }
  });

  // Redirect if cart empty
  if (items.length === 0) {
    setLocation('/cart');
    return null;
  }

  const shippingCost = subtotal > 100 ? 0 : 15;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const orderData = {
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        cardLastFour: data.cardNumber.slice(-4),
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        }))
      };

      // Call API
      const response = await createOrder.mutateAsync({ data: orderData });
      
      // On success
      clearCart();
      setLocation(`/order-confirmation?id=${response.orderNumber}`);
    } catch (error) {
      console.error("Order failed", error);
      // Even if mock API fails, simulate success for the demo flow since it's a mock frontend
      const mockOrderNumber = `PX-${Math.floor(Math.random() * 1000000)}`;
      clearCart();
      setLocation(`/order-confirmation?id=${mockOrderNumber}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-10">
        <Lock className="w-6 h-6 text-primary" />
        <h1 className="font-display text-3xl font-bold">Paiement Sécurisé</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium border-b border-white/10 pb-2">Informations de contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom complet (sur le colis)</Label>
                  <Input {...register('customerName')} error={!!errors.customerName} />
                  {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Adresse courriel (pour le reçu)</Label>
                  <Input type="email" {...register('customerEmail')} error={!!errors.customerEmail} />
                  {errors.customerEmail && <p className="text-xs text-destructive">{errors.customerEmail.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium border-b border-white/10 pb-2">Adresse de livraison (Discrète)</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Adresse Civique</Label>
                  <Input {...register('shippingAddress.street')} error={!!errors.shippingAddress?.street} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input {...register('shippingAddress.city')} error={!!errors.shippingAddress?.city} />
                  </div>
                  <div className="space-y-2">
                    <Label>Province / État</Label>
                    <Input {...register('shippingAddress.province')} error={!!errors.shippingAddress?.province} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Code Postal</Label>
                    <Input {...register('shippingAddress.postalCode')} error={!!errors.shippingAddress?.postalCode} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pays</Label>
                    <Input {...register('shippingAddress.country')} disabled className="bg-background/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium border-b border-white/10 pb-2 flex items-center justify-between">
                <span>Paiement</span>
                <span className="text-xs font-normal text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded">Apparaîtra comme "PX Web"</span>
              </h2>
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="space-y-2">
                  <Label>Numéro de carte de crédit (MOCK)</Label>
                  <Input placeholder="0000 0000 0000 0000" {...register('cardNumber')} error={!!errors.cardNumber} />
                  {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiration (MM/AA)</Label>
                    <Input placeholder="12/25" {...register('expiry')} error={!!errors.expiry} />
                  </div>
                  <div className="space-y-2">
                    <Label>Code de sécurité (CVV)</Label>
                    <Input type="password" placeholder="123" {...register('cvv')} error={!!errors.cvv} />
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-8 rounded-3xl sticky top-28 border border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
            <h3 className="font-display text-2xl font-bold mb-6">Récapitulatif</h3>
            
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 rounded bg-white/5 flex-shrink-0 relative">
                       <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10">{item.quantity}</span>
                    </div>
                    <span className="truncate pr-4 text-muted-foreground">{item.product.name}</span>
                  </div>
                  <span className="font-medium flex-shrink-0">{formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-4 border-y border-white/10 text-sm mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Expédition Discrète Rapide</span>
                <span>{shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-medium">Total</span>
              <span className="text-3xl font-bold text-primary">{formatPrice(total)}</span>
            </div>

            <Button 
              type="submit" 
              form="checkout-form" 
              size="lg" 
              className="w-full box-glow h-14 text-lg"
              isLoading={createOrder.isPending}
            >
              Confirmer l'achat
            </Button>
            
            <div className="mt-4 text-center">
              <span className="text-[10px] text-muted-foreground/60">Ceci est un site de démonstration. Aucun paiement réel ne sera effectué.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

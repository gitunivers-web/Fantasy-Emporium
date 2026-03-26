import { Link, useLocation } from 'wouter';
import { CheckCircle2, Package, Mail } from 'lucide-react';
import { Button } from '@/components/ui-custom';

export default function OrderConfirmation() {
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get('id') || 'PX-849201';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-10 rounded-3xl text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary border border-primary/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="font-display text-4xl font-bold mb-4">Commande Confirmée</h1>
          
          <div className="inline-block bg-background/50 border border-white/10 rounded-lg px-4 py-2 mb-6">
            <span className="text-muted-foreground text-sm mr-2">Numéro de commande:</span>
            <span className="font-bold tracking-wider text-primary">{orderId}</span>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Merci pour votre achat. Nous préparons actuellement votre colis dans la plus stricte intimité.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-left bg-background/30 p-4 rounded-xl mb-8">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-xs text-muted-foreground">Reçu envoyé</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Package className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-medium">Expédition</div>
                <div className="text-xs text-muted-foreground">Colis neutre 24h</div>
              </div>
            </div>
          </div>
          
          <Link href="/">
            <Button className="w-full box-glow">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

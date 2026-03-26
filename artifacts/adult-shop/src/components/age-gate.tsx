import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui-custom';

export function AgeGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // default true to avoid flash

  useEffect(() => {
    const verified = localStorage.getItem('plaisirxpress_age_verified');
    if (!verified) {
      setIsVerified(false);
      setIsOpen(true);
      // Prevent scrolling when open
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('plaisirxpress_age_verified', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setIsVerified(true), 500); // Wait for animation
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  if (isVerified && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md p-8 rounded-2xl glass-panel relative overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            
            <span className="font-display text-4xl font-bold tracking-wider text-foreground mb-2 block relative z-10">
              Plaisir<span className="text-primary italic">Xpress</span>
            </span>
            
            <h2 className="text-xl font-medium text-foreground mb-4 relative z-10">
              Avertissement de contenu
            </h2>
            
            <p className="text-muted-foreground text-sm mb-8 relative z-10 leading-relaxed">
              Ce site contient du matériel à caractère sexuel explicite réservé aux adultes. 
              En entrant sur ce site, vous confirmez que vous avez au moins 18 ans 
              (ou l'âge de la majorité dans votre juridiction) et que vous consentez 
              à voir ce type de contenu.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/5 text-foreground" 
                onClick={handleDeny}
              >
                Je n'ai pas 18 ans
              </Button>
              <Button 
                className="w-full box-glow" 
                onClick={handleConfirm}
              >
                J'ai 18 ans ou plus
              </Button>
            </div>
            
            <p className="text-[10px] text-muted-foreground/60 mt-6 relative z-10">
              Ce site utilise des cookies pour mémoriser votre choix.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

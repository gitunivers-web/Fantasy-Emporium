import { useState, useRef } from 'react';
import { useRoute } from 'wouter';
import { Check, Star, ShieldCheck, Heart, Truck, AlertCircle, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useGetProduct } from '@workspace/api-client-react';
import { Button } from '@/components/ui-custom';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const goFullscreen = () => {
    if (videoRef.current) videoRef.current.requestFullscreen?.();
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black group aspect-video">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-4 left-4">
        <span className="bg-primary/90 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Vidéo Immersive
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex gap-3">
          <button onClick={togglePlay} className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button onClick={toggleMute} className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        <button onClick={goFullscreen} className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

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
  const [added, setAdded] = useState(false);

  const mockProduct = {
    id: productId,
    name: "L'Écrin de Velours – Stimulateur Haute Définition",
    description: "Une expérience sensorielle sans précédent. Conçu avec un silicone médical ultra-doux, ce stimulateur offre 10 modes de vibration silencieux. Son design ergonomique épouse parfaitement les courbes de votre corps.",
    price: 149.99,
    discountPrice: 119.99,
    category: "Vibromasseurs",
    categorySlug: "vibrators",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
      "https://images.unsplash.com/photo-1577538928305-3807c3993047?w=800&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
    ],
    colors: ["Rose", "Noir", "Violet"],
    sizes: ["Standard"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 245,
    brand: "PlaisirXpress",
    material: "Silicone médical 100%",
    length: "15cm",
    diameter: "3.5cm",
    videoUrl: null,
    tags: [],
  };

  const displayProduct = (product as any) || mockProduct;

  const allImages: string[] = displayProduct.images?.length
    ? displayProduct.images
    : [displayProduct.imageUrl];

  const [activeImage, setActiveImage] = useState<string>(allImages[0]);

  if (!selectedColor && displayProduct.colors?.length) setSelectedColor(displayProduct.colors[0]);
  if (!selectedSize && displayProduct.sizes?.length) setSelectedSize(displayProduct.sizes[0]);

  const handleAddToCart = () => {
    addItem(displayProduct as any, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex animate-pulse gap-12">
        <div className="w-1/2 aspect-square bg-white/5 rounded-3xl" />
        <div className="w-1/2 space-y-6 pt-12">
          <div className="h-10 bg-white/5 w-3/4 rounded" />
          <div className="h-6 bg-white/5 w-1/4 rounded" />
          <div className="h-32 bg-white/5 w-full rounded" />
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

        {/* Left: Images + Video */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/10 relative">
            <img
              src={activeImage}
              alt={displayProduct.name}
              className="w-full h-full object-cover mix-blend-luminosity opacity-85"
            />
            {displayProduct.discountPrice && (
              <div className="absolute top-6 left-6 bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                -{Math.round(((displayProduct.price - displayProduct.discountPrice) / displayProduct.price) * 100)}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover mix-blend-luminosity" />
                </button>
              ))}
            </div>
          )}

          {/* Video Player */}
          {displayProduct.videoUrl && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-widest">Présentation Vidéo</h3>
              <VideoPlayer src={displayProduct.videoUrl} />
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col py-4">
          <div className="mb-4">
            <div className="text-primary font-medium tracking-widest text-xs uppercase mb-2">
              {displayProduct.brand || displayProduct.category}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {displayProduct.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(displayProduct.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {displayProduct.reviewCount} avis vérifiés
              </span>
            </div>
          </div>

          <div className="mb-6">
            {displayProduct.discountPrice ? (
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-primary">{formatPrice(displayProduct.discountPrice)}</span>
                <span className="text-xl text-muted-foreground line-through mb-1">{formatPrice(displayProduct.price)}</span>
                <span className="mb-1 text-sm text-destructive font-semibold">
                  Vous économisez {formatPrice(displayProduct.price - displayProduct.discountPrice)}
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold">{formatPrice(displayProduct.price)}</span>
            )}
            <p className="text-xs text-muted-foreground mt-1">Taxes incluses · Livraison calculée au prochain écran</p>
          </div>

          <p className="text-foreground/80 leading-relaxed mb-6 text-sm">
            {displayProduct.description}
          </p>

          <div className="space-y-5 mb-8">
            {/* Colors */}
            {displayProduct.colors && displayProduct.colors.length > 0 && (
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">Couleur</span>
                  <span className="text-muted-foreground">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayProduct.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all ${selectedColor === color ? 'border-primary bg-primary/20 text-primary' : 'border-white/20 hover:border-white/50 text-muted-foreground'}`}
                    >
                      {selectedColor === color && <Check className="w-3 h-3 inline mr-1" />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {displayProduct.sizes && displayProduct.sizes.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-2">Taille / Dosage</span>
                <div className="flex flex-wrap gap-2">
                  {displayProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size ? 'border-primary bg-primary/20 text-primary' : 'border-white/20 hover:border-white/50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center border border-white/20 rounded-xl bg-background/50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-muted-foreground hover:text-primary">−</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-muted-foreground hover:text-primary">+</button>
              </div>
              <Button
                size="lg"
                className={`flex-1 box-glow transition-all ${added ? 'bg-green-600 hover:bg-green-600' : ''}`}
                disabled={!displayProduct.inStock}
                onClick={handleAddToCart}
              >
                {added ? '✓ Ajouté au panier!' : displayProduct.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
              </Button>
              <Button variant="outline" size="icon" className="w-14 shrink-0 border-white/20">
                <Heart className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Spec grid */}
          <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Garantie 1 an</p>
                <p className="text-muted-foreground text-xs">Défauts d'usine couverts</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Expédition 24H</p>
                <p className="text-muted-foreground text-xs">Emballage 100% discret</p>
              </div>
            </div>
            {displayProduct.material && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Matériau</p>
                  <p className="text-muted-foreground text-xs">{displayProduct.material}</p>
                </div>
              </div>
            )}
            {displayProduct.length && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Dimensions</p>
                  <p className="text-muted-foreground text-xs">{displayProduct.length}{displayProduct.diameter ? ` · ⌀${displayProduct.diameter}` : ''}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

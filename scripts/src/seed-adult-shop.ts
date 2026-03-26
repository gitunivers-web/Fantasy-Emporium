import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";

// ─── Image pools per category (4 images per product using crop variations) ───
const IMG = {
  vibrators: [
    "1608248543803-ba4f8c70ae0b",
    "1577538928305-3807c3993047",
    "1576091160399-112ba8d25d1d",
    "1560472354-b33ff0c44a43",
    "1511707171634-5f897ff02aa9",
    "1607082348824-0a96f2a4b9da",
    "1515886657613-9f3515b0c78f",
    "1614027164847-1ab45f7b74b3",
  ],
  dildos: [
    "1558618666-fcd25c85cd64",
    "1578662996442-48f60103fc96",
    "1571019613454-1cb2f99b2d8b",
    "1569982175971-d92b01cf8694",
    "1556742049-0cfed4f6a45d",
    "1567345144-af9e3d871e74",
    "1520637836862-4d197d17c45a",
  ],
  "sex-dolls": [
    "1573496359142-b8d87734a5a2",
    "1551836022-d5d88e9218df",
    "1596495578065-6e0763fa1178",
    "1515886657613-9f3515b0c78f",
    "1524504388040-681fcada1420",
    "1531123897727-d56e49d19b83",
    "1500648767791-00dcc994a43e",
  ],
  pills: [
    "1584308666744-24d5c474f2ae",
    "1587854692152-cbe660dbde88",
    "1576671081837-49000212a370",
    "1550572017-4fcdbb59cc32",
    "1563281577-a7be47e20db9",
    "1584820927498-cad076edc221",
    "1559757175-9ab1d5e1b3d8",
  ],
  bdsm: [
    "1611532736597-de2d4265fba3",
    "1552960562-daf630e9278b",
    "1606107557195-0e29a4b5b4aa",
    "1559818955-b5b9f92c2e94",
    "1514565131-ffa0fcab5a0e",
    "1502230408804-d7f8e8d4e3e2",
  ],
  lingerie: [
    "1595777457583-95e059d581b8",
    "1554568218-0f1715e72254",
    "1568252542512-9fe8fe9c87bb",
    "1559181567-c3190bbd40b4",
    "1517841905240-472988babdf9",
    "1507003211169-0a1dd7228f2d",
    "1487222477099-a33044f6fef3",
    "1490481651271-da2e42e3159f",
  ],
};

// ─── Video pool per category (ambient lifestyle videos) ──────────────────────
const VIDEOS = {
  vibrators: [
    "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/4499921/4499921-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/5201474/5201474-sd_640_360_30fps.mp4",
    "https://videos.pexels.com/video-files/7992956/7992956-sd_426_240_25fps.mp4",
  ],
  dildos: [
    "https://videos.pexels.com/video-files/3705516/3705516-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/6832822/6832822-sd_640_360_24fps.mp4",
    "https://videos.pexels.com/video-files/4125672/4125672-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/5947927/5947927-sd_640_360_30fps.mp4",
  ],
  "sex-dolls": [
    "https://videos.pexels.com/video-files/3769697/3769697-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/5779273/5779273-sd_640_360_30fps.mp4",
    "https://videos.pexels.com/video-files/3201762/3201762-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/6978971/6978971-sd_426_240_30fps.mp4",
  ],
  pills: [
    "https://videos.pexels.com/video-files/4170025/4170025-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/6550537/6550537-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/3046663/3046663-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/7675988/7675988-sd_640_360_30fps.mp4",
  ],
  bdsm: [
    "https://videos.pexels.com/video-files/4271779/4271779-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/3886046/3886046-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/5273793/5273793-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/6710571/6710571-sd_640_360_30fps.mp4",
  ],
  lingerie: [
    "https://videos.pexels.com/video-files/5878985/5878985-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/3706740/3706740-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/6002396/6002396-sd_640_360_25fps.mp4",
    "https://videos.pexels.com/video-files/4324124/4324124-sd_640_360_25fps.mp4",
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
let counter = 0;
function pick<T>(arr: T[], seed?: number): T {
  return arr[(seed ?? counter++) % arr.length];
}

function buildImages(catSlug: keyof typeof IMG, offset = 0): string[] {
  const pool = IMG[catSlug];
  const baseId = pool[(offset) % pool.length];
  const id2 = pool[(offset + 1) % pool.length];
  const id3 = pool[(offset + 2) % pool.length];
  const id4 = pool[(offset + 3) % pool.length];
  return [
    `https://images.unsplash.com/photo-${baseId}?w=800&q=80`,
    `https://images.unsplash.com/photo-${id2}?w=800&q=80&crop=entropy`,
    `https://images.unsplash.com/photo-${id3}?w=800&q=80&fit=crop&h=900`,
    `https://images.unsplash.com/photo-${id4}?w=800&q=80&crop=faces`,
  ];
}

function buildVideo(catSlug: string, offset = 0): string {
  const pool = VIDEOS[catSlug as keyof typeof VIDEOS] ?? VIDEOS.vibrators;
  return pool[offset % pool.length];
}

function rand(min: number, max: number, seed: number): number {
  return Math.round((min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min)) * 10) / 10;
}

type ProductRow = {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
  categorySlug: string;
  imageUrl: string;
  images: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  rating: string;
  reviewCount: number;
  brand: string;
  material: string | null;
  length: string | null;
  diameter: string | null;
  tags: string[];
  videoUrl: string;
};

const products: ProductRow[] = [];

// ════════════════════════════════════════════════════════════════════════════
// 1. VIBROMASSEURS — 75 produits
// ════════════════════════════════════════════════════════════════════════════
const vibratorBrands = ["LELO", "We-Vibe", "Satisfyer", "OhMyBod", "Jimmyjane", "Fun Factory", "Womanizer", "Lovense", "Dame", "Vibease", "Iroha", "Zalo", "Hot Octopuss", "Nomi Tang", "Romp"];
const vibratorColors = [
  ["Rose Pêche", "Violet Améthyste", "Noir Onyx", "Turquoise"],
  ["Rouge Cerise", "Blanc Nacré", "Or Rosé", "Violet"],
  ["Noir", "Rose Fuchsia", "Bleu Indigo", "Vert Émeraude"],
  ["Corail", "Argent", "Bordeaux", "Lilas"],
  ["Pêche", "Aubergine", "Bleu Ciel", "Gris Anthracite"],
];
const vibratorTypes = [
  { type: "Stimulateur Clitoridien par Succion", mat: "Silicone médical", len: "14 cm", dia: "4 cm", basePrice: 79.99, tag: "succion" },
  { type: "Vibromasseur Rabbit Double Stimulation", mat: "Silicone premium", len: "22 cm", dia: "3.8 cm", basePrice: 129.99, tag: "rabbit" },
  { type: "Vibromasseur Point G Courbe", mat: "Silicone médical", len: "18 cm", dia: "3.5 cm", basePrice: 99.99, tag: "point G" },
  { type: "Wand Massager Rechargeable", mat: "Silicone + ABS", len: "28 cm", dia: "5.5 cm", basePrice: 89.99, tag: "wand" },
  { type: "Mini Bullet Vibrant Discret", mat: "ABS & silicone", len: "8 cm", dia: "2 cm", basePrice: 29.99, tag: "bullet" },
  { type: "Vibromasseur Connecté App Bluetooth", mat: "Silicone platine", len: "16 cm", dia: "3.2 cm", basePrice: 149.99, tag: "app bluetooth" },
  { type: "Stimulateur Clitoridien Pulsations", mat: "Silicone médical", len: "12 cm", dia: "3.8 cm", basePrice: 119.99, tag: "pulsations" },
  { type: "Vibromasseur Anal Plug Vibrant", mat: "Silicone souple", len: "10 cm", dia: "3.2 cm", basePrice: 49.99, tag: "anal" },
  { type: "Vibromasseur Oeuf Interne Télécommandé", mat: "Silicone médical", len: "6 cm", dia: "3.5 cm", basePrice: 69.99, tag: "télécommandé" },
  { type: "Vibromasseur de Voyage Compact", mat: "Silicone flexible", len: "11 cm", dia: "2.5 cm", basePrice: 44.99, tag: "voyage" },
  { type: "Vibromasseur Luxe 24k Or", mat: "Silicone or platine", len: "20 cm", dia: "4 cm", basePrice: 249.99, tag: "luxe" },
  { type: "Vibromasseur Cam-Lock Harnais", mat: "Silicone médical", len: "17 cm", dia: "3.6 cm", basePrice: 109.99, tag: "harnais" },
  { type: "Vibromasseur Dual Motor", mat: "Silicone premium", len: "19 cm", dia: "3.9 cm", basePrice: 139.99, tag: "dual motor" },
  { type: "Stimulateur Lèvres & Clitoris Simultané", mat: "Silicone souple", len: "13 cm", dia: "4.2 cm", basePrice: 95.99, tag: "double" },
  { type: "Vibromasseur Squelette Articulé Flexible", mat: "Silicone platine", len: "21 cm", dia: "3.5 cm", basePrice: 159.99, tag: "flexible" },
];

vibratorTypes.forEach((vt, typeIdx) => {
  const numVariants = typeIdx < 13 ? 5 : 4;
  for (let v = 0; v < numVariants; v++) {
    const seed = typeIdx * 10 + v;
    const imgs = buildImages("vibrators", seed);
    const discount = Math.random() > 0.3;
    const origPrice = vt.basePrice + rand(-10, 20, seed);
    const pct = rand(15, 35, seed + 1);
    products.push({
      name: `${vibratorBrands[seed % vibratorBrands.length]} – ${vt.type} ${["Pro", "Elite", "Luxe", "Premium", "Signature"][v % 5]}`,
      description: `${vt.type} de haute qualité en ${vt.mat}. ${rand(6, 15, seed)} modes de vibration silencieux, 100% étanche (IPX7), rechargeable USB-C en ${rand(60, 120, seed + 5)} minutes. Autonomie ${rand(1, 4, seed + 7)}h. Idéal pour ${["débutants", "initiés", "connaisseurs", "aventuriers", "amateurs de sensations intenses"][v % 5]}. Livraison dans un emballage 100% discret sous 24-48H.`,
      price: origPrice.toFixed(2),
      discountPrice: discount ? (origPrice * (1 - pct / 100)).toFixed(2) : origPrice.toFixed(2),
      category: "Vibromasseurs",
      categorySlug: "vibrators",
      imageUrl: imgs[0],
      images: imgs,
      colors: vibratorColors[seed % vibratorColors.length],
      sizes: [],
      inStock: seed % 8 !== 0,
      featured: seed % 7 === 0,
      rating: rand(4.1, 5.0, seed).toFixed(1),
      reviewCount: Math.floor(rand(45, 2000, seed + 3)),
      brand: vibratorBrands[seed % vibratorBrands.length],
      material: vt.mat,
      length: vt.len,
      diameter: vt.dia,
      tags: [vt.tag, "vibromasseur", "rechargeable", "étanche", vibratorBrands[seed % vibratorBrands.length].toLowerCase()],
      videoUrl: buildVideo("vibrators", seed),
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 2. GODES & DILDOS — 65 produits
// ════════════════════════════════════════════════════════════════════════════
const dildoBrands = ["Doc Johnson", "Bad Dragon", "Icicles", "Fun Factory", "ns Novelties", "Pipedream", "Tantus", "Blush Novelties", "CalExotics", "Sportsheets", "VixSkin", "Topped Toys", "New York Toy Collective", "Oxballs"];
const dildo_skin_tones = [
  ["Chair Naturel", "Brun Caramel", "Chocolat", "Noir Ébène"],
  ["Beige Clair", "Méditerranéen", "Latino Doré", "Ébène Foncé"],
  ["Ivoire", "Noisette", "Café", "Acajou"],
  ["Transparent", "Rose Cristal", "Bleu Galaxie", "Violet Cosmic"],
  ["Noir Mat", "Rouge Feu", "Or Métal", "Argent"],
];
const dildo_types = [
  { type: "Gode Réaliste Veiné Grande Taille", mat: "PVC hypoallergénique", tag: "réaliste", prices: [39.99, 49.99, 59.99], lens: ["16 cm", "20 cm", "25 cm", "30 cm"], dias: ["4 cm", "5 cm", "6 cm", "7 cm"] },
  { type: "Gode en Verre Borosilicate Luxe", mat: "Verre borosilicate", tag: "verre luxe", prices: [54.99, 69.99, 84.99], lens: ["15 cm", "18 cm", "22 cm"], dias: ["3 cm", "3.5 cm", "4 cm"] },
  { type: "Gode Acier Inoxydable Weighty", mat: "Acier chirurgical 304", tag: "métal", prices: [69.99, 89.99, 109.99], lens: ["16 cm", "20 cm", "25 cm"], dias: ["3 cm", "4 cm", "5 cm"] },
  { type: "Gode Fantaisie Dragon XXL", mat: "Silicone platine", tag: "fantasy XXL", prices: [89.99, 119.99, 149.99], lens: ["18 cm", "24 cm", "30 cm", "38 cm"], dias: ["4.5 cm", "6 cm", "7.5 cm", "10 cm"] },
  { type: "Double Penetration Gode 45cm", mat: "Silicone premium", tag: "double", prices: [79.99, 99.99], lens: ["44 cm"], dias: ["3.5 cm"] },
  { type: "Gode avec Ventouse Compatible Harnais", mat: "PVC soft", tag: "ventouse harnais", prices: [34.99, 44.99, 54.99], lens: ["16 cm", "20 cm", "24 cm"], dias: ["4 cm", "5 cm", "6 cm"] },
  { type: "Gode Anal Plug Colonne Vertébrale", mat: "Silicone souple", tag: "anal colonne", prices: [29.99, 39.99, 49.99], lens: ["12 cm", "16 cm", "20 cm"], dias: ["2.5 cm", "3.5 cm", "4.5 cm"] },
  { type: "Gode Vibrant Multimode Point G", mat: "Silicone platine", tag: "vibrant G", prices: [59.99, 79.99, 99.99], lens: ["17 cm", "21 cm"], dias: ["3.5 cm", "4.5 cm"] },
  { type: "Gode Strap-On Harnais Femme-Femme", mat: "Silicone médical", tag: "strap-on", prices: [89.99, 119.99], lens: ["15 cm", "18 cm", "22 cm"], dias: ["3.5 cm", "4.5 cm"] },
  { type: "Gode Ultra-Réaliste Avec Testicules", mat: "CyberSkin", tag: "ultra-réaliste", prices: [44.99, 59.99, 74.99], lens: ["17 cm", "21 cm", "26 cm"], dias: ["4.5 cm", "5.5 cm", "7 cm"] },
  { type: "Gode Articulé Position Control", mat: "Silicone flexible", tag: "articulé", prices: [69.99, 89.99], lens: ["18 cm", "22 cm"], dias: ["3.8 cm", "4.8 cm"] },
  { type: "Gode Courbé Masseur Prostate Luxe", mat: "Silicone platine", tag: "prostate luxe", prices: [59.99, 79.99], lens: ["13 cm", "16 cm"], dias: ["3.2 cm", "4 cm"] },
  { type: "Gode Extenseur de Pénis Manchon", mat: "TPE souple", tag: "extenseur", prices: [24.99, 34.99, 44.99], lens: ["+3 cm", "+5 cm", "+7 cm"], dias: ["variable"] },
];

dildo_types.forEach((dt, typeIdx) => {
  const numVariants = typeIdx < 10 ? 5 : 4;
  for (let v = 0; v < numVariants; v++) {
    const seed = typeIdx * 5 + v + 200;
    const imgs = buildImages("dildos", seed);
    const sizeArr = dt.lens.slice(0, Math.min(dt.lens.length, 4));
    const diaArr = dt.dias.slice(0, Math.min(dt.dias.length, 4));
    const baseP = dt.prices[v % dt.prices.length];
    const discount = Math.random() > 0.25;
    const pct = rand(10, 30, seed + 1);
    products.push({
      name: `${dildoBrands[seed % dildoBrands.length]} – ${dt.type} ${sizeArr[v % sizeArr.length]}`,
      description: `${dt.type} de qualité supérieure en ${dt.mat}. Surface ${["lisse", "veinée", "texturée", "striée", "bosselée"][v % 5]} pour une stimulation maximale. Compatible avec tous lubrifiants à base d'eau. Facile à nettoyer et stérilisable. Livraison dans un emballage 100% discret en 24-48H. Satisfait ou remboursé sous 30 jours.`,
      price: baseP.toFixed(2),
      discountPrice: discount ? (baseP * (1 - pct / 100)).toFixed(2) : baseP.toFixed(2),
      category: "Godes & Dildos",
      categorySlug: "dildos",
      imageUrl: imgs[0],
      images: imgs,
      colors: dildo_skin_tones[seed % dildo_skin_tones.length],
      sizes: sizeArr,
      inStock: seed % 9 !== 0,
      featured: seed % 11 === 0,
      rating: rand(4.0, 5.0, seed).toFixed(1),
      reviewCount: Math.floor(rand(30, 1500, seed + 5)),
      brand: dildoBrands[seed % dildoBrands.length],
      material: dt.mat,
      length: sizeArr[0],
      diameter: diaArr[0],
      tags: [dt.tag, "gode", "dildo", dt.mat.toLowerCase().split(" ")[0]],
      videoUrl: buildVideo("dildos", seed),
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 3. POUPÉES SEXUELLES — 30 produits
// ════════════════════════════════════════════════════════════════════════════
const dollBrands = ["WM Dolls", "RealDoll", "SYDOLL", "6YE Premium", "JY Doll", "Zelex", "Irontech", "Doll4Ever", "Starpery", "Elsa Babe"];
const dollTypes = [
  { type: "Poupée TPE Corps Entier Femme Asiatique", genre: "Femme", mat: "TPE grade médical", prices: [1299.99, 1699.99, 2099.99], heights: ["148cm", "158cm", "163cm", "168cm"] },
  { type: "Poupée Silicone Platine Femme Européenne", genre: "Femme", mat: "Silicone platine", prices: [2499.99, 3299.99, 4199.99], heights: ["158cm", "165cm", "170cm"] },
  { type: "Poupée TPE Femme Afro-Américaine", genre: "Femme", mat: "TPE grade médical", prices: [1399.99, 1799.99, 2299.99], heights: ["148cm", "158cm", "165cm"] },
  { type: "Poupée TPE Femme Latino-Américaine", genre: "Femme", mat: "TPE grade médical", prices: [1199.99, 1599.99, 1999.99], heights: ["148cm", "155cm", "163cm"] },
  { type: "Torse Masculin Silicone avec Pénis Réaliste", genre: "Homme", mat: "Silicone platine", prices: [299.99, 399.99, 499.99], heights: ["Torse 45cm", "Torse 60cm"] },
  { type: "Poupée Masculine TPE Corps Entier", genre: "Homme", mat: "TPE grade médical", prices: [1499.99, 1899.99, 2399.99], heights: ["170cm", "178cm", "185cm"] },
  { type: "Demi-corps Féminin Torse+Fesses", genre: "Femme", mat: "TPE ultra-réaliste", prices: [399.99, 549.99, 699.99], heights: ["Demi-corps M", "Demi-corps L", "Demi-corps XL"] },
  { type: "Poupée Mini Compact Stockage Facile", genre: "Femme", mat: "TPE souple", prices: [699.99, 899.99], heights: ["100cm", "110cm", "125cm"] },
  { type: "Poupée Gonflable Premium Réaliste", genre: "Femme", mat: "Latex premium + TPE orifices", prices: [149.99, 199.99, 249.99], heights: ["Taille Standard"] },
  { type: "Poupée Torse Féminin Seins + Vagin", genre: "Femme", mat: "Silicone souple", prices: [199.99, 279.99, 359.99], heights: ["Taille S", "Taille M", "Taille L"] },
];
const dollTeints = [
  ["Teint Caucasien", "Teint Méditerranéen", "Teint Latino"],
  ["Teint Asiatique Claire", "Teint Naturel", "Teint Bronzé"],
  ["Teint Ébène Noir", "Teint Chocolat", "Teint Caramel"],
  ["Teint Roux Irlandaise", "Teint Scandinave", "Teint Méditerranéen"],
  ["Teint Caucasien", "Teint Brun", "Teint Mat", "Teint Ébène"],
];

dollTypes.forEach((dt, typeIdx) => {
  const numVariants = typeIdx < 5 ? 3 : 2;
  for (let v = 0; v < numVariants; v++) {
    const seed = typeIdx * 3 + v + 400;
    const imgs = buildImages("sex-dolls", seed);
    const baseP = dt.prices[v % dt.prices.length];
    const discount = true;
    const pct = rand(15, 25, seed);
    products.push({
      name: `${dollBrands[seed % dollBrands.length]} – ${dt.type} ${dt.heights[v % dt.heights.length]}`,
      description: `${dt.type} de ${dt.mat}, squelette métallique articulé pour postures infinies. ${["3 orifices fonctionnels (vaginal, anal, oral)", "2 orifices fonctionnels ultra-réalistes", "Orifices interchangeables inclus"][typeIdx % 3]}. Peau douce au toucher, texture ultra-réaliste. Livraison discrète en colis scellé sous 5-10 jours ouvrables. Personnalisation disponible (yeux, cheveux, silhouette).`,
      price: baseP.toFixed(2),
      discountPrice: (baseP * (1 - pct / 100)).toFixed(2),
      category: "Poupées Sexuelles",
      categorySlug: "sex-dolls",
      imageUrl: imgs[0],
      images: imgs,
      colors: dollTeints[seed % dollTeints.length],
      sizes: dt.heights,
      inStock: seed % 5 !== 0,
      featured: seed % 4 === 0,
      rating: rand(4.3, 5.0, seed).toFixed(1),
      reviewCount: Math.floor(rand(20, 400, seed + 2)),
      brand: dollBrands[seed % dollBrands.length],
      material: dt.mat,
      length: dt.heights[0],
      diameter: null,
      tags: ["poupée sexuelle", dt.genre.toLowerCase(), dt.mat.split(" ")[0].toLowerCase(), "réaliste", "discret"],
      videoUrl: buildVideo("sex-dolls", seed),
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 4. STIMULANTS & PILULES — 40 produits
// ════════════════════════════════════════════════════════════════════════════
const pillBrands = ["GenericPharma", "TestoMax", "HerBliss", "ClimaxControl", "ManForce", "Viasil", "VigRX", "ExtenZe", "NaturaMax", "BluChew", "Roman", "Hims", "PerformX", "LibidoBoost"];
const pillTypes = [
  { type: "Sildenafil 100mg (Équivalent Viagra)", dosages: ["25mg x12", "50mg x12", "100mg x12", "100mg x24", "100mg x48"], basePrice: 49.99 },
  { type: "Tadalafil 20mg (Équivalent Cialis Weekend)", dosages: ["10mg x10", "20mg x10", "20mg x20", "20mg x40"], basePrice: 59.99 },
  { type: "Vardenafil 20mg (Équivalent Levitra)", dosages: ["10mg x8", "20mg x8", "20mg x16"], basePrice: 64.99 },
  { type: "Booster Testostérone Naturel Tribulus", dosages: ["60 gélules", "90 gélules", "120 gélules"], basePrice: 34.99 },
  { type: "Maca Noire Péru Libido Premium", dosages: ["60 caps 500mg", "90 caps 500mg", "120 caps 1000mg"], basePrice: 29.99 },
  { type: "Aphrodisiaque Féminin Gouttes Naturelles", dosages: ["15ml", "30ml", "60ml"], basePrice: 39.99 },
  { type: "Spray Retardant Lidocaïne 10%", dosages: ["10ml", "20ml", "50ml"], basePrice: 24.99 },
  { type: "Crème Érectile Topique Max Strength", dosages: ["30ml tube", "50ml tube"], basePrice: 34.99 },
  { type: "Complexe Virilité Ginseng Rouge Coréen", dosages: ["30 gélules", "60 gélules", "120 gélules"], basePrice: 44.99 },
  { type: "Zinc + Magnésium + Vit D3 Performance", dosages: ["60 comprimés", "120 comprimés", "180 comprimés"], basePrice: 19.99 },
  { type: "Supplément CBD Huile Intime Relaxant", dosages: ["250mg 10ml", "500mg 15ml", "1000mg 30ml"], basePrice: 49.99 },
  { type: "Collagène Marin Vitalité & Libido Femme", dosages: ["30 sachets", "60 sachets", "90 sachets"], basePrice: 44.99 },
  { type: "Gélatine Royale Vitalité Sexuelle", dosages: ["10 ampoules", "20 ampoules", "40 ampoules"], basePrice: 29.99 },
];

pillTypes.forEach((pt, typeIdx) => {
  const numVariants = typeIdx < 5 ? 4 : 3;
  for (let v = 0; v < numVariants; v++) {
    const seed = typeIdx * 4 + v + 600;
    const imgs = buildImages("pills", seed);
    const dosage = pt.dosages[v % pt.dosages.length];
    const baseP = pt.basePrice + v * 8;
    const discount = Math.random() > 0.2;
    const pct = rand(15, 35, seed);
    products.push({
      name: `${pillBrands[seed % pillBrands.length]} – ${pt.type} ${dosage}`,
      description: `${pt.type} de qualité pharmaceutique. Dosage: ${dosage}. Résultats observés en ${rand(15, 45, seed)} minutes pour les médicaments, 2-4 semaines pour les suppléments naturels. Fabriqué dans un laboratoire certifié ISO. 100% discret sur votre relevé bancaire. Retours acceptés si produit non ouvert.`,
      price: baseP.toFixed(2),
      discountPrice: discount ? (baseP * (1 - pct / 100)).toFixed(2) : baseP.toFixed(2),
      category: "Stimulants & Pilules",
      categorySlug: "pills",
      imageUrl: imgs[0],
      images: imgs,
      colors: [],
      sizes: pt.dosages,
      inStock: seed % 6 !== 0,
      featured: seed % 9 === 0,
      rating: rand(4.0, 5.0, seed).toFixed(1),
      reviewCount: Math.floor(rand(50, 2500, seed + 1)),
      brand: pillBrands[seed % pillBrands.length],
      material: null,
      length: null,
      diameter: null,
      tags: ["stimulant", "performance", pt.type.split(" ")[0].toLowerCase(), "discret"],
      videoUrl: buildVideo("pills", seed),
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 5. BDSM & ACCESSOIRES — 55 produits
// ════════════════════════════════════════════════════════════════════════════
const bdsmBrands = ["Shibari", "Bound", "CuirArt", "Dungeon", "LoveHoney", "Sportsheets", "Cal Exotics", "Master Series", "XR Brands", "Fetish Fantasy", "Strict Leather", "Rouge Garments", "Liebe Seele", "KINK"];
const bdsmColors = [
  ["Noir", "Bordeaux", "Brun Cuir"],
  ["Noir Mat", "Rouge Feu", "Violet Royal"],
  ["Noir/Or", "Noir/Rose", "Noir/Rouge"],
  ["Cuir Naturel", "Noir Verni", "Bordeaux"],
  ["Noir", "Rose Fuchsia", "Blanc"],
];
const bdsmTypes = [
  { type: "Kit Débutant BDSM Complet 10 pièces", mat: "Velours + cuir vegan + corde", basePrice: 79.99, sizes: [] },
  { type: "Kit Intermédiaire 15 Accessoires Premium", mat: "Cuir véritable + métal", basePrice: 149.99, sizes: [] },
  { type: "Kit Expert Maître 20 Accessoires Luxe", mat: "Cuir pleine fleur + acier", basePrice: 249.99, sizes: [] },
  { type: "Menottes Velours avec Attaches Lit", mat: "Velours polyester", basePrice: 29.99, sizes: ["Taille Unique"] },
  { type: "Menottes Métal Fourrure Lapin Vegan", mat: "Acier inox + fausse fourrure", basePrice: 39.99, sizes: [] },
  { type: "Menottes Cuir Réglables avec Clé", mat: "Cuir pleine fleur", basePrice: 54.99, sizes: ["S/M", "M/L", "L/XL"] },
  { type: "Cravache Cuir Véritable Premium", mat: "Cuir pleine fleur", basePrice: 49.99, sizes: ["50cm", "65cm", "80cm"] },
  { type: "Fouet Queue-de-Cheval 18 Lanières", mat: "Cuir vegan suédé", basePrice: 44.99, sizes: ["Court 45cm", "Long 70cm"] },
  { type: "Palette Fessée Cuir Frappeur", mat: "Cuir bison double épaisseur", basePrice: 39.99, sizes: ["Petite", "Grande"] },
  { type: "Bandeau Yeux Luxe Satin Rembourrée", mat: "Satin + mémoire de forme", basePrice: 19.99, sizes: ["Taille Unique"] },
  { type: "Bâillon Boule Ajustable Silicone", mat: "Silicone food-grade + cuir", basePrice: 29.99, sizes: ["S - 4cm", "M - 5cm", "L - 6cm"] },
  { type: "Pinces Tétons Alligator Réglables", mat: "Acier plaqué", basePrice: 19.99, sizes: [] },
  { type: "Corde Shibari Coton Naturel 10m", mat: "Coton naturel tressé", basePrice: 24.99, sizes: ["6m", "10m", "15m", "20m"] },
  { type: "Collier BDSM Velours Anneau O", mat: "Velours + métal chromé", basePrice: 34.99, sizes: ["XS 28cm", "S 32cm", "M 36cm", "L 40cm"] },
  { type: "Cage de Chasteté Métal Premium", mat: "Acier inoxydable 316L", basePrice: 59.99, sizes: ["XS", "S", "M", "L"] },
  { type: "Spreader Bar Réglable avec Menottes", mat: "Acier chromé", basePrice: 49.99, sizes: ["40-70cm", "50-90cm"] },
  { type: "Système Restraint 4 Points Lit Queen", mat: "Nylon renforcé + velcro", basePrice: 39.99, sizes: ["Queen", "King"] },
  { type: "Vibromasseur Wand BDSM Torture Douce", mat: "Silicone + ABS", basePrice: 69.99, sizes: [] },
  { type: "Roue Wartenberg Métal Stimulation Sensorielle", mat: "Acier chirurgical", basePrice: 14.99, sizes: ["Roue Simple", "Double Roue"] },
];

bdsmTypes.forEach((bt, typeIdx) => {
  const numVariants = typeIdx < 8 ? 3 : 2;
  for (let v = 0; v < numVariants; v++) {
    const seed = typeIdx * 3 + v + 800;
    const imgs = buildImages("bdsm", seed);
    const baseP = bt.basePrice + v * 10;
    const discount = Math.random() > 0.35;
    const pct = rand(10, 25, seed);
    products.push({
      name: `${bdsmBrands[seed % bdsmBrands.length]} – ${bt.type} ${["Pro", "Premium", "Elite", "Signature", "Maître"][v % 5]}`,
      description: `${bt.type} en ${bt.mat}. Qualité professionnelle pour jeux de domination/soumission. Conception ergonomique pour confort prolongé. ${bt.sizes.length > 0 ? `Tailles disponibles: ${bt.sizes.join(", ")}.` : "Taille universelle."} Tous nos produits BDSM sont fabriqués avec des matériaux corporels sûrs et non toxiques. Manuel d'utilisation inclus.`,
      price: baseP.toFixed(2),
      discountPrice: discount ? (baseP * (1 - pct / 100)).toFixed(2) : baseP.toFixed(2),
      category: "BDSM & Accessoires",
      categorySlug: "bdsm",
      imageUrl: imgs[0],
      images: imgs,
      colors: bdsmColors[seed % bdsmColors.length],
      sizes: bt.sizes,
      inStock: seed % 7 !== 0,
      featured: seed % 10 === 0,
      rating: rand(4.1, 5.0, seed).toFixed(1),
      reviewCount: Math.floor(rand(25, 800, seed + 4)),
      brand: bdsmBrands[seed % bdsmBrands.length],
      material: bt.mat,
      length: null,
      diameter: null,
      tags: ["bdsm", "bondage", bt.type.split(" ")[0].toLowerCase(), "cuir"],
      videoUrl: buildVideo("bdsm", seed),
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 6. LINGERIE & COSTUMES — 65 produits
// ════════════════════════════════════════════════════════════════════════════
const lingerieBrands = ["LouisetteParis", "CorsetCouture", "RolPlay", "Esclave", "Élysée Intime", "La Perla", "Agent Provocateur", "Bordelle", "Maison Close", "Myla", "Fleur du Mal", "Pour Moi", "Curvy Kate", "PrettyLittleThing", "Ann Summers"];
const lingerieColors = [
  ["Noir", "Rouge", "Blanc Ivoire", "Bordeaux", "Nude"],
  ["Noir", "Bleu Marine", "Violet Royal", "Or Champagne"],
  ["Rouge Carmin", "Noir Mat", "Rose Dragée", "Emeraude"],
  ["Blanc", "Noir", "Rose Blush", "Lavande", "Menthe"],
  ["Noir Verni", "Rouge Vif", "Nude Beige", "Violet"],
];
const lingerieTypes = [
  { type: "Ensemble Dentelle Bustier + String + Jarretelles", mat: "Dentelle de Calais + lycra", basePrice: 64.99, sizes: ["XS (34)", "S (36)", "M (38)", "L (40)", "XL (42)", "XXL (44)", "XXXL (46)"] },
  { type: "Body Résille Transparent Ouvertures Stratégiques", mat: "Résille nylon + spandex", basePrice: 39.99, sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { type: "Corset Satin Baleines Acier Lacets Dos", mat: "Satin + baleines acier", basePrice: 79.99, sizes: ["XS (60cm)", "S (65cm)", "M (70cm)", "L (75cm)", "XL (80cm)", "XXL (85cm)"] },
  { type: "Babydoll Dentelle Transparente Nuisette", mat: "Dentelle + satin", basePrice: 34.99, sizes: ["XS-S", "M-L", "XL-XXL", "XXXL-4XL"] },
  { type: "Bas Résille Nylon Auto-Fixant + Gaine", mat: "Nylon 15 deniers", basePrice: 19.99, sizes: ["XS-S", "M-L", "XL-XXL"] },
  { type: "Tenue Infirmière Coquine Kit Complet", mat: "Polyester satiné", basePrice: 49.99, sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { type: "Costume Policière Séductrice Kit", mat: "PU cuir + polyester", basePrice: 54.99, sizes: ["XS", "S", "M", "L", "XL"] },
  { type: "Costume Écolière Coquine Jupe + Haut", mat: "Polyester", basePrice: 44.99, sizes: ["XS-S", "M-L", "XL-XXL"] },
  { type: "Costume Bunny Playboy Oreilles + Queue", mat: "Velours + satin", basePrice: 59.99, sizes: ["XS", "S", "M", "L", "XL"] },
  { type: "Déshabillé Satin Kimono Nageur", mat: "Satin japonais", basePrice: 29.99, sizes: ["Taille Unique", "Grande Taille"] },
  { type: "Teddybear All-in-One Dentelle Satin", mat: "Dentelle + microfibre", basePrice: 44.99, sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
  { type: "Gaine String Crotchless Trou Ouvert", mat: "Dentelle élasthanne", basePrice: 24.99, sizes: ["XS-S", "M-L", "XL-XXL", "XXXL-4XL"] },
  { type: "Lingerie Latex Caoutchouc Mini-Jupe", mat: "Latex 0.4mm", basePrice: 89.99, sizes: ["XS (34)", "S (36)", "M (38)", "L (40)", "XL (42)"] },
  { type: "Boxer Slip Homme Coquin Sexy Dentelle", mat: "Résille + coton", basePrice: 19.99, sizes: ["S (28-30\")", "M (30-32\")", "L (32-34\")", "XL (34-36\")", "XXL (36-38\")"] },
  { type: "Ensemble Grande Taille Courbes Séduisantes", mat: "Dentelle + jersey", basePrice: 54.99, sizes: ["1X (48)", "2X (50)", "3X (52)", "4X (54)", "5X (56)"] },
];

lingerieTypes.forEach((lt, typeIdx) => {
  const numVariants = typeIdx < 8 ? 5 : 3;
  for (let v = 0; v < numVariants; v++) {
    const seed = typeIdx * 5 + v + 1000;
    const imgs = buildImages("lingerie", seed);
    const baseP = lt.basePrice + v * 5;
    const discount = Math.random() > 0.3;
    const pct = rand(15, 35, seed);
    products.push({
      name: `${lingerieBrands[seed % lingerieBrands.length]} – ${lt.type} ${["Collection", "Édition Limitée", "Signature", "Prestige", "Nouvelle Saison"][v % 5]}`,
      description: `${lt.type} en ${lt.mat}. Coupe flatteuse pour toutes les morphologies, conception soignée pour une tenue parfaite toute la nuit. Lavage à 30°C recommandé. Disponible en plusieurs couleurs envoûtantes. Parfait pour surprendre votre partenaire ou vous sentir séduisant(e) au quotidien. Emballage cadeau disponible.`,
      price: baseP.toFixed(2),
      discountPrice: discount ? (baseP * (1 - pct / 100)).toFixed(2) : baseP.toFixed(2),
      category: "Lingerie & Costumes",
      categorySlug: "lingerie",
      imageUrl: imgs[0],
      images: imgs,
      colors: lingerieColors[seed % lingerieColors.length],
      sizes: lt.sizes,
      inStock: seed % 6 !== 0,
      featured: seed % 12 === 0,
      rating: rand(4.0, 5.0, seed).toFixed(1),
      reviewCount: Math.floor(rand(40, 1200, seed + 3)),
      brand: lingerieBrands[seed % lingerieBrands.length],
      material: lt.mat,
      length: null,
      diameter: null,
      tags: ["lingerie", "sexy", lt.type.split(" ")[0].toLowerCase(), lt.mat.split(" ")[0].toLowerCase()],
      videoUrl: buildVideo("lingerie", seed),
    });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ════════════════════════════════════════════════════════════════════════════
const categories = [
  { name: "Vibromasseurs", slug: "vibrators", description: "Vibromasseurs et stimulateurs de toutes formes pour tous les goûts — clitoridiens, rabbit, wand, bullet, app-connectés", imageUrl: `https://images.unsplash.com/photo-${IMG.vibrators[0]}?w=600&q=80` },
  { name: "Godes & Dildos", slug: "dildos", description: "Large sélection de godes réalistes, en verre, en métal ou fantasy — de toutes tailles et couleurs", imageUrl: `https://images.unsplash.com/photo-${IMG.dildos[0]}?w=600&q=80` },
  { name: "Poupées Sexuelles", slug: "sex-dolls", description: "Poupées sexuelles homme et femme en TPE ou silicone — toutes ethnies et corpulences", imageUrl: `https://images.unsplash.com/photo-${IMG["sex-dolls"][0]}?w=600&q=80` },
  { name: "Stimulants & Pilules", slug: "pills", description: "Viagra, Cialis, boosteurs de testostérone, aphrodisiaques féminins et suppléments naturels", imageUrl: `https://images.unsplash.com/photo-${IMG.pills[0]}?w=600&q=80` },
  { name: "BDSM & Accessoires", slug: "bdsm", description: "Menottes, fouets, cravaches, cordes shibari, cages et accessoires pour tous les fantasmes de domination", imageUrl: `https://images.unsplash.com/photo-${IMG.bdsm[0]}?w=600&q=80` },
  { name: "Lingerie & Costumes", slug: "lingerie", description: "Lingerie sexy, corsets, costumes coquins, babydolls et tenues de roleplay pour tous les corps", imageUrl: `https://images.unsplash.com/photo-${IMG.lingerie[0]}?w=600&q=80` },
];

// ════════════════════════════════════════════════════════════════════════════
// SEED
// ════════════════════════════════════════════════════════════════════════════
async function seed() {
  console.log(`Total products to seed: ${products.length}`);

  console.log("Clearing existing data...");
  await db.delete(productsTable);
  await db.delete(categoriesTable);

  console.log("Inserting categories...");
  await db.insert(categoriesTable).values(categories);
  console.log(`✓ ${categories.length} categories inserted`);

  console.log("Inserting products in batches...");
  const BATCH = 50;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    await db.insert(productsTable).values(batch as any);
    console.log(`  ✓ ${Math.min(i + BATCH, products.length)}/${products.length} products`);
  }

  console.log(`\n✅ Done! Seeded ${products.length} products across ${categories.length} categories.`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });

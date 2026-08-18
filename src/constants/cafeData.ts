export interface CoffeePillar {
  id: string;
  num: string;
  name: string;
  tagline: string;
  description: string;
  origin: string;
  altitude: string;
  process: string;
  roastProfile: string;
  tastingNotes: string[];
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: 'espresso' | 'filter' | 'cold' | 'food' | 'sweet';
  description: string;
  notes?: string;
  badge?: string;
  origin?: string;
  image?: string;
}

export interface RitualStep {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  metric: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  time: string;
  caption: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  image: string;
}

export const COFFEE_PILLARS: CoffeePillar[] = [
  {
    id: 'espresso',
    num: '01',
    name: 'Espresso',
    tagline: 'Deep, balanced, and quietly complex.',
    description: 'Extracted at 9 bars of pressure across 28 seconds. Our seasonal house blend delivers a syrupy mouthfeel with pronounced notes of dark cocoa nibs, blood orange, and a velvety lingering sweetness.',
    origin: 'Chikmagalur & Yirgacheffe',
    altitude: '1,450 – 1,900m',
    process: 'Washed / Anaerobic Natural',
    roastProfile: 'Medium-Light Omni',
    tastingNotes: ['Blood Orange', 'Dark Cacao', 'Wild Honey', 'Jasmine'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'pourover',
    num: '02',
    name: 'Pour Over',
    tagline: 'Clarity, floral elegance, and patience.',
    description: 'Brewed with surgical precision through Japanese ceramic V60 drippers. Every pour is timed to release delicate organic acids, showcasing the unadulterated terroir of single-estate microlots.',
    origin: 'Guji Highlands, Ethiopia',
    altitude: '2,100m',
    process: 'Natural Sun-Dried',
    roastProfile: 'Light Nordic',
    tastingNotes: ['Bergamot', 'White Peach', 'Earl Grey', 'Brown Sugar'],
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'coldbrew',
    num: '03',
    name: 'Slow Drip & Cold',
    tagline: '18 hours of gravity extraction.',
    description: 'Ice-water droplets pass through a double-mesh glass tower over eighteen slow hours. The result is an intensely smooth, naturally sweet, wine-like elixir with virtually zero astringency.',
    origin: 'Coorg, Western Ghats',
    altitude: '1,200m',
    process: 'Honey Processed',
    roastProfile: 'Medium Roast',
    tastingNotes: ['Bourbon Vanilla', 'Ripe Plum', 'Toasted Hazelnut', 'Cedar'],
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'seasonal',
    num: '04',
    name: 'Seasonal Curations',
    tagline: 'Experimental fermentations & botanicals.',
    description: 'Limited barrel-aged beans and botanically infused espresso tonics crafted with seasonal botanicals sourced from local organic cultivators along the Sabarmati riverfront.',
    origin: 'Araku Valley Microlot',
    altitude: '1,100m',
    process: 'Koji Fermentation',
    roastProfile: 'Light-Medium',
    tastingNotes: ['Cardamom Pods', 'Smoked Fig', 'Salted Caramel', 'Malt'],
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?q=80&w=1200&auto=format&fit=crop'
  }
];

export const RITUAL_STEPS: RitualStep[] = [
  {
    num: '01',
    title: 'GRIND',
    subtitle: 'Micron Precision',
    description: 'Beans weighed to the tenth of a gram, pulverized through 80mm flat ceramic burrs to achieve uniform particle distribution without friction heat.',
    detail: 'Target ratio: 1:16.2 brew geometry',
    metric: '650µm / 18.0g',
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?q=80&w=1000&auto=format&fit=crop'
  },
  {
    num: '02',
    title: 'POUR',
    subtitle: 'Controlled Pulse Bloom',
    description: 'Mineralized spring water at exactly 93.5°C poured in concentric circles. The initial 45-gram bloom releases trapped carbon dioxide with aromatic vitality.',
    detail: 'Concentric spiral from core to perimeter',
    metric: '93.5°C / 45g Bloom',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop'
  },
  {
    num: '03',
    title: 'WAIT',
    subtitle: 'The Gravity Chamber',
    description: 'There is no rushing physics. As liquid draws through the filter bed, density differences extract layered lipids, balanced acidity, and deep sweetness.',
    detail: 'Drawdown curve monitored visually',
    metric: '2m 45s Total Time',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1000&auto=format&fit=crop'
  },
  {
    num: '04',
    title: 'TASTE',
    subtitle: 'A Quiet Reveal',
    description: 'Served in unglazed ceramic vessels made by local potters. As the cup cools through 60°C to 45°C, hidden floral and stone fruit notes unfold progressively.',
    detail: 'Sip without haste; observe temperature shift',
    metric: '55°C Ideal Drinking Window',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1000&auto=format&fit=crop'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // ESPRESSO
  {
    id: 'e1',
    name: 'Espresso Solo / Doppio',
    price: '₹140',
    category: 'espresso',
    description: 'Pure double shot of seasonal single origin, dense crema with dark cacao and orange zest.',
    notes: 'Double Shot / 36g Yield',
    badge: 'Core',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'e2',
    name: 'Flat White',
    price: '₹190',
    category: 'espresso',
    description: 'Ristretto double shot folded through silky microfoam. Velvety, rich, and naturally sweet.',
    notes: 'Whole Milk or Oat / 160ml',
    badge: 'Guest Favorite',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'e3',
    name: 'Cortado',
    price: '₹170',
    category: 'espresso',
    description: 'Equal parts espresso and textured milk in a heavy fluted Gibraltar glass.',
    notes: '1:1 Ratio / 120ml',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'e4',
    name: 'Cappuccino Tradizionale',
    price: '₹180',
    category: 'espresso',
    description: 'Classic third-wave style with dense micro-cushion foam and raw brown sugar crust dusting.',
    notes: 'A2 Farm Milk / 180ml',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'e5',
    name: 'Smoked Vanilla Latte',
    price: '₹220',
    category: 'espresso',
    description: 'Espresso, house-made bourbon smoked vanilla bean syrup, steamed oat milk.',
    notes: 'House-infused Vanilla / 240ml',
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop'
  },

  // FILTER
  {
    id: 'f1',
    name: 'V60 Single Origin Pour Over',
    price: '₹280',
    category: 'filter',
    description: 'Ethiopia Guji or Chikmagalur Microlot, hand-poured through Hario V60. Clean and tea-like.',
    notes: 'Cup of Excellence Lot / 280ml',
    badge: 'Single Origin',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'f2',
    name: 'Aeropress Inverted Brew',
    price: '₹260',
    category: 'filter',
    description: 'Short immersion with high agitation for full body, low bitterness, and intense sweetness.',
    notes: 'Inverted Method / 220ml',
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'f3',
    name: 'Traditional South Indian Peaberry',
    price: '₹160',
    category: 'filter',
    description: 'Slow brass filter decoction, aerated with frothy hot farm milk. Comfort in a copper tumbler.',
    notes: '80:20 Chicory Blend / 150ml',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop'
  },

  // COLD
  {
    id: 'c1',
    name: '18-Hour Kyoto Cold Drip',
    price: '₹240',
    category: 'cold',
    description: 'Slow-dripped single origin served over a hand-carved crystal ice sphere.',
    notes: 'Low Acidity / 200ml',
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c2',
    name: 'Yuzu Tonic Espresso',
    price: '₹260',
    category: 'cold',
    description: 'Double espresso floated over Japanese yuzu cordial, artisanal botanical tonic, and rosemary smoke.',
    notes: 'Sparkling & Citrus / 250ml',
    badge: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c3',
    name: 'Cascara Sparkling Iced Tea',
    price: '₹210',
    category: 'cold',
    description: 'Brewed sun-dried coffee fruit husks, wild mountain honey, sparkling spring water.',
    notes: 'Zero Bitterness / 300ml',
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?q=80&w=600&auto=format&fit=crop'
  },

  // FOOD
  {
    id: 'fd1',
    name: 'Sourdough & Whipped Cultured Butter',
    price: '₹220',
    category: 'food',
    description: '36-hour fermented wild sourdough, house-churned smoked sea salt butter, black pepper thyme.',
    notes: 'Stoneground Khapli Wheat',
    badge: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'fd2',
    name: 'Avocado Tartine & Fermented Chili',
    price: '₹340',
    category: 'food',
    description: 'Crushed Hass avocado, house lacto-fermented chili oil, toasted sesame, baby sorrel on rye.',
    notes: 'Organic Produce',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'fd3',
    name: 'Heirloom Tomato & Stracciatella',
    price: '₹360',
    category: 'food',
    description: 'Roasted riverfront heirloom tomatoes, fresh pulled stracciatella, basil oil, warm focaccia.',
    notes: 'Woodfire Baked',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop'
  },

  // SWEET
  {
    id: 's1',
    name: 'Classic Butter Croissant',
    price: '₹180',
    category: 'sweet',
    description: 'Laminated with French Isigny butter across three days. Honeycomb crumb with crisp exterior.',
    notes: 'Baked Daily at 7:00 AM',
    badge: 'Fresh Daily',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's2',
    name: 'Single Origin Espresso Tiramisu',
    price: '₹260',
    category: 'sweet',
    description: 'Savoiardi soaked in our house espresso, aged marsala wine, whipped mascarpone, 70% dark shavings.',
    notes: 'Serves One generously',
    badge: 'House Special',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's3',
    name: 'Cardamom & Jaggery Canelé',
    price: '₹160',
    category: 'sweet',
    description: 'Caramelized beeswax crust encasing a custard center infused with green cardamom and desi jaggery.',
    notes: 'Limited 40 pieces/day',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'The Morning Counter',
    time: '07:15 AM',
    caption: 'Quiet calibration before the city wakes.',
    aspectRatio: 'landscape',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'g2',
    title: 'Window Seat Study',
    time: '08:42 AM',
    caption: 'Soft sunlight falling across lime-plastered walls.',
    aspectRatio: 'portrait',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'g3',
    title: 'First Bloom',
    time: '09:30 AM',
    caption: 'Water touching freshly ground Ethiopian beans.',
    aspectRatio: 'portrait',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'g4',
    title: 'Laminated Layers',
    time: '10:15 AM',
    caption: 'Crisp morning pastry fresh from the hearth.',
    aspectRatio: 'square',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'g5',
    title: 'Afternoon Light',
    time: '03:45 PM',
    caption: 'Long conversations, quiet reading, and slow cold drip.',
    aspectRatio: 'landscape',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'g6',
    title: 'Evening Embers',
    time: '08:10 PM',
    caption: 'Warm ambient lighting as night settles over Riverfront.',
    aspectRatio: 'portrait',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=900&auto=format&fit=crop'
  }
];

export const CAFE_INFO = {
  name: 'EMBER & BEAN',
  tagline: 'Coffee, slowly made.',
  established: 'EST. 2018 / AHMEDABAD',
  address: '21 Riverfront Road, Ahmedabad, Gujarat 380009',
  coordinates: '23.0225° N, 72.5714° E',
  phone: '+91 (079) 4921-8800',
  email: 'hello@emberandbean.in',
  instagram: '@emberandbeancoffee',
  hours: [
    { days: 'Monday – Friday', time: '07:00 – 22:00' },
    { days: 'Saturday – Sunday', time: '08:00 – 23:00' }
  ],
  features: [
    'Direct Trade Microlots',
    'In-House Sourdough Bakery',
    'Quiet Reading Corners',
    'Custom Mineralized Water Bar',
    'High-Speed Fiber for Creators'
  ]
};

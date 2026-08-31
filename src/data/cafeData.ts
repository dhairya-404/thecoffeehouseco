import type { GalleryItem } from '../types';

// Brand Information
export const BRAND_INFO = {
  name: 'THE COFFEE HOUSE CO.',
  location: '21 Riverfront Road, Sabarmati Riverfront Promenade, Ahmedabad, Gujarat 380001',
  phone: '+91 98765 43210',
  email: 'hello@thecoffeehouseco.com',
  coordinates: '23.0225° N, 72.5662° E',
  hours: {
    weekdays: '07:00 — 22:00',
    weekends: '08:00 — 23:00',
  },
};

// Hero Data
export const HERO_DATA = {
  meta: {
    location: 'AHMEDABAD / 23.0225° N',
    hours: '07:00 — 22:00',
    description: 'COFFEE / FOOD / CULTURE',
  },
  headline: {
    line1: 'COFFEE',
    line2: 'WORTH',
    line3: 'STAYING',
    line4: 'FOR.',
  },
  description: 'An independent specialty coffee house designed around the discipline of slow extraction, architectural stillness, and honest daily baking along the riverfront.',
  signatureCupCaption: 'FIG 01.0 — SIGNATURE STONEWARE CUP',
  signatureCupSubCaption: 'DOUBLE SHOT / 1:2 RATIO',
};

// Menu Categories
export const MENU_CATEGORIES = [
  {
    id: 'espresso',
    title: 'ESPRESSO',
    description: 'Precision-extracted shots with rich crema and complex flavor profiles.',
    items: [
      {
        name: 'Espresso',
        price: '₹140',
        description: 'Single-origin espresso with notes of dark chocolate and toasted almond.',
        image: '/images/menu/espresso.jpg',
      },
      {
        name: 'Piccolo',
        price: '₹180',
        description: 'Ristretto with a small amount of steamed milk for intensity with balance.',
        image: '/images/menu/piccolo.jpg',
      },
      {
        name: 'Flat White',
        price: '₹220',
        description: 'Double espresso with velvety microfoam milk.',
        image: '/images/menu/flatwhite.jpg',
      },
      {
        name: 'Cortado',
        price: '₹190',
        description: 'Equal parts espresso and warm milk, cutting the acidity.',
        image: '/images/menu/cortado.jpg',
      },
      {
        name: 'Cappuccino',
        price: '₹230',
        description: 'Espresso with steamed milk and thick milk foam.',
        image: '/images/menu/cappuccino.jpg',
      },
      {
        name: 'Mocha',
        price: '₹260',
        description: 'Espresso with steamed milk, chocolate sauce, and topped with foam.',
        image: '/images/menu/mocha.jpg',
      },
    ],
  },
  {
    id: 'brewed',
    title: 'BREWED',
    description: 'Artisanal extraction methods highlighting origin characteristics.',
    items: [
      {
        name: 'Pour Over',
        price: '₹280',
        description: 'Single-origin pour over using the V60 method.',
        image: '/images/menu/pourover.jpg',
      },
      {
        name: 'AeroPress',
        price: '₹260',
        description: 'Clean, bright extraction with low acidity.',
        image: '/images/menu/aeropress.jpg',
      },
      {
        name: 'Chemex',
        price: '₹300',
        description: 'Paper-filtered pour over with exceptional clarity.',
        image: '/images/menu/chemex.jpg',
      },
      {
        name: 'Flash Brew',
        price: '₹290',
        description: 'Cold brew concentrate diluted with ice for quick serving.',
        image: '/images/menu/flashbrew.jpg',
      },
      {
        name: 'Cold Brew',
        price: '₹280',
        description: '18-hour cold extraction with smooth, low-acid profile.',
        image: '/images/menu/coldbrew.jpg',
      },
      {
        name: 'Cascara',
        price: '₹240',
        description: 'Tea made from coffee cherry husks, notes of raspberry and hibiscus.',
        image: '/images/menu/cascara.jpg',
      },
    ],
  },
  {
    id: 'specialty',
    title: 'SPECIALTY',
    description: 'Custom creations and seasonal specialties.',
    items: [
      {
        name: 'Espresso Tonic',
        price: '₹250',
        description: 'Espresso poured over tonic water and ice for a refreshing twist.',
        image: '/images/menu/espressonic.jpg',
      },
      {
        name: 'Oat Cortado',
        price: '₹240',
        description: 'Cortado made with creamy plant-based oat milk.',
        image: '/images/menu/oatcortado.jpg',
      },
      {
        name: 'Mushroom Toast',
        price: '₹320',
        description: 'Sourdough toast with roasted mushrooms, herbs, and truffle oil.',
        image: '/images/menu/mushroomtoast.jpg',
      },
      {
        name: 'Avocado Toast',
        price: '₹300',
        description: 'Smashed avocado, chili flakes, and sesame seeds on sourdough.',
        image: '/images/menu/avocadotoast.jpg',
      },
      {
        name: 'Scrambled Eggs',
        price: '₹280',
        description: 'Slow-scrambled eggs with butter and chives.',
        image: '/images/menu/scrambledeggs.jpg',
      },
      {
        name: 'Croissant',
        price: '₹160',
        description: 'Classic butter croissant, freshly baked daily.',
        image: '/images/menu/croissant.jpg',
      },
    ],
  },
  {
    id: 'bakehouse',
    title: 'BAKEHOUSE',
    description: 'Artisanal pastries made in-house using traditional methods.',
    items: [
      {
        name: 'Tiramisu',
        price: '₹260',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers.',
        image: '/images/menu/tiramisu.jpg',
      },
      {
        name: 'Financier',
        price: '₹180',
        description: 'Almond cake with honey and brown butter, filled with berry compote.',
        image: '/images/menu/financier.jpg',
      },
      {
        name: 'Canelé',
        price: '₹170',
        description: 'Bordeaux specialty with caramelized sugar crust and vanilla center.',
        image: '/images/menu/canele.jpg',
      },
      {
        name: 'Tomato Tart',
        price: '₹290',
        description: 'Flaky pastry with roasted tomatoes, herbed ricotta, and basil oil.',
        image: '/images/menu/tomato.jpg',
      },
    ],
  },
];

// Coffee Features for Craft Section
export const COFFEE_FEATURES = [
  {
    id: 'single-estate',
    number: '01',
    name: 'Single Estate',
    tagline: 'Micro-lots from single farms, traceable to harvest',
    description: 'We work directly with estates across Chikmagalur and Biligirirangana Hills, roasting in 2kg batches to preserve terroir clarity.',
    origin: 'Chikmagalur, Karnataka',
    process: 'Washed',
    elevation: '1100 - 1350 masl',
    tastingNotes: ['Citrus', 'Jasmine', 'Honey', 'Red Apple'],
    image: '/images/coffee_espresso.jpg',
  },
  {
    id: 'extraction',
    number: '02',
    name: 'Precision Extraction',
    tagline: '93.5°C stabilized temperature, calibrated mineral profiles',
    description: 'Coffee is 98% water. We custom-mineralize reverse osmosis water with precise calcium and magnesium ratios for each origin.',
    origin: 'Custom blend',
    process: 'Calibrated',
    elevation: 'N/A',
    tastingNotes: ['Dark Chocolate', 'Caramel', 'Mild Acidity'],
    image: '/images/coffee_pourover.jpg',
  },
  {
    id: 'cold-brew',
    number: '03',
    name: 'Cold Extraction',
    tagline: '18-hour immersion for smooth, low-acid profile',
    description: 'Our cold brew concentrate is made with a 1:15 ratio, steeped for exactly 18 hours at 4°C.',
    origin: 'Ethiopia/Yunnan blend',
    process: 'Natural',
    elevation: '1600 - 1800 masl',
    tastingNotes: ['Berries', 'Chocolate', 'Mild', 'Smooth'],
    image: '/images/coffee_coldbrew.jpg',
  },
  {
    id: 'seasonal',
    number: '04',
    name: 'Seasonal',
    tagline: 'Rotating micro-lots reflecting current harvests',
    description: 'As harvests change, so does our selection. Each seasonal offering is roasted to highlight peak flavor.',
    origin: 'Rotating',
    process: 'Various',
    elevation: 'Varies',
    tastingNotes: ['Seasonal Varietal'],
    image: '/images/coffee_seasonal.jpg',
  },
];

// Ritual Steps
export const RITUAL_STEPS = [
  {
    number: '01',
    title: 'GRIND',
    subTitle: 'PRECISION MILLISECONDS',
    duration: '12 SECONDS',
    description: 'The extraction timeline begins the moment beans meet metal. We calibrate grinders to within 0.05mm particle consistency.',
    detail: 'Burr Spacing: 0.32mm',
    image: '/images/ritual_grind.jpg',
  },
  {
    number: '02',
    title: 'INFUSION',
    subTitle: 'TARGETED PRESSURE',
    duration: '28 SECONDS',
    description: 'Water at precisely 93.5°C meets grounds under 9 bars of pressure. Every variable accounted for.',
    detail: 'Pressure: 9 bars',
    image: '/images/ritual_wait.jpg',
  },
  {
    number: '03',
    title: 'EXTRACTION',
    subTitle: 'THE GOLDEN RULE',
    duration: '25 SECONDS',
    description: 'We follow the黄金法则: 1:2 ratio, 25-second window. Nothing more, nothing less.',
    detail: 'Ratio: 1:2',
    image: '/images/ritual_grind.jpg',
  },
  {
    number: '04',
    title: 'SERVE',
    subTitle: 'AT PEAK EXPRESSION',
    duration: '0 SECONDS',
    description: 'The extraction is poured immediately, capturing every volatile compound at its peak expression.',
    detail: 'Serving Temp: 55°C',
    image: '/images/ritual_wait.jpg',
  },
];

// Atmosphere Gallery
export const ATMOSPHERE_GALLERY: GalleryItem[] = [
  {
    id: 1,
    title: 'SABARMATI RIVER',
    location: 'RIVERFRONT CORNER',
    time: '07:00',
    aspect: 'landscape' as const,
    image: '/images/atmosphere_window.jpg',
  },
  {
    id: 2,
    title: 'LIME PLASTER WALLS',
    location: 'MAIN SPACE',
    time: '10:30',
    aspect: 'portrait' as const,
    image: '/images/atmosphere_atelier.jpg',
  },
  {
    id: 3,
    title: 'TEAKWOOD SURFACES',
    location: 'TABLES',
    time: '14:00',
    aspect: 'square' as const,
    image: '/images/atmosphere_pastries.jpg',
  },
  {
    id: 4,
    title: 'DRIP SYSTEM',
    location: 'BAR',
    time: '16:30',
    aspect: 'tall' as const,
    image: '/images/atmosphere_drip.jpg',
  },
  {
    id: 5,
    title: 'MOONLIGHT MODE',
    location: 'NIGHT',
    time: '21:00',
    aspect: 'landscape' as const,
    image: '/images/atmosphere_dusk.jpg',
  },
  {
    id: 6,
    title: 'ROASTING BAY',
    location: 'BACK HOUSE',
    time: '06:00',
    aspect: 'landscape' as const,
    image: '/images/story_roast.jpg',
  },
];

// Reservation Form Options
export const RESERVATION_OPTIONS = {
  times: [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30',
  ],
  guests: [1, 2, 3, 4, 5, 6, 7, 8],
};

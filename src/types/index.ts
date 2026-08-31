// Types
export type CoffeeFeature = {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  origin: string;
  process: string;
  elevation: string;
  tastingNotes: string[];
  image: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
};

export type MenuItem = {
  name: string;
  price: string;
  description: string;
  image: string;
};

export type RitualStep = {
  number: string;
  title: string;
  subTitle: string;
  duration: string;
  description: string;
  detail: string;
  image: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  location: string;
  time: string;
  aspect: 'landscape' | 'portrait' | 'square' | 'tall' | 'wide';
  image: string;
};

export type BrandInfo = {
  name: string;
  location: string;
  phone: string;
  email: string;
  coordinates: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
};

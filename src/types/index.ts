export type CursorVariant = 'default' | 'view' | 'open' | 'drag' | 'link' | 'hidden' | 'active' | string;

export interface CursorState {
  variant: CursorVariant;
  text?: string;
}

export interface CoffeeFeature {
  id: string;
  number: string;
  name: string;
  tagline: string;
  origin: string;
  process: string;
  elevation: string;
  tastingNotes: string[];
  description: string;
  image: string;
  accentColor?: string;
}

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  image?: string;
  tag?: string;
  notes?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
}

export interface RitualStep {
  number: string;
  title: string;
  subTitle: string;
  duration: string;
  description: string;
  detail: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  time: string;
  location: string;
  image: string;
  aspect: 'portrait' | 'landscape' | 'square' | 'tall';
}

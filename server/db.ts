import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface Reservation {
  id: string;
  code: string;
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  notes?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'noshow';
  tableNumber?: string;
  seatedAt?: string;
  vacatedAt?: string;
  durationMinutes?: number;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
  description: string;
  isAvailable: boolean;
  image?: string;
}

interface DatabaseSchema {
  reservations: Reservation[];
  subscribers: NewsletterSubscriber[];
  menuItems: MenuItem[];
}

const initialDb: DatabaseSchema = {
  reservations: [
    {
      id: 'res-1',
      code: 'CHC-8492',
      name: 'Dhairya Patel',
      phone: '+91 98765 43210',
      guests: '2 Guests (Tasting Counter)',
      date: '2026-08-20',
      time: '17:00 — Evening Roast',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'res-2',
      code: 'CHC-3108',
      name: 'Aanya Sharma',
      phone: '+91 98123 45678',
      guests: '4 Guests (Courtyard Table)',
      date: '2026-08-20',
      time: '11:30 — Midday Pour Over',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ],
  subscribers: [
    { id: 'sub-1', email: 'gather@thecoffeehouse.co', createdAt: new Date().toISOString() }
  ],
  menuItems: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure db file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
}

export const readDb = (): DatabaseSchema => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return initialDb;
  }
};

export const writeDb = (data: DatabaseSchema): void => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

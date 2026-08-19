import { Router, Request, Response } from 'express';
import { readDb, writeDb, MenuItem } from '../db.js';
import { MENU_CATEGORIES } from '../../src/data/cafeData.js';

export const menuRouter = Router();

// GET /api/menu - Get all menu items and categories
menuRouter.get('/', (_req: Request, res: Response) => {
  try {
    const db = readDb();
    // Return database menu items or default curated categories
    res.json({
      success: true,
      categories: MENU_CATEGORIES,
      customItems: db.menuItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch menu', error });
  }
});

// POST /api/menu - Add seasonal micro-lot item
menuRouter.post('/', (req: Request, res: Response) => {
  try {
    const { category, name, price, description, image } = req.body;
    if (!category || !name || !price) {
      return res.status(400).json({ success: false, message: 'Category, name, and price are required' });
    }

    const db = readDb();
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      category,
      name,
      price,
      description: description || '',
      isAvailable: true,
      image,
    };

    db.menuItems.push(newItem);
    writeDb(db);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add menu item', error });
  }
});

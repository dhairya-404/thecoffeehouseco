import { Router, Request, Response } from 'express';
import { readDb, writeDb, NewsletterSubscriber } from '../db.js';

export const newsletterRouter = Router();

// GET /api/newsletter - Get subscribers list (admin)
newsletterRouter.get('/', (_req: Request, res: Response) => {
  try {
    const db = readDb();
    res.json({ success: true, count: db.subscribers.length, data: db.subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers', error });
  }
});

// POST /api/newsletter - Subscribe an email
newsletterRouter.post('/', (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDb();

    // Check if already subscribed
    const existing = db.subscribers.find((s) => s.email === cleanEmail);
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed to the dispatch monographs.' });
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
    };

    db.subscribers.push(newSub);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Subscribed to The Coffee House Co. Monthly Dispatch successfully.',
      data: newSub,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to subscribe', error });
  }
});

// DELETE /api/newsletter/:id - Remove subscriber (admin)
newsletterRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const target = db.subscribers.find((s) => s.id === id || s.email === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    db.subscribers = db.subscribers.filter((s) => s.id !== id && s.email !== id);
    writeDb(db);

    res.json({
      success: true,
      message: `Subscriber ${target.email} removed successfully.`,
      id: target.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove subscriber', error });
  }
});


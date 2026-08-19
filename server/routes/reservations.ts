import { Router, Request, Response } from 'express';
import { readDb, writeDb, Reservation } from '../db.js';

export const reservationRouter = Router();

// GET /api/reservations - Fetch all bookings
reservationRouter.get('/', (_req: Request, res: Response) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      data: db.reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      total: db.reservations.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reservations', error });
  }
});

// POST /api/reservations - Create a new booking
reservationRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, phone, guests, date, time, notes } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields: name, phone, date, and time are mandatory.',
      });
    }

    const db = readDb();

    // Check capacity for the requested date (24 seats maximum per seating window)
    const existingBookingsOnDate = db.reservations.filter(
      (r) => r.date === date && r.time === time && r.status !== 'cancelled'
    );

    if (existingBookingsOnDate.length >= 8) {
      return res.status(409).json({
        success: false,
        message: 'Seating capacity full for this time slot (24 guests maximum). Please choose an alternative hour.',
      });
    }

    const randomCode = `CHC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: randomCode,
      name: name.trim(),
      phone: phone.trim(),
      guests: guests || '2 Guests (Tasting Counter)',
      date,
      time,
      notes: notes?.trim(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    db.reservations.push(newReservation);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully',
      data: newReservation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error while saving reservation', error });
  }
});

// PATCH /api/reservations/:id - Update booking status
reservationRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = readDb();
    const index = db.reservations.findIndex((r) => r.id === id || r.code === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (status) {
      db.reservations[index].status = status;
    }

    writeDb(db);
    res.json({ success: true, data: db.reservations[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reservation', error });
  }
});

// DELETE /api/reservations/:id - Cancel booking
reservationRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const initialLen = db.reservations.length;
    db.reservations = db.reservations.filter((r) => r.id !== id && r.code !== id);

    if (db.reservations.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    writeDb(db);
    res.json({ success: true, message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel reservation', error });
  }
});

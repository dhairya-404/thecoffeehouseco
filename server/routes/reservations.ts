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

const parseGuestCount = (guestsStr?: string): number => {
  if (!guestsStr) return 2;
  const match = guestsStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 2;
};

// POST /api/reservations - Create a new booking with validation & 30-person capacity limit
reservationRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, phone, guests, date, time, notes } = req.body;

    // 1. Mandatory field checks
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name.',
      });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || !/^[a-zA-Z\s.'-]{2,60}$/.test(trimmedName)) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters and contain only letters, spaces, or hyphens.',
      });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid mobile number.',
      });
    }

    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
    const digitsOnly = cleanedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid reservation date in YYYY-MM-DD format.',
      });
    }

    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Allow today's date
    const selectedDateMidnight = new Date(date + 'T00:00:00');
    if (selectedDateMidnight < today) {
      return res.status(400).json({
        success: false,
        message: 'Reservation date cannot be in the past. Please select today or a future date.',
      });
    }

    if (!time || typeof time !== 'string' || !time.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please select a seating time.',
      });
    }

    const guestCount = parseGuestCount(guests);
    if (guestCount < 1 || guestCount > 10) {
      return res.status(400).json({
        success: false,
        message: 'Guest count must be between 1 and 10.',
      });
    }

    const db = readDb();
    const MAX_CAPACITY = 30;

    // Check capacity for the requested date and time slot (30 guests maximum)
    const existingBookingsForSlot = db.reservations.filter(
      (r) => r.date === date && r.time === time && r.status !== 'cancelled'
    );

    const currentBookedSeats = existingBookingsForSlot.reduce(
      (sum, r) => sum + parseGuestCount(r.guests),
      0
    );

    if (currentBookedSeats + guestCount > MAX_CAPACITY) {
      const remainingSeats = Math.max(0, MAX_CAPACITY - currentBookedSeats);
      return res.status(409).json({
        success: false,
        message:
          remainingSeats > 0
            ? `Seating capacity reached for this time slot. Only ${remainingSeats} seat(s) remaining (out of 30 max capacity). Your request is for ${guestCount} guests. Please select a smaller party or an alternate time slot.`
            : `Capacity full for this time slot (30/30 seats booked). No further entries can be accepted. Please choose another seating time or date.`,
        remainingSeats,
        totalCapacity: MAX_CAPACITY,
      });
    }

    const randomCode = `CHC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: randomCode,
      name: trimmedName,
      phone: phone.trim(),
      guests: guests || '2 Guests (Tasting Counter)',
      date,
      time,
      notes: notes?.trim() || undefined,
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

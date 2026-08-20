import { Router, Request, Response } from 'express';
import { readDb, writeDb, Reservation } from '../db.js';

export const reservationRouter = Router();

const parseGuestCount = (guestsStr?: string): number => {
  if (!guestsStr) return 2;
  const match = guestsStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 2;
};

// GET /api/reservations - Fetch all bookings with live seating metrics
reservationRouter.get('/', (_req: Request, res: Response) => {
  try {
    const db = readDb();
    const sorted = [...db.reservations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const currentlySeated = db.reservations.filter((r) => r.status === 'seated');
    const liveOccupiedSeats = currentlySeated.reduce(
      (sum, r) => sum + parseGuestCount(r.guests),
      0
    );

    res.json({
      success: true,
      data: sorted,
      total: db.reservations.length,
      metrics: {
        totalCapacity: 30,
        liveOccupiedSeats,
        liveAvailableSeats: Math.max(0, 30 - liveOccupiedSeats),
        seatedPartiesCount: currentlySeated.length,
        confirmedCount: db.reservations.filter((r) => r.status === 'confirmed').length,
        completedCount: db.reservations.filter((r) => r.status === 'completed').length,
        cancelledCount: db.reservations.filter((r) => r.status === 'cancelled').length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reservations', error });
  }
});

// POST /api/reservations - Create a new booking with validation & 30-person capacity limit
reservationRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, phone, guests, date, time, notes, tableNumber, status } = req.body;

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

    const cleanedPhone = phone.replace(/[\s\-()]/g, '');
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

    // Check if date is in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

    // Only active bookings (confirmed or seated) occupy capacity for that time slot
    const existingBookingsForSlot = db.reservations.filter(
      (r) => r.date === date && r.time === time && (r.status === 'confirmed' || r.status === 'seated')
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
            ? `Seating capacity reached for this time slot. Only ${remainingSeats} seat(s) remaining (out of 30 max capacity). Your request is for ${guestCount} guests.`
            : `Capacity full for this time slot (30/30 seats booked). Please choose another seating time or date.`,
        remainingSeats,
        totalCapacity: MAX_CAPACITY,
      });
    }

    const randomCode = `CHC-${Math.floor(1000 + Math.random() * 9000)}`;
    const isDirectSeated = status === 'seated';
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: randomCode,
      name: trimmedName,
      phone: phone.trim(),
      guests: guests || '2 Guests (Tasting Counter)',
      date,
      time,
      notes: notes?.trim() || undefined,
      status: isDirectSeated ? 'seated' : 'confirmed',
      tableNumber: tableNumber || undefined,
      seatedAt: isDirectSeated ? new Date().toISOString() : undefined,
      durationMinutes: 60,
      createdAt: new Date().toISOString(),
    };

    db.reservations.push(newReservation);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: isDirectSeated ? 'Guest seated immediately' : 'Reservation confirmed successfully',
      data: newReservation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error while saving reservation', error });
  }
});

// POST /api/reservations/vacate-expired - Auto-vacate sessions exceeding allocated duration
reservationRouter.post('/vacate-expired', (_req: Request, res: Response) => {
  try {
    const db = readDb();
    const now = new Date().getTime();
    let vacatedCount = 0;
    const vacatedIds: string[] = [];

    db.reservations.forEach((r) => {
      if (r.status === 'seated' && r.seatedAt) {
        const seatedTime = new Date(r.seatedAt).getTime();
        const durationLimitMs = (r.durationMinutes || 60) * 60 * 1000;
        if (now - seatedTime >= durationLimitMs) {
          r.status = 'completed';
          r.vacatedAt = new Date().toISOString();
          vacatedCount++;
          vacatedIds.push(r.id);
        }
      }
    });

    if (vacatedCount > 0) {
      writeDb(db);
    }

    res.json({
      success: true,
      message: `Auto-vacated ${vacatedCount} expired session(s).`,
      vacatedCount,
      vacatedIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process auto-vacate', error });
  }
});

// POST /api/reservations/force-vacate-all - Clear all currently seated guests immediately
reservationRouter.post('/force-vacate-all', (_req: Request, res: Response) => {
  try {
    const db = readDb();
    let vacatedCount = 0;
    const nowIso = new Date().toISOString();

    db.reservations.forEach((r) => {
      if (r.status === 'seated') {
        r.status = 'completed';
        r.vacatedAt = nowIso;
        vacatedCount++;
      }
    });

    writeDb(db);

    res.json({
      success: true,
      message: `Forcefully cleared and vacated ${vacatedCount} party/parties. All 30 seats are now available.`,
      vacatedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to force vacate all', error });
  }
});

// POST /api/reservations/force-vacate/:id - Force clear a single reservation
reservationRouter.post('/force-vacate/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.reservations.findIndex((r) => r.id === id || r.code === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    db.reservations[index].status = 'completed';
    db.reservations[index].vacatedAt = new Date().toISOString();
    writeDb(db);

    res.json({
      success: true,
      message: `Guest ${db.reservations[index].name} has been vacated and table released.`,
      data: db.reservations[index],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to force vacate reservation', error });
  }
});

// PATCH & PUT /api/reservations/:id - Update lifecycle status, table assignment, or guest details
const updateReservationHandler = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      guests,
      date,
      time,
      notes,
      status,
      tableNumber,
      durationMinutes,
    } = req.body;

    const db = readDb();
    const index = db.reservations.findIndex((r) => r.id === id || r.code === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const current = db.reservations[index];

    // Update guest profile and booking details if supplied
    if (name !== undefined && typeof name === 'string' && name.trim()) {
      current.name = name.trim();
    }
    if (phone !== undefined && typeof phone === 'string' && phone.trim()) {
      current.phone = phone.trim();
    }
    if (guests !== undefined && typeof guests === 'string' && guests.trim()) {
      current.guests = guests.trim();
    }
    if (date !== undefined && typeof date === 'string' && date.trim()) {
      current.date = date.trim();
    }
    if (time !== undefined && typeof time === 'string' && time.trim()) {
      current.time = time.trim();
    }
    if (notes !== undefined) {
      current.notes = typeof notes === 'string' ? notes.trim() : notes;
    }
    if (tableNumber !== undefined) {
      current.tableNumber = typeof tableNumber === 'string' ? tableNumber.trim() || undefined : tableNumber;
    }
    if (durationMinutes !== undefined) {
      current.durationMinutes = Number(durationMinutes) || 60;
    }

    // Lifecycle status transition management
    if (status && status !== current.status) {
      current.status = status;
      if (status === 'seated') {
        if (!current.seatedAt) {
          current.seatedAt = new Date().toISOString();
        }
        current.vacatedAt = undefined;
      } else if (status === 'completed') {
        if (!current.vacatedAt) {
          current.vacatedAt = new Date().toISOString();
        }
      } else if (status === 'confirmed' || status === 'cancelled' || status === 'noshow') {
        // If moved away from seated/completed
        current.vacatedAt = undefined;
      }
    }

    writeDb(db);
    res.json({
      success: true,
      message: `Reservation for ${current.name} updated successfully.`,
      data: current,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reservation', error });
  }
};

reservationRouter.patch('/:id', updateReservationHandler);
reservationRouter.put('/:id', updateReservationHandler);

// DELETE /api/reservations/:id - Delete record
reservationRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const target = db.reservations.find((r) => r.id === id || r.code === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    db.reservations = db.reservations.filter((r) => r.id !== id && r.code !== id);
    writeDb(db);

    res.json({
      success: true,
      message: `Reservation for ${target.name} (${target.code}) deleted successfully.`,
      id: target.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete reservation', error });
  }
});



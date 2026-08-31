import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCursor } from '../context/CursorContext';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ReservationRecord {
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

interface SubscriberRecord {
  id: string;
  email: string;
  createdAt: string;
}

export interface CafeTable {
  id: string;
  name: string;
  zone: 'bar' | 'window' | 'solarium' | 'atelier';
  zoneLabel: string;
  seats: number;
}

export const CAFE_TABLES: CafeTable[] = [
  // Zone A: Riverfront Extraction & Tasting Counter (10 Bar Stools × 1 = 10 seats)
  { id: 'BAR-01', name: 'Bar Stool 01', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-02', name: 'Bar Stool 02', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-03', name: 'Bar Stool 03', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-04', name: 'Bar Stool 04', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-05', name: 'Bar Stool 05', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-06', name: 'Bar Stool 06', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-07', name: 'Bar Stool 07', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-08', name: 'Bar Stool 08', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-09', name: 'Bar Stool 09', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },
  { id: 'BAR-10', name: 'Bar Stool 10', zone: 'bar', zoneLabel: 'Extraction Counter', seats: 1 },

  // Zone B: Promenade Window Teak Tables (4 Tables × 2 = 8 seats)
  { id: 'T1', name: 'Window Table 1', zone: 'window', zoneLabel: 'Promenade Window', seats: 2 },
  { id: 'T2', name: 'Window Table 2', zone: 'window', zoneLabel: 'Promenade Window', seats: 2 },
  { id: 'T3', name: 'Window Table 3', zone: 'window', zoneLabel: 'Promenade Window', seats: 2 },
  { id: 'T4', name: 'Window Table 4', zone: 'window', zoneLabel: 'Promenade Window', seats: 2 },

  // Zone C: Courtyard Solarium Banquettes (2 Banquettes × 4 = 8 seats)
  { id: 'B1', name: 'Solarium Banquette 1', zone: 'solarium', zoneLabel: 'Courtyard Solarium', seats: 4 },
  { id: 'B2', name: 'Solarium Banquette 2', zone: 'solarium', zoneLabel: 'Courtyard Solarium', seats: 4 },

  // Zone D: Atelier Library Corner (1 Table × 4 = 4 seats)
  { id: 'A1', name: 'Atelier Library Table', zone: 'atelier', zoneLabel: 'Atelier Corner', seats: 4 },
];

const TIME_SLOTS = [
  '09:00 — Morning Calibration',
  '10:15 — Single Origin Tasting',
  '11:30 — Midday Pour Over',
  '14:00 — Afternoon Extraction',
  '15:30 — Rare Micro-Lot Service',
  '17:00 — Evening Roast',
  '18:30 — Twilight Extraction',
  '20:00 — Night Service',
];

const parseGuestNum = (guestsStr?: string): number => {
  if (!guestsStr) return 2;
  const match = guestsStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 2;
};

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'floor' | 'reservations' | 'subscribers'>('floor');
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);

  // Filtering & Sorting State
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subscriberSearch, setSubscriberSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'guests' | 'status' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [autoVacateEnabled, setAutoVacateEnabled] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Quick Walk-In Modal
  const [isWalkinOpen, setIsWalkinOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('+91 ');
  const [walkinGuests, setWalkinGuests] = useState('2 Guests (Tasting Counter)');
  const [walkinTable, setWalkinTable] = useState('BAR-01');
  const [walkinDuration, setWalkinDuration] = useState('60');
  const [walkinNotes, setWalkinNotes] = useState('');

  // New Scheduled Reservation Modal
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGuests, setNewGuests] = useState('2 Guests (Tasting Counter)');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState(TIME_SLOTS[0]);
  const [newNotes, setNewNotes] = useState('');
  const [newTable, setNewTable] = useState('');
  const [newStatus, setNewStatus] = useState<'confirmed' | 'seated'>('confirmed');

  // Edit Reservation Modal
  const [editingReservation, setEditingReservation] = useState<ReservationRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGuests, setEditGuests] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editTable, setEditTable] = useState('');
  const [editStatus, setEditStatus] = useState<'confirmed' | 'seated' | 'completed' | 'cancelled' | 'noshow'>('confirmed');
  const [editDuration, setEditDuration] = useState('60');

  // Manual Seating Assign Modal
  const [assigningReservation, setAssigningReservation] = useState<ReservationRecord | null>(null);
  const [selectedTableForAssign, setSelectedTableForAssign] = useState<string>('BAR-01');
  const [assignDuration, setAssignDuration] = useState<string>('60');

  // Subscriber Add Modal
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');

  // Current time ticker for live duration calculation
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const fetchRecords = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const [resRes, subRes] = await Promise.all([
        fetch('/api/reservations'),
        fetch('/api/newsletter'),
      ]);
      const resData = await resRes.json();
      const subData = await subRes.json();

      if (resData.success && Array.isArray(resData.data)) {
        setReservations(resData.data);
      }
      if (subData.success && Array.isArray(subData.data)) {
        setSubscribers(subData.data);
      }
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  // Fetch when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen, fetchRecords]);

  // Live polling: refresh data silently every 6 seconds while open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      fetchRecords(true);
    }, 6000);
    return () => clearInterval(interval);
  }, [isOpen, fetchRecords]);

  // Background Auto-Vacate sweep
  useEffect(() => {
    if (!isOpen || !autoVacateEnabled) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/reservations/vacate-expired', { method: 'POST' });
        const data = await res.json();
        if (data.success && data.vacatedCount > 0) {
          notify(`Auto-vacated ${data.vacatedCount} expired session(s).`);
          fetchRecords(true);
        }
      } catch (err) {
        console.warn('Auto-vacate sweep error:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, autoVacateEnabled, fetchRecords]);

  // Map of currently seated reservations by table ID
  const tableOccupancyMap = useMemo(() => {
    const map = new Map<string, ReservationRecord>();
    reservations.forEach((r) => {
      if (r.status === 'seated' && r.tableNumber) {
        const tableIds = r.tableNumber.split(',').map((s) => s.trim());
        tableIds.forEach((tid) => {
          map.set(tid, r);
          map.set(tid.replace('-', ''), r);
          if (tid.startsWith('T') && !tid.includes('-') && tid.length === 2) {
            map.set(`T-0${tid.slice(1)}`, r);
          }
          if (tid.startsWith('B') && !tid.includes('-') && tid.length === 2) {
            map.set(`B-0${tid.slice(1)}`, r);
          }
          if (tid.startsWith('A') && !tid.includes('-') && tid.length === 2) {
            map.set(`A-0${tid.slice(1)}`, r);
          }
        });
      }
    });
    return map;
  }, [reservations]);

  // Calculate live capacity strictly from active seated reservations
  const calculatedOccupiedSeats = useMemo(() => {
    return reservations
      .filter((r) => r.status === 'seated')
      .reduce((sum, r) => sum + parseGuestNum(r.guests), 0);
  }, [reservations]);

  const liveAvailableSeats = Math.max(0, 30 - calculatedOccupiedSeats);
  const occupancyPercentage = Math.min(100, Math.round((calculatedOccupiedSeats / 30) * 100));

  const confirmedWaiting = useMemo(() => {
    return reservations.filter((r) => r.status === 'confirmed');
  }, [reservations]);

  const completedToday = useMemo(() => {
    return reservations.filter((r) => r.status === 'completed');
  }, [reservations]);

  // Direct Status Update Handler
  const handleUpdateStatus = async (
    id: string,
    newStatus: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'noshow',
    tableNumber?: string,
    durationMinutes?: number
  ) => {
    try {
      const payload: Record<string, unknown> = { status: newStatus };
      if (tableNumber !== undefined) payload.tableNumber = tableNumber;
      if (durationMinutes !== undefined) payload.durationMinutes = durationMinutes;

      // Optimistic update
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus, ...(tableNumber ? { tableNumber } : {}) } : r))
      );

      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        if (newStatus === 'completed') {
          notify('Guest checked out & vacated. Table & seats freed.');
        } else if (newStatus === 'seated') {
          notify(`Guest seated successfully at ${tableNumber || 'counter'}.`);
        } else if (newStatus === 'cancelled') {
          notify('Reservation marked as cancelled.');
        } else if (newStatus === 'noshow') {
          notify('Reservation marked as No-Show.');
        } else if (newStatus === 'confirmed') {
          notify('Reservation reset to confirmed status.');
        }
        await fetchRecords(true);
      } else {
        notify(`Error: ${data.message || 'Failed to update status'}`);
        await fetchRecords(true);
      }
    } catch (err) {
      console.warn('Update status error:', err);
    }
  };

  // Open Edit Modal for a reservation
  const handleOpenEdit = (r: ReservationRecord) => {
    setEditingReservation(r);
    setEditName(r.name);
    setEditPhone(r.phone);
    setEditGuests(r.guests);
    setEditDate(r.date);
    setEditTime(r.time);
    setEditNotes(r.notes || '');
    setEditTable(r.tableNumber || '');
    setEditStatus(r.status);
    setEditDuration(String(r.durationMinutes || 60));
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;

    if (!editName.trim()) {
      alert('Please enter a valid guest name.');
      return;
    }

    try {
      const payload = {
        name: editName.trim(),
        phone: editPhone.trim(),
        guests: editGuests.trim(),
        date: editDate.trim(),
        time: editTime.trim(),
        notes: editNotes.trim() || undefined,
        tableNumber: editTable.trim() || undefined,
        durationMinutes: parseInt(editDuration, 10) || 60,
        status: editStatus,
      };

      // Optimistic update
      setReservations((prev) =>
        prev.map((r) => (r.id === editingReservation.id ? { ...r, ...payload } : r))
      );

      const res = await fetch(`/api/reservations/${editingReservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        notify(`Updated details for "${editName.trim()}" successfully.`);
        setEditingReservation(null);
        await fetchRecords(true);
      } else {
        alert(data.message || 'Failed to update reservation details.');
        await fetchRecords(true);
      }
    } catch (err) {
      console.warn('Failed to save reservation edits:', err);
      alert('Network error while updating reservation.');
    }
  };

  // Delete Reservation Record
  const handleDeleteReservation = async (id: string, name: string, code: string) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete the reservation for "${name}" (${code})?`)) {
      return;
    }

    try {
      // Optimistic delete
      setReservations((prev) => prev.filter((r) => r.id !== id));
      if (editingReservation?.id === id) {
        setEditingReservation(null);
      }

      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        notify(`Reservation for ${name} (${code}) deleted.`);
        await fetchRecords(true);
      } else {
        notify(`Error: ${data.message || 'Failed to delete record'}`);
        await fetchRecords(true);
      }
    } catch (err) {
      console.warn('Delete reservation error:', err);
    }
  };

  // Force Vacate Single Reservation
  const handleForceVacate = async (id: string, guestName: string) => {
    if (!window.confirm(`Force vacate and clear seats for "${guestName}" immediately?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/reservations/force-vacate/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        notify(`Forcefully vacated ${guestName}. Seats released.`);
        await fetchRecords(true);
      }
    } catch (err) {
      console.warn('Force vacate error:', err);
    }
  };

  // Force Vacate ALL Seated Customers
  const handleForceVacateAll = async () => {
    if (
      !window.confirm(
        'FORCE VACATE ALL: This will immediately clear ALL seated customers and free all 30 seats. Proceed?'
      )
    ) {
      return;
    }
    try {
      const res = await fetch('/api/reservations/force-vacate-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        notify(data.message || 'All seated tables cleared and vacated.');
        await fetchRecords(true);
      }
    } catch (err) {
      console.warn('Force vacate all error:', err);
    }
  };

  // Extend Seating Session Duration (+15m)
  const handleExtendDuration = async (r: ReservationRecord) => {
    const currentDur = r.durationMinutes || 60;
    const newDur = currentDur + 15;
    try {
      const res = await fetch(`/api/reservations/${r.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationMinutes: newDur }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Session for ${r.name} extended by +15m (Total: ${newDur} mins).`);
        await fetchRecords(true);
      }
    } catch (err) {
      console.warn('Extend error:', err);
    }
  };

  // Create Quick Walk-in
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: walkinName.trim(),
          phone: walkinPhone.trim() || '+91 00000 00000',
          guests: walkinGuests,
          date: todayStr,
          time: 'Walk-in Direct Service',
          notes: walkinNotes.trim() ? `[Walk-in] ${walkinNotes.trim()}` : `Walk-in seated at ${walkinTable}`,
          tableNumber: walkinTable,
          durationMinutes: parseInt(walkinDuration, 10) || 60,
          status: 'seated',
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Walk-in guest "${walkinName}" seated at ${walkinTable}.`);
        setIsWalkinOpen(false);
        setWalkinName('');
        setWalkinNotes('');
        await fetchRecords(true);
      } else {
        alert(data.message || 'Failed to seat walk-in.');
      }
    } catch (err) {
      console.warn('Walk-in error:', err);
    }
  };

  // Create Advance Scheduled Booking
  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Please enter guest name.');
      return;
    }
    if (!newPhone.trim()) {
      alert('Please enter phone number.');
      return;
    }

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          guests: newGuests,
          date: newDate,
          time: newTime,
          notes: newNotes.trim() || undefined,
          tableNumber: newTable.trim() || undefined,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`New booking confirmed for "${newName}" (${data.data?.code || 'CHC-NEW'}).`);
        setIsNewBookingOpen(false);
        setNewName('');
        setNewPhone('');
        setNewNotes('');
        setNewTable('');
        await fetchRecords(true);
      } else {
        alert(data.message || 'Failed to create reservation.');
      }
    } catch (err) {
      console.warn('New booking error:', err);
    }
  };

  // Confirm Manual Table Assignment
  const handleConfirmAssign = async () => {
    if (!assigningReservation) return;
    await handleUpdateStatus(
      assigningReservation.id,
      'seated',
      selectedTableForAssign,
      parseInt(assignDuration, 10) || 60
    );
    setAssigningReservation(null);
  };

  // Add Subscriber
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim() || !newSubEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newSubEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        notify(`Subscribed "${newSubEmail.trim()}" to dispatch list.`);
        setIsAddSubOpen(false);
        setNewSubEmail('');
        await fetchRecords(true);
      } else {
        alert(data.message || 'Failed to add subscriber.');
      }
    } catch (err) {
      console.warn('Add subscriber error:', err);
    }
  };

  // Delete Subscriber
  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!window.confirm(`Remove "${email}" from the dispatch subscriber list?`)) {
      return;
    }
    try {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      const res = await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        notify(`Removed subscriber ${email}.`);
        await fetchRecords(true);
      } else {
        notify(`Error: ${data.message || 'Failed to remove subscriber'}`);
        await fetchRecords(true);
      }
    } catch (err) {
      console.warn('Delete subscriber error:', err);
    }
  };

  // Export Subscribers to CSV
  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to export.');
      return;
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['#', 'Email', 'Subscribed Date'].join(',') +
      '\n' +
      subscribers
        .map((s, i) => `${i + 1},"${s.email}","${new Date(s.createdAt).toLocaleString()}"`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chc_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Reservations to CSV
  const handleExportReservationsCSV = () => {
    if (reservations.length === 0) {
      alert('No reservations to export.');
      return;
    }
    const headers = ['Code', 'Guest Name', 'Phone', 'Guests', 'Date', 'Time', 'Table', 'Status', 'Duration (mins)', 'Notes', 'Created At'];
    const rows = reservations.map((r) => [
      r.code,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.guests}"`,
      r.date,
      `"${r.time}"`,
      `"${r.tableNumber || 'Unassigned'}"`,
      r.status.toUpperCase(),
      r.durationMinutes || 60,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chc_reservations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sorting & Filtering for Reservations ledger
  const filteredAndSortedReservations = useMemo(() => {
    const filtered = reservations.filter((r) => {
      const matchesDate = filterDate ? r.date === filterDate : true;
      const matchesStatus = filterStatus === 'ALL' ? true : r.status === filterStatus.toLowerCase();
      const matchesSearch = searchQuery
        ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.phone.includes(searchQuery) ||
          r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.tableNumber && r.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return matchesDate && matchesStatus && matchesSearch;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'guests') {
        comparison = parseGuestNum(a.guests) - parseGuestNum(b.guests);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [reservations, filterDate, filterStatus, searchQuery, sortBy, sortOrder]);

  const filteredSubscribers = subscribers.filter((s) =>
    subscriberSearch ? s.email.toLowerCase().includes(subscriberSearch.toLowerCase()) : true
  );

  // Calculate elapsed & remaining minutes for a seated record
  const getSeatingTimer = (r: ReservationRecord) => {
    if (!r.seatedAt) return { elapsedMins: 0, remainingMins: 60, isOverstay: false, duration: 60 };
    const seatedTime = new Date(r.seatedAt).getTime();
    const elapsedMs = currentTime - seatedTime;
    const elapsedMins = Math.floor(elapsedMs / 60000);
    const duration = r.durationMinutes || 60;
    const remainingMins = duration - elapsedMins;
    const isOverstay = remainingMins <= 0;
    return { elapsedMins, remainingMins, isOverstay, duration };
  };

  const toggleSort = (field: 'date' | 'name' | 'guests' | 'status' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-portal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar */}
        <div className="admin-header-bar">
          <div className="admin-title-group">
            <span className="meta-text admin-badge font-mono">STAFF CONSOLE // LIVE OCCUPANCY ENGINE</span>
            <h2 className="heading-title admin-title">CAFÉ DISPATCH & FLOOR MANAGER</h2>
          </div>

          <div className="admin-header-actions">
            {actionNotice && <span className="action-toast font-mono">{actionNotice}</span>}
            <button
              type="button"
              className="btn-swiss btn-swiss-outline admin-header-btn font-mono"
              onClick={() => fetchRecords(false)}
              title="Refresh database records"
            >
              {isLoading ? 'SYNCING...' : '🔄 REFRESH'}
            </button>
            <button
              type="button"
              className="chc-modal-close font-mono"
              onClick={onClose}
              aria-label="Close admin portal"
              onMouseEnter={() => setCursor('open', 'CLOSE')}
              onMouseLeave={resetCursor}
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* Live Capacity & Key Metrics Strip */}
        <div className="admin-stats-strip">
          {/* 1. Live Capacity Dial */}
          <div className="admin-stat-card capacity-stat-card">
            <div className="stat-card-top">
              <span className="meta-text stat-label">LIVE CAPACITY OCCUPIED</span>
              <span className={`status-pill font-mono ${calculatedOccupiedSeats >= 30 ? 'pill-full' : 'pill-live'}`}>
                {calculatedOccupiedSeats >= 30 ? 'FULL CAPACITY' : 'SEATING ACTIVE'}
              </span>
            </div>
            <div className="stat-main-number font-display">
              <span className="num-large">{calculatedOccupiedSeats}</span>
              <span className="num-total font-mono">/ 30 SEATS</span>
            </div>
            <div className="capacity-bar-track">
              <div
                className={`capacity-bar-fill ${
                  occupancyPercentage >= 90 ? 'fill-red' : occupancyPercentage >= 50 ? 'fill-amber' : 'fill-green'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
            <div className="capacity-bar-meta meta-text font-mono">
              <span>{liveAvailableSeats} SEATS AVAILABLE</span>
              <span>{occupancyPercentage}% OCCUPIED</span>
            </div>
          </div>

          {/* 2. Seated Parties */}
          <div className="admin-stat-card">
            <span className="meta-text stat-label">CURRENTLY SEATED</span>
            <div className="stat-main-number font-display">
              <span className="num-large">{reservations.filter((r) => r.status === 'seated').length}</span>
              <span className="num-unit meta-text">PARTIES</span>
            </div>
            <span className="stat-sub-text font-mono">Active inside café rooms</span>
          </div>

          {/* 3. Awaiting Confirmed */}
          <div className="admin-stat-card">
            <span className="meta-text stat-label">AWAITING ARRIVAL</span>
            <div className="stat-main-number font-display">
              <span className="num-large">{confirmedWaiting.length}</span>
              <span className="num-unit meta-text">CONFIRMED</span>
            </div>
            <span className="stat-sub-text font-mono">Ready to be seated</span>
          </div>

          {/* 4. Completed Sessions */}
          <div className="admin-stat-card">
            <span className="meta-text stat-label">COMPLETED SESSIONS</span>
            <div className="stat-main-number font-display">
              <span className="num-large">{completedToday.length}</span>
              <span className="num-unit meta-text">VACATED</span>
            </div>
            <span className="stat-sub-text font-mono">Tables cleared & completed</span>
          </div>

          {/* 5. Quick Actions */}
          <div className="admin-stat-card quick-actions-card">
            <span className="meta-text stat-label">FLOOR CONTROLS</span>
            <div className="quick-actions-btns">
              <button
                type="button"
                className="btn-swiss btn-walkin font-mono"
                onClick={() => setIsWalkinOpen(true)}
              >
                + WALK-IN
              </button>
              <button
                type="button"
                className="btn-swiss btn-new-booking font-mono"
                onClick={() => setIsNewBookingOpen(true)}
              >
                + NEW BOOKING
              </button>
              <button
                type="button"
                className="btn-swiss btn-force-all font-mono"
                onClick={handleForceVacateAll}
                title="Immediately checkout and clear all currently seated parties"
              >
                ⚡ VACATE ALL
              </button>
            </div>
            <label className="auto-vacate-toggle font-mono meta-text" title="Automatically vacates guests once session duration expires">
              <input
                type="checkbox"
                checked={autoVacateEnabled}
                onChange={(e) => setAutoVacateEnabled(e.target.checked)}
              />
              <span>Auto-Vacate Expired Sessions</span>
            </label>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-nav-tab font-mono ${activeTab === 'floor' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('floor')}
          >
            01 // LIVE FLOOR MAP (30 SEATS)
          </button>
          <button
            type="button"
            className={`admin-nav-tab font-mono ${activeTab === 'reservations' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            02 // RESERVATIONS LEDGER ({reservations.length})
          </button>
          <button
            type="button"
            className={`admin-nav-tab font-mono ${activeTab === 'subscribers' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            03 // DISPATCH SUBSCRIBERS ({subscribers.length})
          </button>
        </div>

        {/* =========================================================================
            TAB 1: LIVE 30-SEAT FLOOR MAP
           ========================================================================= */}
        {activeTab === 'floor' && (
          <div className="admin-tab-pane floor-plan-pane">
            <div className="floor-plan-legend">
              <div className="legend-item">
                <span className="legend-dot dot-available"></span> Available / Vacant
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-seated"></span> Occupied (Active Session Timer)
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-overstay"></span> Overstay Session (Duration Exceeded)
              </div>
            </div>

            {/* Zone Sections Grid */}
            <div className="floor-zones-layout">
              {/* ZONE A: Riverfront Extraction & Tasting Counter (10 Seats) */}
              <div className="floor-zone-box">
                <div className="zone-header">
                  <div>
                    <span className="zone-title font-display">ZONE A: EXTRACTION TASTING COUNTER</span>
                    <span className="zone-sub-desc meta-text font-mono">Riverfront Brew Bar</span>
                  </div>
                  <span className="zone-meta font-mono meta-text">10 STOOLS • 1 SEAT EACH</span>
                </div>
                <div className="zone-tables-grid grid-counter">
                  {CAFE_TABLES.filter((t) => t.zone === 'bar').map((table) => {
                    const occupyingGuest = tableOccupancyMap.get(table.id);
                    const timer = occupyingGuest ? getSeatingTimer(occupyingGuest) : null;

                    return (
                      <div
                        key={table.id}
                        className={`table-seat-card ${
                          occupyingGuest
                            ? timer?.isOverstay
                              ? 'is-overstay'
                              : 'is-occupied'
                            : 'is-available'
                        }`}
                      >
                        <div className="seat-card-top">
                          <span className="table-code font-mono">{table.id}</span>
                          <span className="table-seats-badge font-mono">1 SEAT</span>
                        </div>

                        {occupyingGuest ? (
                          <div className="seat-occupied-content">
                            <span className="occupied-guest-name font-sans" title={occupyingGuest.name}>
                              {occupyingGuest.name}
                            </span>
                            <span className="occupied-code font-mono">{occupyingGuest.code}</span>

                            {timer && (
                              <div className={`session-timer-box font-mono ${timer.isOverstay ? 'timer-alert' : ''}`}>
                                <span>⏱ {timer.elapsedMins}m</span>
                                <span className="timer-remain">
                                  {timer.isOverstay
                                    ? `+${Math.abs(timer.remainingMins)}m OVER`
                                    : `${timer.remainingMins}m left`}
                                </span>
                              </div>
                            )}

                            <div className="seat-actions-row">
                              <button
                                type="button"
                                className="btn-table-action btn-edit-seat font-mono"
                                onClick={() => handleOpenEdit(occupyingGuest)}
                                title="Edit guest details & table"
                              >
                                EDIT
                              </button>
                              <button
                                type="button"
                                className="btn-table-action btn-vacate font-mono"
                                onClick={() => handleUpdateStatus(occupyingGuest.id, 'completed')}
                                title="Checkout guest and free stool"
                              >
                                VACATE
                              </button>
                              <button
                                type="button"
                                className="btn-table-action btn-extend font-mono"
                                onClick={() => handleExtendDuration(occupyingGuest)}
                                title="Extend duration by +15 mins"
                              >
                                +15m
                              </button>
                              <button
                                type="button"
                                className="btn-table-action btn-force font-mono"
                                onClick={() => handleForceVacate(occupyingGuest.id, occupyingGuest.name)}
                                title="Force clear stool immediately"
                              >
                                ⚡
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="seat-available-content">
                            <span className="available-text font-mono">VACANT</span>
                            <div className="seat-quick-actions">
                              {confirmedWaiting.length > 0 && (
                                <button
                                  type="button"
                                  className="btn-seat-quick btn-seat-waiting font-mono"
                                  onClick={() => {
                                    setAssigningReservation(confirmedWaiting[0]);
                                    setSelectedTableForAssign(table.id);
                                  }}
                                  title="Seat next waiting reservation"
                                >
                                  SEAT WAITING
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-seat-quick font-mono"
                                onClick={() => {
                                  setWalkinTable(table.id);
                                  setIsWalkinOpen(true);
                                }}
                              >
                                + WALK-IN
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ZONE B: Promenade Window Teak Tables (4 Tables × 2 = 8 Seats) */}
              <div className="floor-zone-box">
                <div className="zone-header">
                  <div>
                    <span className="zone-title font-display">ZONE B: PROMENADE WINDOW TEAK TABLES</span>
                    <span className="zone-sub-desc meta-text font-mono">Riverfront View Seating</span>
                  </div>
                  <span className="zone-meta font-mono meta-text">4 TABLES • 2 SEATS EACH (8 SEATS)</span>
                </div>
                <div className="zone-tables-grid grid-tables-2">
                  {CAFE_TABLES.filter((t) => t.zone === 'window').map((table) => {
                    const occupyingGuest = tableOccupancyMap.get(table.id);
                    const timer = occupyingGuest ? getSeatingTimer(occupyingGuest) : null;

                    return (
                      <div
                        key={table.id}
                        className={`table-seat-card ${
                          occupyingGuest
                            ? timer?.isOverstay
                              ? 'is-overstay'
                              : 'is-occupied'
                            : 'is-available'
                        }`}
                      >
                        <div className="seat-card-top">
                          <span className="table-code font-mono">{table.id} — {table.name}</span>
                          <span className="table-seats-badge font-mono">2 SEATS</span>
                        </div>

                        {occupyingGuest ? (
                          <div className="seat-occupied-content">
                            <span className="occupied-guest-name font-sans">{occupyingGuest.name}</span>
                            <span className="occupied-code font-mono">
                              {occupyingGuest.code} • {occupyingGuest.guests}
                            </span>

                            {timer && (
                              <div className={`session-timer-box font-mono ${timer.isOverstay ? 'timer-alert' : ''}`}>
                                <span>⏱ {timer.elapsedMins}m seated ({timer.duration}m limit)</span>
                                <span className="timer-remain">
                                  {timer.isOverstay
                                    ? `+${Math.abs(timer.remainingMins)}m OVERSTAY`
                                    : `${timer.remainingMins}m remaining`}
                                </span>
                              </div>
                            )}

                            <div className="seat-actions-row">
                              <button
                                type="button"
                                className="btn-table-action btn-edit-seat font-mono"
                                onClick={() => handleOpenEdit(occupyingGuest)}
                                title="Edit guest details & table"
                              >
                                EDIT
                              </button>
                              <button
                                type="button"
                                className="btn-table-action btn-vacate font-mono"
                                onClick={() => handleUpdateStatus(occupyingGuest.id, 'completed')}
                                title="Checkout guest and release table"
                              >
                                VACATE
                              </button>
                              <button
                                type="button"
                                className="btn-table-action btn-extend font-mono"
                                onClick={() => handleExtendDuration(occupyingGuest)}
                                title="Extend duration by +15 mins"
                              >
                                +15m
                              </button>
                              <button
                                type="button"
                                className="btn-table-action btn-force font-mono"
                                onClick={() => handleForceVacate(occupyingGuest.id, occupyingGuest.name)}
                                title="Force clear table immediately"
                              >
                                ⚡
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="seat-available-content">
                            <span className="available-text font-mono">AVAILABLE (2 SEATS)</span>
                            <div className="seat-quick-actions">
                              {confirmedWaiting.length > 0 && (
                                <button
                                  type="button"
                                  className="btn-seat-quick btn-seat-waiting font-mono"
                                  onClick={() => {
                                    setAssigningReservation(confirmedWaiting[0]);
                                    setSelectedTableForAssign(table.id);
                                  }}
                                >
                                  SEAT WAITING
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-seat-quick font-mono"
                                onClick={() => {
                                  setWalkinTable(table.id);
                                  setIsWalkinOpen(true);
                                }}
                              >
                                + WALK-IN
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ROW: ZONE C (Solarium Banquettes) + ZONE D (Atelier Corner) */}
              <div className="floor-double-zones">
                {/* ZONE C: Solarium Banquettes (8 Seats) */}
                <div className="floor-zone-box flex-1">
                  <div className="zone-header">
                    <div>
                      <span className="zone-title font-display">ZONE C: SOLARIUM BANQUETTES</span>
                      <span className="zone-sub-desc meta-text font-mono">Courtyard Lounge</span>
                    </div>
                    <span className="zone-meta font-mono meta-text">2 BANQUETTES • 4 SEATS EACH (8 SEATS)</span>
                  </div>
                  <div className="zone-tables-grid grid-tables-4">
                    {CAFE_TABLES.filter((t) => t.zone === 'solarium').map((table) => {
                      const occupyingGuest = tableOccupancyMap.get(table.id);
                      const timer = occupyingGuest ? getSeatingTimer(occupyingGuest) : null;

                      return (
                        <div
                          key={table.id}
                          className={`table-seat-card ${
                            occupyingGuest
                              ? timer?.isOverstay
                                ? 'is-overstay'
                                : 'is-occupied'
                              : 'is-available'
                          }`}
                        >
                          <div className="seat-card-top">
                            <span className="table-code font-mono">{table.id} — {table.name}</span>
                            <span className="table-seats-badge font-mono">4 SEATS</span>
                          </div>

                          {occupyingGuest ? (
                            <div className="seat-occupied-content">
                              <span className="occupied-guest-name font-sans">{occupyingGuest.name}</span>
                              <span className="occupied-code font-mono">
                                {occupyingGuest.code} • {occupyingGuest.guests}
                              </span>

                              {timer && (
                                <div className={`session-timer-box font-mono ${timer.isOverstay ? 'timer-alert' : ''}`}>
                                  <span>⏱ {timer.elapsedMins}m / {timer.duration}m</span>
                                  <span className="timer-remain">
                                    {timer.isOverstay
                                      ? `+${Math.abs(timer.remainingMins)}m OVER`
                                      : `${timer.remainingMins}m left`}
                                  </span>
                                </div>
                              )}

                              <div className="seat-actions-row">
                                <button
                                  type="button"
                                  className="btn-table-action btn-edit-seat font-mono"
                                  onClick={() => handleOpenEdit(occupyingGuest)}
                                >
                                  EDIT
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action btn-vacate font-mono"
                                  onClick={() => handleUpdateStatus(occupyingGuest.id, 'completed')}
                                >
                                  VACATE
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action btn-extend font-mono"
                                  onClick={() => handleExtendDuration(occupyingGuest)}
                                >
                                  +15m
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action btn-force font-mono"
                                  onClick={() => handleForceVacate(occupyingGuest.id, occupyingGuest.name)}
                                >
                                  ⚡
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="seat-available-content">
                              <span className="available-text font-mono">AVAILABLE (4 SEATS)</span>
                              <div className="seat-quick-actions">
                                {confirmedWaiting.length > 0 && (
                                  <button
                                    type="button"
                                    className="btn-seat-quick btn-seat-waiting font-mono"
                                    onClick={() => {
                                      setAssigningReservation(confirmedWaiting[0]);
                                      setSelectedTableForAssign(table.id);
                                    }}
                                  >
                                    SEAT WAITING
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn-seat-quick font-mono"
                                  onClick={() => {
                                    setWalkinTable(table.id);
                                    setIsWalkinOpen(true);
                                  }}
                                >
                                  + WALK-IN
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ZONE D: Atelier Library Corner (4 Seats) */}
                <div className="floor-zone-box flex-1">
                  <div className="zone-header">
                    <div>
                      <span className="zone-title font-display">ZONE D: ATELIER LIBRARY CORNER</span>
                      <span className="zone-sub-desc meta-text font-mono">Private Salon Corner</span>
                    </div>
                    <span className="zone-meta font-mono meta-text">1 PRIVATE TABLE • 4 SEATS</span>
                  </div>
                  <div className="zone-tables-grid grid-tables-4">
                    {CAFE_TABLES.filter((t) => t.zone === 'atelier').map((table) => {
                      const occupyingGuest = tableOccupancyMap.get(table.id);
                      const timer = occupyingGuest ? getSeatingTimer(occupyingGuest) : null;

                      return (
                        <div
                          key={table.id}
                          className={`table-seat-card ${
                            occupyingGuest
                              ? timer?.isOverstay
                                ? 'is-overstay'
                                : 'is-occupied'
                              : 'is-available'
                          }`}
                        >
                          <div className="seat-card-top">
                            <span className="table-code font-mono">{table.id} — {table.name}</span>
                            <span className="table-seats-badge font-mono">4 SEATS</span>
                          </div>

                          {occupyingGuest ? (
                            <div className="seat-occupied-content">
                              <span className="occupied-guest-name font-sans">{occupyingGuest.name}</span>
                              <span className="occupied-code font-mono">
                                {occupyingGuest.code} • {occupyingGuest.guests}
                              </span>

                              {timer && (
                                <div className={`session-timer-box font-mono ${timer.isOverstay ? 'timer-alert' : ''}`}>
                                  <span>⏱ {timer.elapsedMins}m / {timer.duration}m</span>
                                  <span className="timer-remain">
                                    {timer.isOverstay
                                      ? `+${Math.abs(timer.remainingMins)}m OVER`
                                      : `${timer.remainingMins}m left`}
                                  </span>
                                </div>
                              )}

                              <div className="seat-actions-row">
                                <button
                                  type="button"
                                  className="btn-table-action btn-edit-seat font-mono"
                                  onClick={() => handleOpenEdit(occupyingGuest)}
                                >
                                  EDIT
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action btn-vacate font-mono"
                                  onClick={() => handleUpdateStatus(occupyingGuest.id, 'completed')}
                                >
                                  VACATE
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action btn-extend font-mono"
                                  onClick={() => handleExtendDuration(occupyingGuest)}
                                >
                                  +15m
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action btn-force font-mono"
                                  onClick={() => handleForceVacate(occupyingGuest.id, occupyingGuest.name)}
                                >
                                  ⚡
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="seat-available-content">
                              <span className="available-text font-mono">AVAILABLE (4 SEATS)</span>
                              <div className="seat-quick-actions">
                                {confirmedWaiting.length > 0 && (
                                  <button
                                    type="button"
                                    className="btn-seat-quick btn-seat-waiting font-mono"
                                    onClick={() => {
                                      setAssigningReservation(confirmedWaiting[0]);
                                      setSelectedTableForAssign(table.id);
                                    }}
                                  >
                                    SEAT WAITING
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn-seat-quick font-mono"
                                  onClick={() => {
                                    setWalkinTable(table.id);
                                    setIsWalkinOpen(true);
                                  }}
                                >
                                  + WALK-IN
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: RESERVATIONS LEDGER
           ========================================================================= */}
        {activeTab === 'reservations' && (
          <div className="admin-tab-pane reservations-pane">
            {/* Filter controls toolbar */}
            <div className="admin-filter-toolbar">
              <div className="filter-group-left">
                <input
                  type="text"
                  placeholder="Search name, phone, code, table, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-filter-input font-sans"
                  style={{ minWidth: '240px' }}
                />

                <div className="status-filter-pills font-mono">
                  {['ALL', 'SEATED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NOSHOW'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`status-filter-btn ${filterStatus === st ? 'is-active' : ''}`}
                      onClick={() => setFilterStatus(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group-right">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="admin-filter-input font-sans"
                  title="Filter by reservation date"
                />
                {filterDate && (
                  <button
                    type="button"
                    className="btn-swiss btn-swiss-outline font-mono"
                    onClick={() => setFilterDate('')}
                  >
                    ALL DATES
                  </button>
                )}
                <button
                  type="button"
                  className="btn-swiss btn-new-booking font-mono"
                  onClick={() => setIsNewBookingOpen(true)}
                >
                  + NEW BOOKING
                </button>
                <button
                  type="button"
                  className="btn-swiss btn-walkin font-mono"
                  onClick={() => setIsWalkinOpen(true)}
                >
                  + WALK-IN
                </button>
                <button
                  type="button"
                  className="btn-swiss btn-swiss-outline font-mono"
                  onClick={handleExportReservationsCSV}
                  title="Download CSV export of reservations"
                >
                  ↓ CSV
                </button>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="admin-table-scroll">
              <table className="admin-data-table font-sans">
                <thead>
                  <tr className="meta-text font-mono">
                    <th onClick={() => toggleSort('createdAt')} style={{ cursor: 'pointer' }}>
                      CODE {sortBy === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                      GUEST & CONTACT {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => toggleSort('guests')} style={{ cursor: 'pointer' }}>
                      TABLE / SEATS {sortBy === 'guests' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => toggleSort('date')} style={{ cursor: 'pointer' }}>
                      SLOT & DATE {sortBy === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => toggleSort('status')} style={{ cursor: 'pointer' }}>
                      STATUS & SESSION {sortBy === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>ACTIONS & EDIT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedReservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-row font-mono meta-text">
                        No reservations found matching the current search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedReservations.map((r) => {
                      const timer = r.status === 'seated' ? getSeatingTimer(r) : null;

                      return (
                        <tr key={r.id} className={`row-status-${r.status}`}>
                          {/* Code */}
                          <td className="font-mono font-bold code-cell">
                            <span>{r.code}</span>
                          </td>

                          {/* Guest Name & Notes */}
                          <td>
                            <div className="guest-info-block">
                              <span className="guest-name">{r.name}</span>
                              <span className="guest-phone font-mono">{r.phone}</span>
                              {r.notes && <span className="guest-notes font-mono">“{r.notes}”</span>}
                            </div>
                          </td>

                          {/* Table & Guests */}
                          <td>
                            <div className="table-info-block">
                              <span className="guest-count-tag font-sans">{r.guests}</span>
                              {r.tableNumber ? (
                                <span className="assigned-table-tag font-mono">📍 {r.tableNumber}</span>
                              ) : (
                                <span className="unassigned-table-tag font-mono">Unassigned</span>
                              )}
                            </div>
                          </td>

                          {/* Slot & Date */}
                          <td>
                            <div className="slot-info-block font-mono">
                              <span className="slot-date">{r.date}</span>
                              <span className="slot-time meta-text">{r.time}</span>
                            </div>
                          </td>

                          {/* Status & Live Session Timer */}
                          <td>
                            <div className="status-cell-block">
                              <span className={`status-badge font-mono badge-${r.status}`}>
                                {r.status.toUpperCase()}
                              </span>
                              {r.status === 'seated' && timer && (
                                <span className={`live-timer-tag font-mono ${timer.isOverstay ? 'tag-overstay' : ''}`}>
                                  ⏱ {timer.elapsedMins}m / {timer.duration}m
                                  {timer.isOverstay ? ` (+${Math.abs(timer.remainingMins)}m OVER)` : ''}
                                </span>
                              )}
                              {r.status === 'completed' && r.vacatedAt && (
                                <span className="meta-text font-mono" style={{ fontSize: '0.6875rem' }}>
                                  Vacated: {new Date(r.vacatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions & Edit */}
                          <td>
                            <div className="row-action-buttons font-mono">
                              {/* Primary Edit Button for any row */}
                              <button
                                type="button"
                                className="btn-action btn-action-edit"
                                onClick={() => handleOpenEdit(r)}
                                title="Edit guest details, table, or status"
                              >
                                EDIT ✎
                              </button>

                              {r.status === 'confirmed' && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-action btn-action-seat"
                                    onClick={() => {
                                      setAssigningReservation(r);
                                      setSelectedTableForAssign('BAR-01');
                                    }}
                                  >
                                    SEAT →
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-action btn-action-noshow"
                                    onClick={() => handleUpdateStatus(r.id, 'noshow')}
                                  >
                                    NO-SHOW
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-action btn-action-cancel"
                                    onClick={() => handleUpdateStatus(r.id, 'cancelled')}
                                  >
                                    CANCEL
                                  </button>
                                </>
                              )}

                              {r.status === 'seated' && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-action btn-action-vacate"
                                    onClick={() => handleUpdateStatus(r.id, 'completed')}
                                    title="Checkout guest and free table"
                                  >
                                    VACATE & BILL
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-action btn-action-extend"
                                    onClick={() => handleExtendDuration(r)}
                                    title="Extend session by 15 mins"
                                  >
                                    +15m
                                  </button>
                                </>
                              )}

                              {(r.status === 'completed' || r.status === 'cancelled' || r.status === 'noshow') && (
                                <button
                                  type="button"
                                  className="btn-action btn-action-reopen"
                                  onClick={() => {
                                    setAssigningReservation(r);
                                    setSelectedTableForAssign('BAR-01');
                                  }}
                                >
                                  RE-SEAT
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-action btn-action-delete"
                                onClick={() => handleDeleteReservation(r.id, r.name, r.code)}
                                title="Delete this reservation permanently"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: DISPATCH SUBSCRIBERS
           ========================================================================= */}
        {activeTab === 'subscribers' && (
          <div className="admin-tab-pane subscribers-pane">
            <div className="subscribers-toolbar">
              <div className="subscribers-left">
                <span className="meta-text font-mono">
                  TOTAL NEWSLETTER SUBSCRIBERS: {subscribers.length}
                </span>
                <input
                  type="text"
                  placeholder="Search subscriber email..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="admin-filter-input font-sans"
                  style={{ width: '260px' }}
                />
              </div>
              <div className="subscribers-right">
                <button
                  type="button"
                  className="btn-swiss btn-walkin font-mono"
                  onClick={() => setIsAddSubOpen(true)}
                >
                  + ADD SUBSCRIBER
                </button>
                <button
                  type="button"
                  className="btn-swiss btn-swiss-outline font-mono"
                  onClick={handleExportCSV}
                >
                  ↓ EXPORT CSV
                </button>
              </div>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-data-table font-sans">
                <thead>
                  <tr className="meta-text font-mono">
                    <th>#</th>
                    <th>SUBSCRIBER EMAIL</th>
                    <th>SUBSCRIPTION TIMESTAMP</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty-row font-mono meta-text">
                        No subscribers found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub, idx) => (
                      <tr key={sub.id}>
                        <td className="font-mono">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="font-mono font-semibold">{sub.email}</td>
                        <td className="font-mono meta-text">{new Date(sub.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-action btn-action-delete font-mono"
                            onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                            title="Remove subscriber"
                          >
                            REMOVE ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: EDIT RESERVATION & GUEST DETAILS
           ========================================================================= */}
        {editingReservation && (
          <div className="submodal-backdrop" onClick={() => setEditingReservation(null)}>
            <div className="submodal-card edit-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <div>
                  <span className="meta-text font-mono" style={{ color: 'var(--accent-terracotta)', fontSize: '0.6875rem' }}>
                    BOOKING CODE: {editingReservation.code}
                  </span>
                  <h3 className="heading-title submodal-title">EDIT GUEST & RESERVATION DETAILS</h3>
                </div>
                <button
                  type="button"
                  className="chc-modal-close font-mono"
                  onClick={() => setEditingReservation(null)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="submodal-form">
                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">GUEST FULL NAME *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="submodal-input font-sans"
                    />
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">PHONE NUMBER *</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="submodal-input font-mono"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">PARTY SIZE / GUEST TIER</label>
                    <select
                      value={editGuests}
                      onChange={(e) => setEditGuests(e.target.value)}
                      className="submodal-input font-sans"
                    >
                      <option value="1 Guest (Tasting Counter)">1 Guest (Tasting Counter)</option>
                      <option value="2 Guests (Tasting Counter)">2 Guests (Tasting Counter)</option>
                      <option value="2 Guests (Promenade Window)">2 Guests (Promenade Window)</option>
                      <option value="3 Guests (Courtyard Lounge)">3 Guests (Courtyard Lounge)</option>
                      <option value="4 Guests (Solarium Courtyard)">4 Guests (Solarium Courtyard)</option>
                      <option value="4 Guests (Atelier Library Table)">4 Guests (Atelier Library Table)</option>
                      <option value="6 Guests (Private Atelier Booking)">6 Guests (Private Atelier Booking)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">ASSIGNED TABLE / SEAT</label>
                    <select
                      value={editTable}
                      onChange={(e) => setEditTable(e.target.value)}
                      className="submodal-input font-mono"
                    >
                      <option value="">-- No Specific Table (Unassigned) --</option>
                      {CAFE_TABLES.map((t) => {
                        const isOccupiedByOther =
                          tableOccupancyMap.has(t.id) &&
                          tableOccupancyMap.get(t.id)?.id !== editingReservation.id;
                        return (
                          <option key={t.id} value={t.id}>
                            {t.id} — {t.name} ({t.seats}s) {isOccupiedByOther ? '[OCCUPIED BY OTHER]' : '[VACANT]'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">RESERVATION DATE</label>
                    <input
                      type="date"
                      required
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="submodal-input font-sans"
                    />
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">TIME SLOT</label>
                    <select
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="submodal-input font-sans"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                      {!TIME_SLOTS.includes(editTime) && editTime && (
                        <option value={editTime}>{editTime}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">LIFECYCLE STATUS</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ReservationRecord['status'])}
                      className="submodal-input font-mono"
                      style={{ fontWeight: 700 }}
                    >
                      <option value="confirmed">CONFIRMED (Awaiting Arrival)</option>
                      <option value="seated">SEATED (Active Seating Session)</option>
                      <option value="completed">COMPLETED (Vacated / Billed)</option>
                      <option value="cancelled">CANCELLED</option>
                      <option value="noshow">NO-SHOW</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">SESSION DURATION (MINUTES)</label>
                    <select
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="submodal-input font-sans"
                    >
                      <option value="30">30 Minutes (Express Espresso)</option>
                      <option value="45">45 Minutes (Quick Brew)</option>
                      <option value="60">60 Minutes (Standard Tasting)</option>
                      <option value="90">90 Minutes (Courtyard Banquette)</option>
                      <option value="120">120 Minutes (Extended Atelier)</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="meta-text font-mono">SPECIAL REQUESTS / SOMMELIER NOTES</label>
                  <textarea
                    rows={2}
                    placeholder="Dietary requests, origin preferences, seating notes..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="submodal-input font-sans"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="submodal-footer" style={{ justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn-swiss btn-delete-danger font-mono"
                    onClick={() =>
                      handleDeleteReservation(editingReservation.id, editingReservation.name, editingReservation.code)
                    }
                  >
                    🗑 DELETE RECORD
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn-swiss btn-swiss-outline font-mono"
                      onClick={() => setEditingReservation(null)}
                    >
                      CANCEL
                    </button>
                    <button type="submit" className="btn-swiss btn-walkin font-mono">
                      SAVE CHANGES ✓
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: CREATE NEW ADVANCE BOOKING
           ========================================================================= */}
        {isNewBookingOpen && (
          <div className="submodal-backdrop" onClick={() => setIsNewBookingOpen(false)}>
            <div className="submodal-card edit-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <div>
                  <span className="meta-text font-mono" style={{ color: 'var(--accent-terracotta)', fontSize: '0.6875rem' }}>
                    ADMIN CREATE RESERVATION
                  </span>
                  <h3 className="heading-title submodal-title">SCHEDULE NEW RESERVATION</h3>
                </div>
                <button
                  type="button"
                  className="chc-modal-close font-mono"
                  onClick={() => setIsNewBookingOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNewBooking} className="submodal-form">
                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">GUEST FULL NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Seth"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="submodal-input font-sans"
                      autoFocus
                    />
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">PHONE NUMBER *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="submodal-input font-mono"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">PARTY SIZE / EXPERIENCE</label>
                    <select
                      value={newGuests}
                      onChange={(e) => setNewGuests(e.target.value)}
                      className="submodal-input font-sans"
                    >
                      <option value="1 Guest (Tasting Counter)">1 Guest (Tasting Counter)</option>
                      <option value="2 Guests (Tasting Counter)">2 Guests (Tasting Counter)</option>
                      <option value="2 Guests (Promenade Window)">2 Guests (Promenade Window)</option>
                      <option value="3 Guests (Courtyard Lounge)">3 Guests (Courtyard Lounge)</option>
                      <option value="4 Guests (Solarium Courtyard)">4 Guests (Solarium Courtyard)</option>
                      <option value="4 Guests (Atelier Library Table)">4 Guests (Atelier Library Table)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">TABLE ASSIGNMENT (OPTIONAL)</label>
                    <select
                      value={newTable}
                      onChange={(e) => setNewTable(e.target.value)}
                      className="submodal-input font-mono"
                    >
                      <option value="">Auto / Assign Upon Arrival</option>
                      {CAFE_TABLES.map((t) => {
                        const isOccupied = tableOccupancyMap.has(t.id);
                        return (
                          <option key={t.id} value={t.id}>
                            {t.id} — {t.name} ({t.seats}s) {isOccupied ? '[OCCUPIED]' : '[VACANT]'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">RESERVATION DATE</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="submodal-input font-sans"
                    />
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">TIME SLOT</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="submodal-input font-sans"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">INITIAL STATUS</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as 'confirmed' | 'seated')}
                      className="submodal-input font-mono"
                    >
                      <option value="confirmed">CONFIRMED (Awaiting Arrival)</option>
                      <option value="seated">SEATED IMMEDIATELY</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">NOTES / SPECIAL REQUESTS</label>
                    <input
                      type="text"
                      placeholder="Special occasion, single origin preference..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="submodal-input font-sans"
                    />
                  </div>
                </div>

                <div className="submodal-footer">
                  <button
                    type="button"
                    className="btn-swiss btn-swiss-outline font-mono"
                    onClick={() => setIsNewBookingOpen(false)}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="btn-swiss btn-walkin font-mono">
                    CONFIRM & CREATE BOOKING →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: QUICK WALK-IN CHECKIN
           ========================================================================= */}
        {isWalkinOpen && (
          <div className="submodal-backdrop" onClick={() => setIsWalkinOpen(false)}>
            <div className="submodal-card" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <h3 className="heading-title submodal-title">QUICK WALK-IN SEATING</h3>
                <button
                  type="button"
                  className="chc-modal-close font-mono"
                  onClick={() => setIsWalkinOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateWalkin} className="submodal-form">
                <div className="form-field">
                  <label className="meta-text font-mono">GUEST / PARTY NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Mehta"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="submodal-input font-sans"
                    autoFocus
                  />
                </div>

                <div className="form-field">
                  <label className="meta-text font-mono">CONTACT NUMBER (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="submodal-input font-mono"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="meta-text font-mono">PARTY SIZE</label>
                    <select
                      value={walkinGuests}
                      onChange={(e) => setWalkinGuests(e.target.value)}
                      className="submodal-input font-sans"
                    >
                      <option value="1 Guest (Walk-in Direct)">1 Guest</option>
                      <option value="2 Guests (Walk-in Direct)">2 Guests</option>
                      <option value="3 Guests (Walk-in Direct)">3 Guests</option>
                      <option value="4 Guests (Walk-in Direct)">4 Guests</option>
                      <option value="6 Guests (Walk-in Direct)">6 Guests</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="meta-text font-mono">ASSIGN TABLE / SEAT</label>
                    <select
                      value={walkinTable}
                      onChange={(e) => setWalkinTable(e.target.value)}
                      className="submodal-input font-mono"
                    >
                      {CAFE_TABLES.map((t) => {
                        const isOccupied = tableOccupancyMap.has(t.id);
                        return (
                          <option key={t.id} value={t.id} disabled={isOccupied}>
                            {t.id} — {t.name} ({t.seats}s) {isOccupied ? '[OCCUPIED]' : '[VACANT]'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="meta-text font-mono">INITIAL SESSION DURATION</label>
                  <select
                    value={walkinDuration}
                    onChange={(e) => setWalkinDuration(e.target.value)}
                    className="submodal-input font-sans"
                  >
                    <option value="45">45 Minutes (Quick Brew)</option>
                    <option value="60">60 Minutes (Standard Tasting)</option>
                    <option value="90">90 Minutes (Full Service)</option>
                  </select>
                </div>

                <div className="submodal-footer">
                  <button
                    type="button"
                    className="btn-swiss btn-swiss-outline font-mono"
                    onClick={() => setIsWalkinOpen(false)}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="btn-swiss btn-walkin font-mono">
                    SEAT GUEST NOW →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: ADD SUBSCRIBER
           ========================================================================= */}
        {isAddSubOpen && (
          <div className="submodal-backdrop" onClick={() => setIsAddSubOpen(false)}>
            <div className="submodal-card" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <h3 className="heading-title submodal-title">ADD DISPATCH SUBSCRIBER</h3>
                <button
                  type="button"
                  className="chc-modal-close font-mono"
                  onClick={() => setIsAddSubOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubscriber} className="submodal-form">
                <div className="form-field">
                  <label className="meta-text font-mono">SUBSCRIBER EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. reader@coffeeculture.in"
                    value={newSubEmail}
                    onChange={(e) => setNewSubEmail(e.target.value)}
                    className="submodal-input font-sans"
                    autoFocus
                  />
                </div>

                <div className="submodal-footer">
                  <button
                    type="button"
                    className="btn-swiss btn-swiss-outline font-mono"
                    onClick={() => setIsAddSubOpen(false)}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="btn-swiss btn-walkin font-mono">
                    SAVE SUBSCRIBER →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: ASSIGN TABLE FOR CONFIRMED RESERVATION
           ========================================================================= */}
        {assigningReservation && (
          <div className="submodal-backdrop" onClick={() => setAssigningReservation(null)}>
            <div className="submodal-card" onClick={(e) => e.stopPropagation()}>
              <div className="submodal-header">
                <h3 className="heading-title submodal-title">SEAT RESERVED GUEST</h3>
                <button
                  type="button"
                  className="chc-modal-close font-mono"
                  onClick={() => setAssigningReservation(null)}
                >
                  ✕
                </button>
              </div>

              {confirmedWaiting.length > 1 && (
                <div className="form-field" style={{ marginBottom: '1rem' }}>
                  <label className="meta-text font-mono">SWITCH RESERVATION</label>
                  <select
                    value={assigningReservation.id}
                    onChange={(e) => {
                      const found = reservations.find((r) => r.id === e.target.value);
                      if (found) setAssigningReservation(found);
                    }}
                    className="submodal-input font-sans"
                  >
                    {confirmedWaiting.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.code}) — {r.guests} [{r.time}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="assign-guest-summary font-sans">
                <span className="guest-name font-bold">{assigningReservation.name}</span>
                <span className="meta-text font-mono">
                  {assigningReservation.code} • {assigningReservation.guests} • {assigningReservation.phone}
                </span>
                {assigningReservation.notes && (
                  <span className="guest-notes-pill font-mono">“{assigningReservation.notes}”</span>
                )}
              </div>

              <div className="form-row-2" style={{ marginTop: '1.25rem' }}>
                <div className="form-field">
                  <label className="meta-text font-mono">SELECT AVAILABLE TABLE</label>
                  <select
                    value={selectedTableForAssign}
                    onChange={(e) => setSelectedTableForAssign(e.target.value)}
                    className="submodal-input font-mono"
                  >
                    {CAFE_TABLES.map((t) => {
                      const isOccupied = tableOccupancyMap.has(t.id);
                      return (
                        <option key={t.id} value={t.id} disabled={isOccupied}>
                          {t.id} — {t.name} ({t.seats}s) {isOccupied ? '[OCCUPIED]' : '[VACANT]'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-field">
                  <label className="meta-text font-mono">SESSION DURATION</label>
                  <select
                    value={assignDuration}
                    onChange={(e) => setAssignDuration(e.target.value)}
                    className="submodal-input font-sans"
                  >
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes (Standard)</option>
                    <option value="90">90 Minutes (Courtyard)</option>
                    <option value="120">120 Minutes (Extended)</option>
                  </select>
                </div>
              </div>

              <div className="submodal-footer" style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-swiss btn-swiss-outline font-mono"
                  onClick={() => setAssigningReservation(null)}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  className="btn-swiss btn-walkin font-mono"
                  onClick={handleConfirmAssign}
                >
                  CONFIRM SEATING →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background-color: rgba(17, 17, 17, 0.94);
          backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .admin-portal-card {
          position: relative;
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          width: 100%;
          max-width: 1400px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        /* Header */
        .admin-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas-subtle);
          gap: 1rem;
          flex-wrap: wrap;
        }

        .admin-badge {
          color: var(--accent-terracotta);
          display: block;
          margin-bottom: 0.15rem;
          letter-spacing: 0.08em;
        }

        .admin-title {
          font-size: clamp(1.15rem, 2vw, 1.45rem);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .action-toast {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          border-radius: 2px;
          animation: fadeInToast 0.3s ease;
        }

        @keyframes fadeInToast {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Top Stats Strip */
        .admin-stats-strip {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.8fr;
          gap: 1rem;
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
        }

        @media (max-width: 1200px) {
          .admin-stats-strip {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-stats-strip {
            grid-template-columns: 1fr;
          }
        }

        .admin-stat-card {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .stat-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.6875rem;
          letter-spacing: 0.05em;
        }

        .status-pill {
          font-size: 0.625rem;
          padding: 0.15rem 0.45rem;
          border-radius: 2px;
          letter-spacing: 0.05em;
        }

        .pill-live {
          background-color: rgba(46, 125, 50, 0.15);
          color: #2e7d32;
        }

        .pill-full {
          background-color: rgba(184, 92, 56, 0.2);
          color: var(--accent-terracotta);
        }

        .stat-main-number {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin: 0.25rem 0;
        }

        .num-large {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .num-total {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .num-unit {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .stat-sub-text {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .capacity-bar-track {
          width: 100%;
          height: 6px;
          background-color: var(--border-hairline);
          border-radius: 3px;
          overflow: hidden;
          margin: 0.5rem 0 0.35rem;
        }

        .capacity-bar-fill {
          height: 100%;
          transition: width 0.4s ease, background-color 0.4s ease;
        }

        .fill-green { background-color: #2e7d32; }
        .fill-amber { background-color: #f57c00; }
        .fill-red { background-color: #d32f2f; }

        .capacity-bar-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .quick-actions-btns {
          display: flex;
          gap: 0.5rem;
          margin: 0.5rem 0;
          flex-wrap: wrap;
        }

        .btn-walkin {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
          padding: 0.45rem 0.85rem;
          font-size: 0.75rem;
        }

        .btn-new-booking {
          background-color: var(--accent-terracotta);
          color: #F5F1EA;
          border-color: var(--accent-terracotta);
          padding: 0.45rem 0.85rem;
          font-size: 0.75rem;
        }

        .btn-new-booking:hover {
          background-color: var(--accent-copper-hover);
        }

        .btn-force-all {
          background-color: #d32f2f;
          color: #FFFFFF;
          border-color: #d32f2f;
          padding: 0.45rem 0.85rem;
          font-size: 0.75rem;
        }

        .btn-force-all:hover {
          background-color: #b71c1c;
        }

        .btn-delete-danger {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
          padding: 0.45rem 0.85rem;
          font-size: 0.75rem;
        }

        .btn-delete-danger:hover {
          background-color: #d32f2f;
          color: #FFFFFF;
        }

        .auto-vacate-toggle {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.6875rem;
          color: var(--text-muted);
          cursor: pointer;
        }

        /* Nav Tabs */
        .admin-nav-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas-subtle);
          overflow-x: auto;
        }

        .admin-nav-tab {
          padding: 0.85rem 1.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .admin-nav-tab:hover {
          color: var(--text-primary);
        }

        .admin-nav-tab.is-active {
          color: var(--accent-terracotta);
          border-bottom-color: var(--accent-terracotta);
          background-color: var(--bg-canvas);
          font-weight: 700;
        }

        /* Tab Panes */
        .admin-tab-pane {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 1.75rem;
        }

        /* Floor Plan Styles */
        .floor-plan-legend {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-available { background-color: #2e7d32; }
        .dot-seated { background-color: var(--accent-terracotta); }
        .dot-overstay { background-color: #d32f2f; box-shadow: 0 0 8px #d32f2f; }

        .floor-zones-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .floor-zone-box {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 1.25rem;
        }

        .floor-double-zones {
          display: flex;
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .floor-double-zones {
            flex-direction: column;
          }
        }

        .flex-1 { flex: 1; }

        .zone-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-hairline);
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .zone-title {
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          color: var(--text-primary);
        }

        .zone-sub-desc {
          margin-left: 0.5rem;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .zone-meta {
          color: var(--accent-terracotta);
          font-size: 0.75rem;
        }

        .zone-tables-grid {
          display: grid;
          gap: 1rem;
        }

        .grid-counter {
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        }

        .grid-tables-2 {
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        }

        .grid-tables-4 {
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        }

        .table-seat-card {
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 140px;
          transition: all 0.2s ease;
        }

        .table-seat-card.is-available {
          border-top: 3px solid #2e7d32;
        }

        .table-seat-card.is-occupied {
          border-top: 3px solid var(--accent-terracotta);
          background-color: rgba(184, 92, 56, 0.04);
        }

        .table-seat-card.is-overstay {
          border-top: 3px solid #d32f2f;
          background-color: rgba(211, 47, 47, 0.06);
          animation: pulseBorder 1.5s infinite ease-in-out;
        }

        @keyframes pulseBorder {
          0%, 100% { border-color: #d32f2f; }
          50% { border-color: rgba(211, 47, 47, 0.4); }
        }

        .seat-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .table-code {
          font-weight: 700;
          font-size: 0.8125rem;
          color: var(--text-primary);
        }

        .table-seats-badge {
          font-size: 0.625rem;
          color: var(--text-muted);
        }

        .seat-occupied-content {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .occupied-guest-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .occupied-code {
          font-size: 0.6875rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .session-timer-box {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          padding: 0.25rem 0.4rem;
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          margin: 0.35rem 0;
        }

        .timer-alert {
          background-color: #ffebee;
          color: #c62828;
          border-color: #ffcdd2;
          font-weight: 700;
        }

        .seat-actions-row {
          display: flex;
          gap: 0.35rem;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }

        .btn-table-action {
          flex: 1;
          padding: 0.35rem 0.25rem;
          font-size: 0.6875rem;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-table-action.btn-edit-seat {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border-color: var(--accent-terracotta);
          font-weight: 700;
        }

        .btn-table-action.btn-vacate {
          background-color: #2e7d32;
          color: #FFFFFF;
          border-color: #2e7d32;
          font-weight: 700;
        }

        .btn-table-action.btn-vacate:hover {
          background-color: #1b5e20;
        }

        .btn-table-action.btn-extend:hover {
          background-color: var(--bg-canvas-subtle);
        }

        .btn-table-action.btn-force {
          flex: 0 0 26px;
          background-color: #ffebee;
          color: #d32f2f;
          border-color: #ffcdd2;
        }

        .btn-table-action.btn-force:hover {
          background-color: #d32f2f;
          color: #FFFFFF;
        }

        .seat-available-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
        }

        .available-text {
          font-size: 0.6875rem;
          color: #2e7d32;
          font-weight: 600;
        }

        .seat-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          width: 100%;
        }

        .btn-seat-quick {
          padding: 0.3rem 0.5rem;
          font-size: 0.6875rem;
          border: 1px solid var(--border-hairline);
          background-color: transparent;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: center;
        }

        .btn-seat-quick:hover {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }

        .btn-seat-waiting {
          background-color: rgba(212, 163, 115, 0.15);
          border-color: var(--accent-ochre);
          color: var(--accent-coffee);
          font-weight: 700;
        }

        .btn-seat-waiting:hover {
          background-color: var(--accent-ochre);
          color: #FFFFFF;
        }

        /* Reservations Toolbar */
        .admin-filter-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .filter-group-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-group-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .admin-filter-input {
          padding: 0.5rem 0.85rem;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          color: var(--text-primary);
          font-size: 0.8125rem;
          outline: none;
        }

        .status-filter-pills {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .status-filter-btn {
          padding: 0.4rem 0.65rem;
          font-size: 0.6875rem;
          border: 1px solid var(--border-hairline);
          background-color: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .status-filter-btn.is-active {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }

        /* Table */
        .admin-table-scroll {
          overflow-x: auto;
          border: 1px solid var(--border-hairline);
        }

        .admin-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-data-table th {
          background-color: var(--bg-canvas-subtle);
          padding: 0.85rem 1rem;
          font-size: 0.6875rem;
          border-bottom: 1px solid var(--border-hairline);
          color: var(--text-muted);
          white-space: nowrap;
          user-select: none;
        }

        .admin-data-table td {
          padding: 0.85rem 1rem;
          font-size: 0.8125rem;
          border-bottom: 1px solid var(--border-hairline);
          color: var(--text-primary);
          vertical-align: middle;
        }

        .admin-data-table tr:hover td {
          background-color: rgba(17, 17, 17, 0.02);
        }

        .code-cell {
          color: var(--accent-terracotta);
        }

        .guest-info-block {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .guest-name {
          font-weight: 600;
        }

        .guest-phone {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .guest-notes {
          font-size: 0.6875rem;
          color: var(--accent-coffee);
          font-style: italic;
        }

        .table-info-block {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .assigned-table-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-terracotta);
        }

        .unassigned-table-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .status-cell-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .status-badge {
          display: inline-block;
          font-size: 0.6875rem;
          padding: 0.2rem 0.5rem;
          border: 1px solid var(--border-hairline);
          width: fit-content;
        }

        .badge-confirmed { background-color: rgba(212, 163, 115, 0.15); color: var(--accent-ochre); }
        .badge-seated { background-color: rgba(184, 92, 56, 0.2); color: var(--accent-terracotta); font-weight: 700; }
        .badge-completed { background-color: rgba(46, 125, 50, 0.15); color: #2e7d32; }
        .badge-cancelled { background-color: rgba(0, 0, 0, 0.06); color: var(--text-muted); }
        .badge-noshow { background-color: #ffebee; color: #c62828; }

        .live-timer-tag {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .tag-overstay {
          color: #c62828;
          font-weight: 700;
        }

        .row-action-buttons {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .btn-action {
          padding: 0.35rem 0.65rem;
          font-size: 0.6875rem;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-action:hover {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }

        .btn-action-edit {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border-color: var(--accent-terracotta);
          font-weight: 700;
        }

        .btn-action-edit:hover {
          background-color: #9c4826;
          color: #FFFFFF;
        }

        .btn-action-seat {
          background-color: #2e7d32;
          color: #FFFFFF;
          border-color: #2e7d32;
          font-weight: 700;
        }

        .btn-action-seat:hover {
          background-color: #1b5e20;
          color: #FFFFFF;
        }

        .btn-action-vacate {
          background-color: rgba(46, 125, 50, 0.1);
          color: #2e7d32;
          border-color: rgba(46, 125, 50, 0.3);
          font-weight: 700;
        }

        .btn-action-vacate:hover {
          background-color: #2e7d32;
          color: #FFFFFF;
        }

        .btn-action-extend {
          background-color: var(--bg-canvas-subtle);
        }

        .btn-action-noshow {
          color: #c62828;
        }

        .btn-action-noshow:hover {
          background-color: #c62828;
          color: #FFFFFF;
        }

        .btn-action-cancel {
          color: var(--text-muted);
        }

        .btn-action-reopen {
          background-color: var(--bg-canvas-subtle);
          color: var(--accent-coffee);
        }

        .btn-action-delete {
          color: #c62828;
          border-color: rgba(198, 40, 40, 0.3);
          padding: 0.35rem 0.5rem;
        }

        .btn-action-delete:hover {
          background-color: #c62828;
          color: #FFFFFF;
        }

        .empty-row {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
        }

        /* Subscribers Toolbar */
        .subscribers-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .subscribers-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .subscribers-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Submodal styles */
        .submodal-backdrop {
          position: fixed;
          inset: 0;
          z-index: calc(var(--z-modal) + 10);
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .submodal-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          width: 100%;
          max-width: 580px;
          padding: 1.75rem;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .edit-modal-card {
          max-width: 680px;
        }

        .submodal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-hairline);
        }

        .submodal-title {
          font-size: 1.2rem;
          margin: 0.2rem 0 0;
        }

        .submodal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-field label {
          font-size: 0.6875rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .submodal-input {
          padding: 0.6rem 0.85rem;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas-subtle);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
        }

        .submodal-input:focus {
          border-color: var(--accent-terracotta);
          background-color: var(--bg-canvas);
        }

        .submodal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-hairline);
        }

        .assign-guest-summary {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .guest-notes-pill {
          color: var(--accent-coffee);
          font-size: 0.75rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: ReservationStatus;
  table?: string;
  notes?: string;
  createdAt: number;
}

const KEY = 'casa_reservations_v1';

const DEFAULT_RESERVATIONS: Reservation[] = [
  { id: 'R-201', name: 'Ahmed El Fassi', phone: '+212 661 000 001', guests: 4, date: '2026-06-12', time: '20:00', status: 'confirmed', table: 'T-07', createdAt: Date.now() - 60000 },
  { id: 'R-202', name: 'Sarah Bennani', phone: '+212 662 000 002', guests: 2, date: '2026-06-12', time: '20:30', status: 'pending', createdAt: Date.now() - 120000 },
  { id: 'R-203', name: 'Marc Dupont', phone: '+212 663 000 003', guests: 6, date: '2026-06-13', time: '19:30', status: 'confirmed', table: 'T-14', createdAt: Date.now() - 180000 },
  { id: 'R-204', name: 'Nadia Cherkaoui', phone: '+212 664 000 004', guests: 3, date: '2026-06-13', time: '21:00', status: 'confirmed', table: 'T-02', createdAt: Date.now() - 240000 },
];

function loadReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_RESERVATIONS;
}

function saveReservations(r: Reservation[]) {
  try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {}
}

interface ReservationsContextValue {
  reservations: Reservation[];
  addReservation: (r: Omit<Reservation, 'createdAt'>) => void;
  updateReservation: (id: string, patch: Partial<Reservation>) => void;
  updateStatus: (id: string, status: ReservationStatus) => void;
  deleteReservation: (id: string) => void;
  stats: {
    total: number;
    pending: number;
    confirmed: number;
  };
}

const ReservationsContext = createContext<ReservationsContextValue | undefined>(undefined);

export function ReservationsProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(() => loadReservations());

  useEffect(() => { saveReservations(reservations); }, [reservations]);

  const addReservation = (r: Omit<Reservation, 'createdAt'>) => {
    setReservations((prev) => [{ ...r, createdAt: Date.now() }, ...prev]);
  };

  const updateReservation = (id: string, patch: Partial<Reservation>) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const updateStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
  };

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, updateReservation, updateStatus, deleteReservation, stats }}>
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationsProvider');
  return ctx;
}

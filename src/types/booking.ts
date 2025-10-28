import { MovieSession, SesionsByIdResponse } from './endpoints';

export interface BookingSeat {
  rowNumber: number;
  seatNumber: number;
}
export interface BookingRequest {
  seats: BookingSeat[];
}

export interface SessionInfo {
  bookedSeats: BookingSeat[];
  cinemaId: number;
  id: number;
  movieId: number;
  seats: { rows: number; seatsPerRow: number };
  startTime: string;
}
export interface MyBookingSeats {
  id: string;
  userId: number;
  movieSessionId: number;
  sessionId: number;
  bookedAt: string;
  seats: BookingSeat[];
  isPaid: boolean;
}
export interface BookingWithMovieInfo extends MyBookingSeats {
  movieSessionInfo?: MovieSession;
  movieTitle?: string;
  cinemaName?: string;
  timeLeft?: number;
  isExpired?: boolean;
}

export interface Settings {
  bookingPaymentTimeSeconds: number;
}
export type GroupedSessions = Record<string, SesionsByIdResponse[]>;

import { BookingSeat } from "./booking";

export interface RegisterResponse {
  id: string;
  username: string;
  message?: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  token: string;
  message?: string;
}
export interface SesionsByIdResponse {
  cinemaId: number;
  id: number;
  movieId: number;
  startTime: string;
}
export interface ApiError {
  message: string;
  status?: number;
}
export interface MovieSession {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
  seats: {
    rows: number;
    columns: number;
  };
  bookedSeats: BookingSeat[];
}

export interface BookingRequest {
  seatNumbers: string[];
}

export interface BookingResponse {
  id: string;
  movieSessionId: number;
  userId: number;
  seatNumbers: string[];
  status: string;
  bookedAt: string;
}

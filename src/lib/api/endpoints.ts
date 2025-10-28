import {
  BookingRequest,
  MyBookingSeats,
  SessionInfo,
  Settings,
} from '@/types/booking';
import { Cinema, CinemaSession } from '@/types/cinema';
import {
  RegisterResponse,
  LoginResponse,
  SesionsByIdResponse,
  BookingResponse,
  MovieSession,
} from '@/types/endpoints';
import { apiClient } from './axios-client';
import { RegisterFormData } from '@/lib/validation-schema';
import { Movie } from '@/types/movie';

export const registerUser = async (
  userData: RegisterFormData
): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>('/register', {
    username: userData.username,
    password: userData.password,
  });
  return data;
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/login', credentials);
  return data;
};

export const getMovies = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get('/movies');
  return data;
};
export const getSessionsById = async (
  movieId: string
): Promise<SesionsByIdResponse[]> => {
  const { data } = await apiClient.get(`/movies/${movieId}/sessions`);
  return data;
};

export const getCinemas = async (): Promise<Cinema[]> => {
  const { data } = await apiClient.get(`/cinemas`);
  return data;
};
export const getCinemaSessions = async (
  cinemaId: string
): Promise<CinemaSession[]> => {
  const { data } = await apiClient.get(`/cinemas/${cinemaId}/sessions`);
  return data;
};

export const getMovieSession = async (
  sessionId: number | string
): Promise<SessionInfo> => {
  const { data } = await apiClient.get(`/movieSessions/${sessionId}`);
  return data;
};

export const bookSeats = async (
  sessionId: string,
  bookingData: BookingRequest
): Promise<BookingResponse> => {
  const token = localStorage.getItem('authToken');
  const { data } = await apiClient.post(
    `/movieSessions/${sessionId}/bookings`,
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
export const getMyTickets = async (): Promise<MyBookingSeats[]> => {
  const token = localStorage.getItem('authToken');
  const { data } = await apiClient.get('/me/bookings', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getSettings = async (): Promise<Settings> => {
  const { data } = await apiClient.get('/settings');

  return data;
};

export const payForBooking = async (bookingId: string): Promise<void> => {
  const token = localStorage.getItem('authToken');
  const { data } = await apiClient.post(
    `/bookings/${bookingId}/payments`,
    { bookingId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

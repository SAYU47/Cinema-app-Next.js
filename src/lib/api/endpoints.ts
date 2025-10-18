import { apiClient } from './axios-client';
import { RegisterFormData } from '@/lib/validation-schema';

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
export interface MovieResponse {
    id: number,
    title: string,
    description: string,
    year: number,
    lengthMinutes: number,
    posterImage: string,
    rating: number
  
}

export interface ApiError {
  message: string;
  status?: number;
}

export const registerUser = async (userData: RegisterFormData): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>('/register', {
    username: userData.username,
    password: userData.password
  });
  return data;
};


export const loginUser = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/login', credentials);
  return data;
};


export const getMovies = async (): Promise<MovieResponse[]> => {
  const { data } = await apiClient.get('/movies');
  return data;
};
export const getMovieById = async (movieId: string) => {
  const { data } = await apiClient.get(`/movies/${movieId}/sessions`);
  return data;
};
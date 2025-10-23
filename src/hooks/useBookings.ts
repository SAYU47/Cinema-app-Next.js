import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { getCinemas, getMovieSession, getMovies, getMyTickets, getSettings } from '@/lib/api/endpoints';
import { BookingWithMovieInfo, MyBookingSeats } from '@/types/booking';
import { Movie } from '@/types/movie';
import { Cinema } from '@/types/cinema';
import { enrichBookingsWithDetails } from '@/lib/utils/bookingHelper';

export const useBookings = () => {
  const { isAuthorized } = useAuth();
  const [bookings, setBookings] = useState<BookingWithMovieInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        const [bookingsResponse, moviesResponse, cinemasResponse, settingsResponse] = await Promise.all([
          getMyTickets(),
          getMovies(),
          getCinemas(),
          getSettings()
        ]);

        const bookingsWithFullInfo = await enrichBookingsWithDetails(
          bookingsResponse, 
          moviesResponse, 
          cinemasResponse, 
          settingsResponse
        );
        
        setBookings(bookingsWithFullInfo);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [isAuthorized]);

  return {
    bookings,
    isLoading,
    setBookings
  };
};
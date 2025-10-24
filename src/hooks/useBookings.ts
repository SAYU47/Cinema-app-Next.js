  import { useState, useEffect } from 'react';
  import { useAuth } from '@/providers/AuthProvider';
  import { getCinemas, getMovies, getMyTickets, getSettings } from '@/lib/api/endpoints';
  import { BookingWithMovieInfo } from '@/types/booking';
  import { enrichBookingsWithDetails } from '@/lib/utils/bookingHelper';
import { toast } from 'sonner';

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
          toast.error(`Ошибка загрузки данных: ${error}`);
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
  export const useGroupedBookings = (bookings: BookingWithMovieInfo[]) => {
      return bookings.reduce((groups, booking) => {
        if (booking.isExpired) return groups;
    
        if (!booking.isPaid) {
          groups.unpaid.push(booking);
        } else {
          const sessionDate = booking.movieSessionInfo?.startTime ? new Date(booking.movieSessionInfo.startTime) : null;
          const now = new Date();
          
          if (!sessionDate || sessionDate > now) {
            groups.upcoming.push(booking);
          } else {
            groups.past.push(booking);
          }
        }
    
        return groups;
      }, {
        unpaid: [] as BookingWithMovieInfo[],
        upcoming: [] as BookingWithMovieInfo[],
        past: [] as BookingWithMovieInfo[]
      });
    };

  export const useBookingTimer = (bookings: BookingWithMovieInfo[], setBookings: React.Dispatch<React.SetStateAction<BookingWithMovieInfo[]>>) => {
      const allPaid = bookings.every(booking => booking.isPaid);
      
      useEffect(() => {
        if (allPaid || !bookings.length) return;
        
        const timer = setInterval(() => {
          setBookings(prevBookings => {
            const updatedBookings = prevBookings.map(booking => {
              if (booking.isPaid || !booking.timeLeft) return booking;
      
              const newTimeLeft = Math.max(0, booking.timeLeft - 1);
              const isExpired = newTimeLeft <= 0;
      
              return {
                ...booking,
                timeLeft: newTimeLeft,
                isExpired
              };    
            }).filter(booking => !(booking.isExpired && !booking.isPaid));
      
            return updatedBookings;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      }, [allPaid, bookings.length, setBookings]);
    };
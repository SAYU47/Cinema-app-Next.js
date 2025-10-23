import { getMovieSession } from '@/lib/api/endpoints';
import { BookingWithMovieInfo, MyBookingSeats } from '@/types/booking';
import { Movie } from '@/types/movie';
import { Cinema } from '@/types/cinema';

export const calculateTimeLeft = (booking: MyBookingSeats, settings: any) => {
  if (booking.isPaid) return { timeLeft: undefined, isExpired: false };

  const bookedAt = new Date(booking.bookedAt).getTime();
  const deadline = bookedAt + settings.bookingPaymentTimeSeconds * 1000;
  const now = Date.now();
  const timeLeft = Math.max(0, Math.floor((deadline - now) / 1000));
  const isExpired = timeLeft <= 0;

  return { timeLeft, isExpired };
};

export const createFallbackBooking = (booking: MyBookingSeats): BookingWithMovieInfo => ({
  ...booking,
  movieSessionInfo: undefined,
  movieTitle: `Фильм #${booking.movieSessionId}`,
  cinemaName: 'Кинотеатр',
  timeLeft: undefined,
  isExpired: false
});

export const enrichBookingsWithDetails = async (
  bookingsResponse: MyBookingSeats[], 
  moviesResponse: Movie[], 
  cinemasResponse: Cinema[], 
  settingsResponse: any
): Promise<BookingWithMovieInfo[]> => {
  return await Promise.all(
    bookingsResponse.map(async (booking: MyBookingSeats) => {
      try {
        const movieSessionInfo = await getMovieSession(booking.movieSessionId);
        const movie = moviesResponse.find((m: Movie) => m.id === movieSessionInfo.movieId);
        const cinema = cinemasResponse.find((c: Cinema) => c.id === movieSessionInfo.cinemaId);
        
        const { timeLeft, isExpired } = calculateTimeLeft(booking, settingsResponse);

        return {
          ...booking,
          movieSessionInfo,
          movieTitle: movie?.title || `Фильм #${movieSessionInfo.movieId}`,
          cinemaName: cinema?.name || `Кинотеатр #${movieSessionInfo.cinemaId}`,
          timeLeft,
          isExpired
        };
      } catch (error) {
        console.error(`Ошибка загрузки сеанса ${booking.movieSessionId}:`, error);
        return createFallbackBooking(booking);
      }
    })
  );
};

export const getEmptyMessage = (section: string) => {
  const messages = {
    unpaid: '🎉 Нет неоплаченных билетов',
    upcoming: '📋 У вас нет предстоящих сеансов', 
    past: '🕒 У вас еще нет прошедших сеансов'
  };
  
  return messages[section as keyof typeof messages] || 'Нет данных';
};
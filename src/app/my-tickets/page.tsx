'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { getCinemas, getMovieSession, getMovies, getMyTickets, getSettings, payForBooking } from '@/lib/api/endpoints';
import TicketCard from '@/components/TicketCard/TicketCard';
import { BookingWithMovieInfo, MyBookingSeats } from '@/types/booking';
import { Movie } from '@/types/movie';
import { Cinema } from '@/types/cinema';

export default function MyTicketsPage() {
  const { isAuthorized } = useAuth();
  const [bookings, setBookings] = useState<BookingWithMovieInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
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
        const bookingsWithFullInfo = await Promise.all(
          bookingsResponse.map(async (booking: MyBookingSeats) => {
            
            try {
              const movieSessionInfo = await getMovieSession(booking.movieSessionId);
    
              const movie = moviesResponse.find((m: Movie) => m.id === movieSessionInfo.movieId);
              const movieTitle = movie?.title || `Фильм #${movieSessionInfo.movieId}`;
              
              const cinema = cinemasResponse.find((c: Cinema) => c.id === movieSessionInfo.cinemaId);
              const cinemaName = cinema?.name || `Кинотеатр #${movieSessionInfo.cinemaId}`;

              let timeLeft: number | undefined;
              let isExpired = false;

              if (!booking.isPaid) {
                const bookedAt = new Date(booking.bookedAt).getTime();
                const deadline = bookedAt + settingsResponse.bookingPaymentTimeSeconds * 1000;
                const now = Date.now();
                timeLeft = Math.max(0, Math.floor((deadline - now) / 1000));
                isExpired = timeLeft <= 0;
              }

              return {
                ...booking,
                movieSessionInfo,
                movieTitle,
                cinemaName,
                timeLeft,
                isExpired
              };
            } catch (error) {
              console.error(`Ошибка загрузки сеанса ${booking.movieSessionId}:`, error);
              return {
                ...booking,
                movieSessionInfo: undefined,
                movieTitle: `Фильм #${booking.movieSessionId}`,
                cinemaName: 'Кинотеатр',
                timeLeft: undefined,
                isExpired: false
              };
            }
          })
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

  const allPaid = bookings.every(booking => booking.isPaid);
  useEffect(() => {
    
    console.log(bookings )
    if (allPaid) return
    if (!bookings.length) return;
    
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
  }, [allPaid]); 

  const handlePayment = async (bookingId: string) => {
    try {
      setPayingBookingId(bookingId);
      

      await payForBooking(bookingId);

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { 
                ...booking, 
                isPaid: true,
                timeLeft: undefined,
                isExpired: false
              }
            : booking
        )
      );

    } catch (error) {
      console.error('Ошибка оплаты:', error);
      alert('Произошла ошибка при оплате. Попробуйте еще раз.');
    } finally {
      setPayingBookingId(null);
    }
  };

  const groupBookings = (bookings: BookingWithMovieInfo[]) => {
    const now = new Date();
    
    const grouped = {
      unpaid: [] as BookingWithMovieInfo[],
      upcoming: [] as BookingWithMovieInfo[],
      past: [] as BookingWithMovieInfo[]
    };

    bookings.forEach(booking => {
  
      if (booking.isExpired) return;

      if (!booking.isPaid) {
        grouped.unpaid.push(booking);
      } else {
        if (booking.movieSessionInfo?.startTime) {
          const sessionDate = new Date(booking.movieSessionInfo.startTime);
          console.log(sessionDate)
          console.log(now)
          if (sessionDate > now) {
            grouped.upcoming.push(booking);
          } else {
            grouped.past.push(booking);
          }
        } else {
          grouped.upcoming.push(booking);
        }
      }
    });

    return grouped;
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Необходима авторизация
          </h1>
          <p className="text-gray-600">
            Пожалуйста, войдите в систему для просмотра ваших билетов.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Загрузка ваших билетов...</p>
          </div>
        </div>
      </div>
    );
  }

  const groupedBookings = groupBookings(bookings);

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои билеты</h1>
        <p className="text-gray-600 mb-8">Управление вашими бронированиями</p>

        {/* Неоплаченные билеты */}
        <section className="mb-12">
          <div className="flex items-center mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-gray-800">🚨 Неоплаченные</h2>
            <span className="ml-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-red-600">
              {groupedBookings.unpaid.length}
            </span>
          </div>
          
          {groupedBookings.unpaid.length > 0 ? (
            <div className="space-y-4">
              {groupedBookings.unpaid.map(booking => (
                <TicketCard 
                  key={booking.id} 
                  booking={booking} 
                  showPayButton={true}
                  onPayment={handlePayment}
                  isPaying={payingBookingId === booking.id}
                  timeLeft={booking.timeLeft}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <p className="text-gray-500">🎉 Нет неоплаченных билетов</p>
            </div>
          )}
        </section>

        {/* Будущие билеты */}
        <section className="mb-12">
          <div className="flex items-center mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-800">📅 Будущие сеансы</h2>
            <span className="ml-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-green-600">
              {groupedBookings.upcoming.length}
            </span>
          </div>
          
          {groupedBookings.upcoming.length > 0 ? (
            <div className="space-y-4">
              {groupedBookings.upcoming.map(booking => (
                <TicketCard 
                  key={booking.id} 
                  booking={booking} 
                  showPayButton={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <p className="text-gray-500">📋 У вас нет предстоящих сеансов</p>
            </div>
          )}
        </section>

        {/* Прошедшие билеты */}
        <section className="mb-12">
          <div className="flex items-center mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800">📋 Прошедшие сеансы</h2>
            <span className="ml-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600">
              {groupedBookings.past.length}
            </span>
          </div>
          
          {groupedBookings.past.length > 0 ? (
            <div className="space-y-4">
              {groupedBookings.past.map(booking => (
                <TicketCard 
                  key={booking.id} 
                  booking={booking} 
                  showPayButton={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <p className="text-gray-500">🕒 У вас еще нет прошедших сеансов</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
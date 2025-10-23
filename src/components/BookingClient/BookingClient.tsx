  'use client';

  import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { bookSeats, getMovies } from '@/lib/api/endpoints';
  import { useAuth } from '@/providers/AuthProvider';
  import UnauthorizedWarning from '@/components/ui/UnauthorizedWarning/UnauthorizedWarning'
  import SeatLegend from '@/components/SeatsLegend/SeatsLegend'
  import { BookingSeat, SessionInfo } from '@/types/booking';
  import { Cinema } from '@/types/cinema';
  import { Movie } from '@/types/movie';

  interface BookingClientProps {  
    session: SessionInfo;
    sessionId: string;
    cinema?: Cinema;
    movie?: Movie
  }

  export default function BookingClient({ session, sessionId, movie, cinema }: BookingClientProps) {
    const router = useRouter();
    const { isAuthorized } = useAuth();
    const [selectedSeats, setSelectedSeats] = useState<BookingSeat[]>([]);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

  console.log(session)

    const handleSeatClick = (rowNumber: number, seatNumber: number) => {

      if (!isAuthorized) return;
    
      const seatObject = { rowNumber, seatNumber };
    
      setSelectedSeats(prevSelectedSeats => {
        const isAlreadySelected = prevSelectedSeats.some(
          seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
        );

        if (isAlreadySelected) {
          return prevSelectedSeats.filter(
            seat => !(seat.rowNumber === rowNumber && seat.seatNumber === seatNumber)
          );
        } else {
          return [...prevSelectedSeats, seatObject];
        }
      });
    
    };

    const handleBooking = async () => {
      if (!isAuthorized) {
        router.push('/auth/login');
        return;
      }

      if (selectedSeats.length === 0) {
        alert('Выберите хотя бы одно место');
        return;
      }

      try {
        setBookingLoading(true);
        await bookSeats(sessionId, { seats: selectedSeats });
        router.push('/my-tickets');
      } catch (err) {
        setError('Ошибка бронирования');
      } finally {
        setBookingLoading(false);
      }
    };

    const getSeatStatus = (row: number, column: number) => {
      const seatObject = { rowNumber: row + 1, seatNumber: column + 1 };
      const isBooked = session?.bookedSeats.some(
        (seat) => seat.rowNumber === seatObject.rowNumber && seat.seatNumber === seatObject.seatNumber
      );
      const isSelected = selectedSeats.some(
        (seat) => seat.rowNumber === seatObject.rowNumber && seat.seatNumber === seatObject.seatNumber
      );
      if (isBooked) {
        return 'booked';
      }
      if (isSelected) {
        return 'selected';
      }
      return 'available';
    };

    const rows = session.seats?.rows || 0;
    const columns = session.seats?.seatsPerRow || 0;

    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Выбрать места</h1>
            
            <p className="text-gray-600"><b>Фильм:</b> {movie?.title}</p>
            <p className="text-gray-600"><b>Кинотеатр:</b> {cinema?.name}</p>
            <p className="text-gray-600"><b>Время:</b> {new Date(session.startTime).toLocaleString('ru-RU')}</p>
          </div>
        
          <SeatLegend />
          {!isAuthorized && <UnauthorizedWarning />}


          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <span className="w-12 text-sm font-medium text-gray-600 whitespace-nowrap    ">
                    {`ряд ${rowIndex + 1}`}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: columns }, (_, columnIndex) => {
                      const status = getSeatStatus(rowIndex, columnIndex);
                      const rowNumber = rowIndex + 1
                    const seatNumber = columnIndex + 1
                      
                      return (
                        <button
                          key={columnIndex}
                          onClick={() => handleSeatClick(rowNumber, seatNumber )}
                          disabled={status === 'booked' || (!isAuthorized && status === 'available')}
                          className={`
                            w-8 h-8 rounded border-2 text-xs font-medium transition-all
                            ${status === 'available' 
                              ? 'bg-green-500 border-green-600 hover:bg-green-600 text-white cursor-pointer' 
                              : status === 'booked'
                              ? 'bg-red-500 border-red-600 cursor-not-allowed text-white'
                              : 'bg-blue-500 border-blue-600 text-white cursor-pointer'
                            }
                            ${!isAuthorized && status === 'available' ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        
                        >
                          {columnIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Информация о бронировании</h3>                                   
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">
                      Выбрано мест: <span className="font-semibold">{selectedSeats.length}</span>
                    </p>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading} 
                    className={`
                      w-full max-w-xs py-3 px-6 rounded-lg font-semibold text-white transition-colors
                      ${!bookingLoading
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {bookingLoading ? 'Бронируем...' : 'Забронировать'}
                  </button>
                
          
            </div>
          </div>

        
        </div>
      </div>
    );
  }
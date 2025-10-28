'use client';

import { useAuth } from '@/providers/AuthProvider';
import UnauthorizedWarning from '@/components/ui/UnauthorizedWarning/UnauthorizedWarning';
import SeatLegend from '@/components/SeatsLegend/SeatsLegend';
import { useSeatSelection } from '@/hooks/useSeatSelection';
import { useSeatStatus } from '@/hooks/useSeatStatus';
import { useBookingProcess } from '@/hooks/useBookingProcess';
import BookingHeader from '@/components/BookingClient/BookingHeader';
import SeatGrid from '@/components/BookingClient/SeatGrid';
import BookingInfo from '@/components/BookingClient/BookingInfo';
import { Cinema } from '@/types/cinema';
import { Movie } from '@/types/movie';
import { SessionInfo } from '@/types/booking';

interface BookingClientProps {
  session: SessionInfo;
  sessionId: string;
  cinema?: Cinema;
  movie?: Movie;
}

export default function BookingClient({
  session,
  sessionId,
  movie,
  cinema,
}: BookingClientProps) {
  const { isAuthorized } = useAuth();

  // Хук для выбора мест
  const { selectedSeats, bookingLoading, setBookingLoading, handleSeatClick } =
    useSeatSelection();

  // Хук для определения статусов мест
  const { getSeatStatus, isSeatDisabled } = useSeatStatus({
    session,
    selectedSeats,
    isAuthorized,
  });

  // Хук для процесса бронирования
  const { handleBooking } = useBookingProcess({
    selectedSeats,
    setBookingLoading,
  });

  const onBooking = () => handleBooking(sessionId);

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full mt-[60px] min-lg:mt-0">
      <div className="max-w-4xl mx-auto">
        <BookingHeader session={session} movie={movie} cinema={cinema} />

        <SeatLegend />
        {!isAuthorized && <UnauthorizedWarning />}

        <SeatGrid
          session={session}
          selectedSeats={selectedSeats}
          isAuthorized={isAuthorized}
          onSeatClick={handleSeatClick}
          getSeatStatus={getSeatStatus}
          isSeatDisabled={isSeatDisabled}
        />

        <BookingInfo
          selectedSeats={selectedSeats}
          bookingLoading={bookingLoading}
          onBooking={onBooking}
        />
      </div>
    </div>
  );
}

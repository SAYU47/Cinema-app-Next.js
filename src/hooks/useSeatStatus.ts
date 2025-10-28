// hooks/useSeatStatus.ts
import { BookingSeat, SessionInfo } from '@/types/booking';

interface UseSeatStatusProps {
  session: SessionInfo;
  selectedSeats: BookingSeat[];
  isAuthorized: boolean;
}

export const useSeatStatus = ({
  session,
  selectedSeats,
  isAuthorized,
}: UseSeatStatusProps) => {
  const getSeatStatus = (row: number, column: number) => {
    const seatObject = { rowNumber: row + 1, seatNumber: column + 1 };
    const isBooked = session?.bookedSeats.some(
      (seat) =>
        seat.rowNumber === seatObject.rowNumber &&
        seat.seatNumber === seatObject.seatNumber
    );
    const isSelected = selectedSeats.some(
      (seat) =>
        seat.rowNumber === seatObject.rowNumber &&
        seat.seatNumber === seatObject.seatNumber
    );

    if (isBooked) {
      return 'booked';
    }
    if (isSelected) {
      return 'selected';
    }
    return 'available';
  };

  const isSeatDisabled = (status: string) => {
    return status === 'booked' || (!isAuthorized && status === 'available');
  };

  return {
    getSeatStatus,
    isSeatDisabled,
  };
};

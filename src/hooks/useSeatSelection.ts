// hooks/useSeatSelection.ts
import { useState } from 'react';
import { BookingSeat } from '@/types/booking';

export const useSeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState<BookingSeat[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleSeatClick = (rowNumber: number, seatNumber: number) => {
    setSelectedSeats((prevSelectedSeats) => {
      const isAlreadySelected = prevSelectedSeats.some(
        (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
      );

      if (isAlreadySelected) {
        return prevSelectedSeats.filter(
          (seat) =>
            !(seat.rowNumber === rowNumber && seat.seatNumber === seatNumber)
        );
      } else {
        return [...prevSelectedSeats, { rowNumber, seatNumber }];
      }
    });
  };

  const clearSelection = () => {
    setSelectedSeats([]);
  };

  return {
    selectedSeats,
    bookingLoading,
    setBookingLoading,
    handleSeatClick,
    clearSelection,
  };
};

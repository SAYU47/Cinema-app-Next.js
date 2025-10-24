'use client';

import { useBookings } from '@/hooks/useBookings';
import { useBookingTimer } from '@/hooks/useBookings';
import { useGroupedBookings } from '@/hooks/useBookings';
import { useAuth } from '@/providers/AuthProvider';
import { payForBooking } from '@/lib/api/endpoints';
import { AuthorizationMessage } from '@/components/MyTiketsComponents/AuthorizationMessage';
import { LoadingState } from '@/components/MyTiketsComponents/LoadingState';
import { TicketsSection } from '@/components/MyTiketsComponents/TicketsSection';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MyTicketsPage() { 
  const { isAuthorized } = useAuth();
  const { bookings, isLoading, setBookings } = useBookings();
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  
  useBookingTimer(bookings, setBookings);
  const groupedBookings = useGroupedBookings(bookings);

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
      toast.error(`Ошибка оплаты: ${error}`);
    } finally {
      setPayingBookingId(null);
    }
  };

  if (!isAuthorized) {
    return <AuthorizationMessage />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои билеты</h1>
    <p className="text-gray-600 mb-8">Управление вашими бронированиями</p>
        
        <TicketsSection
          title="Неоплаченные"
          bookings={groupedBookings.unpaid}    
          colorClass="bg-red-50 border-red-500"
          showPayButton={true}
          onPayment={handlePayment}
          payingBookingId={payingBookingId}
        />
        
        <TicketsSection
          title="Будущие сеансы"
          bookings={groupedBookings.upcoming}  
          colorClass="bg-green-50 border-green-500"
        />
        
        <TicketsSection
          title="Прошедшие сеансы" 
          bookings={groupedBookings.past}   
          colorClass="bg-blue-50 border-blue-500"
        />
      </div>
    </div>
  );
}
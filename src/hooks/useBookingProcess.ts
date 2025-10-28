// hooks/useBookingProcess.ts
import { useRouter } from 'next/navigation';
import { bookSeats } from '@/lib/api/endpoints';
import { BookingSeat } from '@/types/booking';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';

interface UseBookingProcessProps {
  selectedSeats: BookingSeat[];
  setBookingLoading: (loading: boolean) => void;
}

export const useBookingProcess = ({
  selectedSeats,
  setBookingLoading,
}: UseBookingProcessProps) => {
  const router = useRouter();
  const { isAuthorized } = useAuth();

  const handleBooking = async (sessionId: string) => {
    if (!isAuthorized) {
      router.push('/auth/login');
      return false;
    }

    if (selectedSeats.length === 0) {
      toast.error('Выберите хотя бы одно место');
      return false;
    }

    try {
      setBookingLoading(true);
      await bookSeats(sessionId, { seats: selectedSeats });
      toast.success('Места успешно забронированы!');
      router.push('/my-tickets');
      return true;
    } catch (err) {
      toast.error('Ошибка бронирования');
      return false;
    } finally {
      setBookingLoading(false);
    }
  };

  return {
    handleBooking,
  };
};

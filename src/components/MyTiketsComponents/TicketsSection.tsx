import TicketCard from '@/components/TicketCard/TicketCard';
import { BookingWithMovieInfo } from '@/types/booking';
import { getEmptyMessage } from '@/lib/utils/bookingHelper';

interface TicketsSectionProps {
  title: string;
  bookings: BookingWithMovieInfo[];
  icon: string;
  colorClass: string;
  showPayButton?: boolean;
  onPayment?: (bookingId: string) => void;
  payingBookingId?: string | null;
}

export const TicketsSection = ({ 
  title, 
  bookings, 
  icon, 
  colorClass,
  showPayButton = false,
  onPayment,
  payingBookingId 
}: TicketsSectionProps) => (
  <section className="mb-12">
    <div className={`flex items-center mb-6 p-4 ${colorClass} rounded-lg border-l-4`}>
      <h2 className="text-2xl font-bold text-gray-800">{icon} {title}</h2>
      <span className="ml-3 bg-white px-3 py-1 rounded-full text-sm font-medium">
        {bookings.length}
      </span>
    </div>
    
    {bookings.length > 0 ? (
      <div className="space-y-4">
        {bookings.map(booking => (
          <TicketCard 
            key={booking.id} 
            booking={booking} 
            showPayButton={showPayButton}
            onPayment={onPayment}
            isPaying={payingBookingId === booking.id}
            timeLeft={booking.timeLeft}
          />
        ))}
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{getEmptyMessage(title.toLowerCase())}</p>
      </div>
    )}
  </section>
);
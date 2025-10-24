import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyTicketsPage from './page'; 
import { useAuth } from '@/providers/AuthProvider';
import { useBookings, useBookingTimer, useGroupedBookings } from '@/hooks/useBookings';
import { payForBooking } from '@/lib/api/endpoints';
import { BookingWithMovieInfo } from '@/types/booking';


jest.mock('../../providers/AuthProvider');
jest.mock('../../hooks/useBookings');
jest.mock('../../lib/api/endpoints');
jest.mock('../../components/MyTiketsComponents/AuthorizationMessage', () => ({
  AuthorizationMessage: () => <div data-testid="auth-message">Authorization Required</div>
}));
jest.mock('../../components/MyTiketsComponents/LoadingState', () => ({
  LoadingState: () => <div data-testid="loading-state">Loading...</div>
}));
jest.mock('../../components/MyTiketsComponents/TicketsSection', () => ({
  TicketsSection: ({ title, bookings, showPayButton, onPayment }: any) => (
    <div data-testid={`tickets-section-${title.toLowerCase()}`}>
      <h3>{title}</h3>
      <div data-testid={`bookings-count-${title.toLowerCase()}`}>
        {bookings.length} bookings
      </div>
      {showPayButton && bookings.length > 0 && (
        <button onClick={() => onPayment(bookings[0].id)}>
          Pay {bookings[0].id}
        </button>
      )}
    </div>
  )
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseBookings = useBookings as jest.MockedFunction<typeof useBookings>;
const mockedUseBookingTimer = useBookingTimer as jest.MockedFunction<typeof useBookingTimer>;
const mockedUseGroupedBookings = useGroupedBookings as jest.MockedFunction<typeof useGroupedBookings>;
const mockedPayForBooking = payForBooking as jest.MockedFunction<typeof payForBooking>;


const createMockBooking = (overrides: Partial<BookingWithMovieInfo> = {}): BookingWithMovieInfo => ({
  id: '1',
  userId: 1,
  movieSessionId: 1,
  sessionId: 1,
  bookedAt: new Date().toISOString(),
  seats: [{ rowNumber: 1, seatNumber: 1 }],
  isPaid: false,
  movieTitle: 'Test Movie',
  cinemaName: 'Test Cinema',
  timeLeft: 900,
  isExpired: false,
  ...overrides
});

describe('MyTicketsPage', () => {
  const mockSetBookings = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    

    mockedUseAuth.mockReturnValue({ isAuthorized: true } as any);
    

    mockedUseBookings.mockReturnValue({
      bookings: [],
      isLoading: false,
      setBookings: mockSetBookings
    });
    

    mockedUseBookingTimer.mockImplementation(() => {});

    mockedUseGroupedBookings.mockReturnValue({
      unpaid: [],
      upcoming: [],
      past: []
    });
    
    window.alert = jest.fn();
  });

  it('shows authorization message when not authorized', () => {
    mockedUseAuth.mockReturnValue({ isAuthorized: false } as any);

    render(<MyTicketsPage />);

    expect(screen.getByTestId('auth-message')).toBeTruthy();
  });

  it('shows loading state when data is loading', () => {
    mockedUseBookings.mockReturnValue({
      bookings: [],
      isLoading: true,
      setBookings: mockSetBookings
    });

    render(<MyTicketsPage />);

    expect(screen.getByTestId('loading-state')).toBeTruthy();
  });

  it('displays page with tickets sections when loaded', () => {
    const mockBookings = [
      createMockBooking({ id: '1', isPaid: false }),
      createMockBooking({ id: '2', isPaid: true }),
      createMockBooking({ id: '3', isPaid: true })
    ];

    mockedUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      setBookings: mockSetBookings
    });

    mockedUseGroupedBookings.mockReturnValue({
      unpaid: [mockBookings[0]],
      upcoming: [mockBookings[1]],
      past: [mockBookings[2]]
    });

    render(<MyTicketsPage />);

    expect(screen.getByText('Мои билеты')).toBeTruthy();
    expect(screen.getByText('Управление вашими бронированиями')).toBeTruthy();
    
    expect(screen.getByTestId('tickets-section-неоплаченные')).toBeTruthy();
    expect(screen.getByTestId('tickets-section-будущие сеансы')).toBeTruthy();
    expect(screen.getByTestId('tickets-section-прошедшие сеансы')).toBeTruthy();
  });

  it('handles successful payment', async () => {
    const user = userEvent.setup();
    const mockBookings = [createMockBooking({ id: '1', isPaid: false })];

    mockedUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      setBookings: mockSetBookings
    });

    mockedUseGroupedBookings.mockReturnValue({
      unpaid: mockBookings,
      upcoming: [],
      past: []
    });

    mockedPayForBooking.mockResolvedValue({} as any);

    render(<MyTicketsPage />);

    await user.click(screen.getByText('Pay 1'));

    expect(mockedPayForBooking).toHaveBeenCalledWith('1');
    expect(mockSetBookings).toHaveBeenCalled();
  });

  it('handles payment error', async () => {
    const user = userEvent.setup();
    const mockBookings = [createMockBooking({ id: '1', isPaid: false })];

    mockedUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      setBookings: mockSetBookings
    });

    mockedUseGroupedBookings.mockReturnValue({
      unpaid: mockBookings,
      upcoming: [],
      past: []
    });

    const mockError = new Error('Payment failed');
    mockedPayForBooking.mockRejectedValue(mockError);

    render(<MyTicketsPage />);

    await user.click(screen.getByText('Pay 1'));

    expect(mockedPayForBooking).toHaveBeenCalledWith('1');
  });

  it('groups bookings correctly into sections', () => {
    const mockBookings = [
      createMockBooking({ id: '1', isPaid: false }),
      createMockBooking({ id: '2', isPaid: true }),
      createMockBooking({ id: '3', isPaid: true })
    ];

    mockedUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      setBookings: mockSetBookings
    });

    mockedUseGroupedBookings.mockReturnValue({
      unpaid: [mockBookings[0]],
      upcoming: [mockBookings[1]],
      past: [mockBookings[2]]
    });

    render(<MyTicketsPage />);

    const unpaidCount = screen.getByTestId('bookings-count-неоплаченные');
    const upcomingCount = screen.getByTestId('bookings-count-будущие сеансы');
    const pastCount = screen.getByTestId('bookings-count-прошедшие сеансы');

    expect(unpaidCount.textContent).toBe('1 bookings');
    expect(upcomingCount.textContent).toBe('1 bookings');
    expect(pastCount.textContent).toBe('1 bookings');
  });

  it('shows pay button only for unpaid bookings', () => {
    const mockBookings = [
      createMockBooking({ id: '1', isPaid: false }),
      createMockBooking({ id: '2', isPaid: true })
    ];

    mockedUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      setBookings: mockSetBookings
    });

    mockedUseGroupedBookings.mockReturnValue({
      unpaid: [mockBookings[0]],
      upcoming: [mockBookings[1]],
      past: []
    });

    render(<MyTicketsPage />);

    expect(screen.getByText('Pay 1')).toBeTruthy();
    
    const payButtons = screen.getAllByText(/Pay/);
    expect(payButtons).toHaveLength(1);
  });
});
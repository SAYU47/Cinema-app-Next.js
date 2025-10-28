import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import BookingClient from '../BookingClient/BookingClient';
import { useAuth } from '@/providers/AuthProvider';
import { bookSeats } from '@/lib/api/endpoints';
import { SessionInfo } from '@/types/booking';
import { Cinema } from '@/types/cinema';
import { Movie } from '@/types/movie';

jest.mock('next/navigation');
jest.mock('../../providers/AuthProvider');
jest.mock('../../lib/api/endpoints');
jest.mock(
  '../../components/ui/UnauthorizedWarning/UnauthorizedWarning',
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="unauthorized-warning">Unauthorized Warning</div>
    ),
  })
);
jest.mock('../../components/SeatsLegend/SeatsLegend', () => ({
  __esModule: true,
  default: () => <div data-testid="seats-legend">Seats Legend</div>,
}));

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedBookSeats = bookSeats as jest.MockedFunction<typeof bookSeats>;

const mockSession: SessionInfo = {
  id: 1,
  movieId: 1,
  cinemaId: 1,
  startTime: new Date('2024-01-01T18:00:00Z').toISOString(),
  seats: {
    rows: 2,
    seatsPerRow: 3,
  },
  bookedSeats: [{ rowNumber: 1, seatNumber: 1 }],
};

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  description: 'Test Description',
  lengthMinutes: 120,
  posterImage: 'poster.jpg',
  rating: 10,
  year: 1995,
};

const mockCinema: Cinema = {
  id: 1,
  name: 'Test Cinema',
  address: 'Test Address',
};

describe('BookingClient', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);
    mockedUseAuth.mockReturnValue({ isAuthorized: true } as any);
    mockedBookSeats.mockResolvedValue({} as any);
    window.alert = jest.fn();
  });

  it('renders booking page with session info', () => {
    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    expect(screen.getByText('Выбрать места')).toBeTruthy();
    expect(screen.getByText(/Фильм:/)).toBeTruthy();
    expect(screen.getByText(/Кинотеатр:/)).toBeTruthy();
    expect(screen.getByText(/Время:/)).toBeTruthy();
  });

  it('shows seats grid and allows selection', async () => {
    const user = userEvent.setup();
    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    expect(screen.getByText('ряд 1')).toBeTruthy();
    expect(screen.getByText('ряд 2')).toBeTruthy();

    const availableSeats = screen.getAllByText('1');
    const secondRowFirstSeat = availableSeats[1];

    await user.click(secondRowFirstSeat);

    const selectedSeatsCount = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.textContent === '1' &&
        element?.parentElement?.textContent?.includes('Выбрано мест')
      );
    });

    expect(selectedSeatsCount).toBeTruthy();
  });

  it('prevents selecting booked seats', async () => {
    const user = userEvent.setup();
    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    const bookedSeats = screen.getAllByText('1');
    const firstRowFirstSeat = bookedSeats[0];

    await user.click(firstRowFirstSeat);

    const selectedSeatsCount = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.textContent === '0' &&
        element?.parentElement?.textContent?.includes('Выбрано мест')
      );
    });

    expect(selectedSeatsCount).toBeTruthy();
  });

  it('shows warning for unauthorized users', () => {
    mockedUseAuth.mockReturnValue({ isAuthorized: false } as any);

    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    expect(screen.getByTestId('unauthorized-warning')).toBeTruthy();
  });

  it('redirects to login when unauthorized user tries to book', async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue({ isAuthorized: false } as any);

    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    await user.click(screen.getByText('Забронировать'));
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('shows alert when no seats selected', async () => {
    const user = userEvent.setup();
    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    await user.click(screen.getByText('Забронировать'));
    expect(window.alert).toHaveBeenCalledWith('Выберите хотя бы одно место');
  });

  it('handles successful booking', async () => {
    const user = userEvent.setup();
    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    const availableSeats = screen.getAllByText('1');
    const secondRowFirstSeat = availableSeats[1];

    await user.click(secondRowFirstSeat);
    await user.click(screen.getByText('Забронировать'));

    expect(mockedBookSeats).toHaveBeenCalledWith('123', {
      seats: [{ rowNumber: 2, seatNumber: 1 }],
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/my-tickets');
    });
  });

  it('shows loading state during booking', async () => {
    const user = userEvent.setup();
    let resolveBooking: (value: any) => void;
    const bookingPromise = new Promise((resolve) => {
      resolveBooking = resolve;
    });
    mockedBookSeats.mockReturnValue(bookingPromise as any);

    render(
      <BookingClient
        session={mockSession}
        sessionId="123"
        movie={mockMovie}
        cinema={mockCinema}
      />
    );

    const availableSeats = screen.getAllByText('1');
    const secondRowFirstSeat = availableSeats[1];

    await user.click(secondRowFirstSeat);
    await user.click(screen.getByText('Забронировать'));

    expect(screen.getByText('Бронируем...')).toBeTruthy();

    resolveBooking!({});
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/my-tickets');
    });
  });
});

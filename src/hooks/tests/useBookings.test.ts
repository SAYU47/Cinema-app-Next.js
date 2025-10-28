import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useBookings,
  useGroupedBookings,
  useBookingTimer,
} from '../useBookings';
import { useAuth } from '@/providers/AuthProvider';

import {
  getCinemas,
  getMovies,
  getMyTickets,
  getSettings,
} from '@/lib/api/endpoints';
import { enrichBookingsWithDetails } from '@/lib/utils/bookingHelper';
import { BookingWithMovieInfo, MyBookingSeats } from '@/types/booking';

jest.mock('../../providers/AuthProvider');
jest.mock('../../lib/api/endpoints');
jest.mock('../../lib/utils/bookingHelper');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedGetMyTickets = getMyTickets as jest.MockedFunction<
  typeof getMyTickets
>;
const mockedGetMovies = getMovies as jest.MockedFunction<typeof getMovies>;
const mockedGetCinemas = getCinemas as jest.MockedFunction<typeof getCinemas>;
const mockedGetSettings = getSettings as jest.MockedFunction<
  typeof getSettings
>;
const mockedEnrichBookings = enrichBookingsWithDetails as jest.MockedFunction<
  typeof enrichBookingsWithDetails
>;

const mockSetState = jest.fn();

describe('useBookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({ isAuthorized: true } as any);
  });

  it('should return initial loading state', () => {
    const { result } = renderHook(() => useBookings());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.bookings).toEqual([]);
  });

  it('should fetch bookings data when authorized', async () => {
    const mockBookings = [{ id: '1', isPaid: false }] as BookingWithMovieInfo[];
    const mockMovies = [{ id: 1, title: 'Movie' }] as any;
    const mockCinemas = [{ id: 1, name: 'Cinema' }] as any;
    const mockSettings = { bookingPaymentTimeSeconds: 900 } as any;

    mockedGetMyTickets.mockResolvedValue([]);
    mockedGetMovies.mockResolvedValue(mockMovies);
    mockedGetCinemas.mockResolvedValue(mockCinemas);
    mockedGetSettings.mockResolvedValue(mockSettings);
    mockedEnrichBookings.mockResolvedValue(mockBookings);

    const { result } = renderHook(() => useBookings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookings).toEqual(mockBookings);
    expect(mockedGetMyTickets).toHaveBeenCalled();
    expect(mockedEnrichBookings).toHaveBeenCalled();
  });

  it('should not fetch data when not authorized', () => {
    mockedUseAuth.mockReturnValue({ isAuthorized: false } as any);

    renderHook(() => useBookings());

    expect(mockedGetMyTickets).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockedGetMyTickets.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useBookings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookings).toEqual([]);
  });

  it('should refetch when authorization changes', async () => {
    const { rerender } = renderHook((props) => useBookings(), {
      initialProps: { isAuthorized: false },
    });

    mockedUseAuth.mockReturnValue({ isAuthorized: true } as any);
    rerender();

    await waitFor(() => {
      expect(mockedGetMyTickets).toHaveBeenCalled();
    });
  });
});

describe('useGroupedBookings', () => {
  const mockBookings = [
    { id: '1', isPaid: false, isExpired: false },
    {
      id: '2',
      isPaid: true,
      isExpired: false,
      movieSessionInfo: {
        startTime: new Date(Date.now() + 3600000).toISOString(),
      },
    },
    {
      id: '3',
      isPaid: true,
      isExpired: false,
      movieSessionInfo: {
        startTime: new Date(Date.now() - 3600000).toISOString(),
      },
    },
    { id: '4', isPaid: false, isExpired: true },
  ] as BookingWithMovieInfo[];

  it('should group bookings correctly', () => {
    const { result } = renderHook(() => useGroupedBookings(mockBookings));

    expect(result.current.unpaid).toHaveLength(1);
    expect(result.current.unpaid[0].id).toBe('1');

    expect(result.current.upcoming).toHaveLength(1);
    expect(result.current.upcoming[0].id).toBe('2');

    expect(result.current.past).toHaveLength(1);
    expect(result.current.past[0].id).toBe('3');
  });

  it('should handle empty bookings array', () => {
    const { result } = renderHook(() => useGroupedBookings([]));

    expect(result.current.unpaid).toHaveLength(0);
    expect(result.current.upcoming).toHaveLength(0);
    expect(result.current.past).toHaveLength(0);
  });

  it('should handle bookings without session info', () => {
    const bookingsWithoutSession = [
      { id: '1', isPaid: true, isExpired: false, movieSessionInfo: undefined },
    ] as BookingWithMovieInfo[];

    const { result } = renderHook(() =>
      useGroupedBookings(bookingsWithoutSession)
    );

    expect(result.current.upcoming).toHaveLength(1);
    expect(result.current.upcoming[0].id).toBe('1');
  });

  it('should filter expired unpaid bookings', () => {
    const bookingsWithExpired = [
      { id: '1', isPaid: false, isExpired: true },
      { id: '2', isPaid: false, isExpired: false },
    ] as BookingWithMovieInfo[];

    const { result } = renderHook(() =>
      useGroupedBookings(bookingsWithExpired)
    );

    expect(result.current.unpaid).toHaveLength(1);
    expect(result.current.unpaid[0].id).toBe('2');
  });
});

describe('useBookingTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not start timer when all bookings are paid', () => {
    const paidBookings = [
      { id: '1', isPaid: true, timeLeft: 100 },
    ] as BookingWithMovieInfo[];

    renderHook(() => useBookingTimer(paidBookings, mockSetState));

    jest.advanceTimersByTime(5000);

    expect(mockSetState).not.toHaveBeenCalled();
  });

  it('should not start timer when no bookings', () => {
    renderHook(() => useBookingTimer([], mockSetState));

    jest.advanceTimersByTime(5000);

    expect(mockSetState).not.toHaveBeenCalled();
  });

  it('should update timeLeft every second for unpaid bookings', () => {
    const unpaidBookings = [
      { id: '1', isPaid: false, timeLeft: 100, isExpired: false },
      { id: '2', isPaid: true, timeLeft: 50 },
    ] as BookingWithMovieInfo[];

    renderHook(() => useBookingTimer(unpaidBookings, mockSetState));

    jest.advanceTimersByTime(1000);
    expect(mockSetState).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });

  it('should mark booking as expired when timeLeft reaches 0', () => {
    const expiringBookings = [
      { id: '1', isPaid: false, timeLeft: 1, isExpired: false },
    ] as BookingWithMovieInfo[];

    mockSetState.mockImplementation((updater) => {
      const newState = updater(expiringBookings);
      return newState;
    });

    renderHook(() => useBookingTimer(expiringBookings, mockSetState));

    jest.advanceTimersByTime(1000);

    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should filter expired unpaid bookings', () => {
    const mixedBookings = [
      { id: '1', isPaid: false, timeLeft: 0, isExpired: true },
      { id: '2', isPaid: false, timeLeft: 10, isExpired: false },
    ] as BookingWithMovieInfo[];

    mockSetState.mockImplementation((updater) => {
      const newState = updater(mixedBookings);
      return newState;
    });

    renderHook(() => useBookingTimer(mixedBookings, mockSetState));

    jest.advanceTimersByTime(1000);

    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should clear timer on unmount', () => {
    const unpaidBookings = [
      { id: '1', isPaid: false, timeLeft: 100 },
    ] as BookingWithMovieInfo[];

    const { unmount } = renderHook(() =>
      useBookingTimer(unpaidBookings, mockSetState)
    );

    unmount();

    jest.advanceTimersByTime(5000);
    expect(mockSetState).not.toHaveBeenCalled();
  });
});

describe('Edge Cases', () => {
  it('should handle concurrent API calls', async () => {
    mockedUseAuth.mockReturnValue({ isAuthorized: true } as any);

    let resolvePromise: (value: any) => void;
    const promise: Promise<MyBookingSeats[]> = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedGetMyTickets.mockReturnValue(promise);

    const { result, unmount } = renderHook(() => useBookings());

    unmount();

    resolvePromise!([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('should handle bookings with null/undefined values', () => {
    const problematicBookings = [
      { id: '1', isPaid: false, isExpired: false, timeLeft: null as any },
      { id: '2', isPaid: true, isExpired: undefined },
    ] as BookingWithMovieInfo[];

    const { result } = renderHook(() =>
      useGroupedBookings(problematicBookings)
    );

    expect(result.current.unpaid).toHaveLength(1);
    expect(result.current.unpaid[0].id).toBe('1');
  });
});

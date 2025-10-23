import { 
    calculateTimeLeft, 
    createFallbackBooking, 
    getEmptyMessage,
    enrichBookingsWithDetails 
  } from '@/lib/utils/bookingHelper';
  import { getMovieSession } from '@/lib/api/endpoints';
  import { MyBookingSeats, Settings, BookingSeat } from '@/types/booking';
  import { Movie } from '@/types/movie';
  import { Cinema } from '@/types/cinema';
  
//   Мок для API
  jest.mock('../../api/endpoints', () => ({
    getMovieSession: jest.fn(),
  }));
  
  const mockedGetMovieSession = getMovieSession as jest.MockedFunction<typeof getMovieSession>;
  
  describe('calculateTimeLeft', () => {
    const mockSettings: Settings = {
      bookingPaymentTimeSeconds: 900, // 15 минут
    };
  
    const mockBookingSeat: BookingSeat = {
      rowNumber: 1,
      seatNumber: 1
    };
  
    it('should return undefined timeLeft for paid booking', () => {
      const paidBooking: MyBookingSeats = {
        id: '1',
        userId: 1,
        movieSessionId: 1,
        sessionId: 1,
        bookedAt: new Date().toISOString(),
        seats: [mockBookingSeat],
        isPaid: true,
      };
  
      const result = calculateTimeLeft(paidBooking, mockSettings);
  
      expect(result.timeLeft).toBeUndefined();
      expect(result.isExpired).toBe(false);
    });
  
    it('should calculate correct time left for unpaid booking', () => {
      const now = Date.now();
      const fiveMinutesAgo = new Date(now - 5 * 60 * 1000); // 5 минут назад
      
      const unpaidBooking: MyBookingSeats = {
        id: '1',
        userId: 1,
        movieSessionId: 1,
        sessionId: 1,
        bookedAt: fiveMinutesAgo.toISOString(),
        seats: [mockBookingSeat],
        isPaid: false,
      };
  
      const result = calculateTimeLeft(unpaidBooking, mockSettings);
  
      // Должно остаться ~10 минут (15 - 5)
      expect(result.timeLeft).toBeLessThanOrEqual(600); // 10 минут в секундах
      expect(result.timeLeft).toBeGreaterThan(590);
      expect(result.isExpired).toBe(false);
    });
  
    it('should mark as expired when time is up', () => {
      const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000); // 20 минут назад
      
      const expiredBooking: MyBookingSeats = {
        id: '1',
        userId: 1,
        movieSessionId: 1,
        sessionId: 1,
        bookedAt: twentyMinutesAgo.toISOString(),
        seats: [mockBookingSeat],
        isPaid: false,
      };
  
      const result = calculateTimeLeft(expiredBooking, mockSettings);
  
      expect(result.timeLeft).toBe(0);
      expect(result.isExpired).toBe(true);
    });
  
    it('should handle edge case with exact deadline', () => {
      const now = Date.now();
      const exactlyFifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
      
      const edgeCaseBooking: MyBookingSeats = {
        id: '1',
        userId: 1,
        movieSessionId: 1,
        sessionId: 1,
        bookedAt: exactlyFifteenMinutesAgo.toISOString(),
        seats: [mockBookingSeat],
        isPaid: false,
      };
  
      const result = calculateTimeLeft(edgeCaseBooking, mockSettings);
  
      expect(result.timeLeft).toBe(0);
      expect(result.isExpired).toBe(true);
    });
  });
  
  describe('createFallbackBooking', () => {
    const mockBookingSeat: BookingSeat = {
      rowNumber: 1,
      seatNumber: 1
    };
  
    it('should create fallback booking with correct structure', () => {
      const originalBooking: MyBookingSeats = {
        id: '1',
        userId: 1,
        movieSessionId: 123,
        sessionId: 1,
        bookedAt: new Date().toISOString(),
        seats: [mockBookingSeat],
        isPaid: false,
      };
  
      const fallback = createFallbackBooking(originalBooking);
  
      expect(fallback.id).toBe('1');
      expect(fallback.movieSessionInfo).toBeUndefined();
      expect(fallback.movieTitle).toBe('Фильм #123');
      expect(fallback.cinemaName).toBe('Кинотеатр');
      expect(fallback.timeLeft).toBeUndefined();
      expect(fallback.isExpired).toBe(false);
      expect(fallback.seats).toEqual([mockBookingSeat]);
    });
  
    it('should preserve all original booking properties', () => {
      const originalBooking: MyBookingSeats = {
        id: 'test-id',
        userId: 42,
        movieSessionId: 999,
        sessionId: 2,
        bookedAt: '2023-01-01T10:00:00Z',
        seats: [{ rowNumber: 2, seatNumber: 5 }],
        isPaid: true,
      };
  
      const fallback = createFallbackBooking(originalBooking);
  
      expect(fallback.id).toBe('test-id');
      expect(fallback.userId).toBe(42);
      expect(fallback.movieSessionId).toBe(999);
      expect(fallback.sessionId).toBe(2);
      expect(fallback.bookedAt).toBe('2023-01-01T10:00:00Z');
      expect(fallback.seats).toEqual([{ rowNumber: 2, seatNumber: 5 }]);
      expect(fallback.isPaid).toBe(true);
    });
  });
  
  describe('getEmptyMessage', () => {
    it('should return correct message for unpaid section', () => {
      expect(getEmptyMessage('unpaid')).toBe('🎉 Нет неоплаченных билетов');
    });
  
    it('should return correct message for upcoming section', () => {
      expect(getEmptyMessage('upcoming')).toBe('📋 У вас нет предстоящих сеансов');
    });
  
    it('should return correct message for past section', () => {
      expect(getEmptyMessage('past')).toBe('🕒 У вас еще нет прошедших сеансов');
    });
  
    it('should return default message for unknown section', () => {
      expect(getEmptyMessage('unknown')).toBe('Нет данных');
      expect(getEmptyMessage('')).toBe('Нет данных');
      expect(getEmptyMessage('random')).toBe('Нет данных');
    });
  });
  
  describe('enrichBookingsWithDetails', () => {
    const mockSettings: Settings = {
      bookingPaymentTimeSeconds: 900,
    };
  
    const mockBookingSeat: BookingSeat = {
      rowNumber: 1,
      seatNumber: 1
    };
  
    const mockMovies: Movie[] = [
        { id: 1, title: 'Тестовый фильм', year: 1995, rating: 9, lengthMinutes: 120, description: 'описание фильма', posterImage: '' },
      ];
    
      const mockCinemas: Cinema[] = [
        { id: 1, name: 'Тестовый кинотеатр', address: '' },
      ];
  
    const mockBookings: MyBookingSeats[] = [
      {
        id: '1',
        userId: 1,
        movieSessionId: 1,
        sessionId: 1,
        bookedAt: new Date().toISOString(),
        seats: [mockBookingSeat],
        isPaid: false,
      },
    ];
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should enrich bookings with movie and cinema details', async () => {
      const mockSessionInfo = {
        id: 1,
        movieId: 1,
        cinemaId: 1,
        hallId: 1,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        format: '2D',
        basePrice: 500,
      };
  
      mockedGetMovieSession.mockResolvedValue(mockSessionInfo as any);
  
      const result = await enrichBookingsWithDetails(
        mockBookings,
        mockMovies,
        mockCinemas,
        mockSettings
      );
  
      expect(result[0].movieTitle).toBe('Тестовый фильм');
      expect(result[0].cinemaName).toBe('Тестовый кинотеатр');
      expect(result[0].movieSessionInfo).toEqual(mockSessionInfo);
      expect(result[0].timeLeft).toBeDefined();
      expect(result[0].isExpired).toBeDefined();
      expect(mockedGetMovieSession).toHaveBeenCalledWith(1);
    });
  
    it('should create fallback when API call fails', async () => {
      mockedGetMovieSession.mockRejectedValue(new Error('API Error'));
  
      const result = await enrichBookingsWithDetails(
        mockBookings,
        mockMovies,
        mockCinemas,
        mockSettings
      );
  
      expect(result[0].movieTitle).toBe('Фильм #1');
      expect(result[0].cinemaName).toBe('Кинотеатр');
      expect(result[0].movieSessionInfo).toBeUndefined();
      expect(result[0].isExpired).toBe(false);
    });
  
    it('should handle missing movie and cinema data', async () => {
      const mockSessionInfo = {
        id: 1,
        movieId: 999, // Несуществующий ID
        cinemaId: 999, // Несуществующий ID
        hallId: 1,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        format: '2D',
        basePrice: 500,
      };
  
      mockedGetMovieSession.mockResolvedValue(mockSessionInfo as any);
  
      const result = await enrichBookingsWithDetails(
        mockBookings,
        mockMovies,
        mockCinemas,
        mockSettings
      );
  
      expect(result[0].movieTitle).toBe('Фильм #999');
      expect(result[0].cinemaName).toBe('Кинотеатр #999');
      expect(result[0].movieSessionInfo).toEqual(mockSessionInfo);
    });
  
    it('should process multiple bookings correctly', async () => {
      const multipleBookings: MyBookingSeats[] = [
        {
          id: '1',
          userId: 1,
          movieSessionId: 1,
          sessionId: 1,
          bookedAt: new Date().toISOString(),
          seats: [mockBookingSeat],
          isPaid: false,
        },
        {
          id: '2', 
          userId: 1,
          movieSessionId: 2,
          sessionId: 2,
          bookedAt: new Date().toISOString(),
          seats: [mockBookingSeat],
          isPaid: true,
        }
      ];
  
      const mockSessionInfo1 = {
        id: 1,
        movieId: 1,
        cinemaId: 1,
        hallId: 1,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        format: '2D',
        basePrice: 500,
      };
  
      const mockSessionInfo2 = {
        id: 2,
        movieId: 1, 
        cinemaId: 1,
        hallId: 2,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        format: '3D',
        basePrice: 700,
      };
  
      mockedGetMovieSession
        .mockResolvedValueOnce(mockSessionInfo1 as any)
        .mockResolvedValueOnce(mockSessionInfo2 as any);
  
      const result = await enrichBookingsWithDetails(
        multipleBookings,
        mockMovies,
        mockCinemas,
        mockSettings
      );
  
      expect(result).toHaveLength(2);
      expect(result[0].movieSessionInfo).toEqual(mockSessionInfo1);
      expect(result[1].movieSessionInfo).toEqual(mockSessionInfo2);
      // У оплаченного бронирования не должно быть timeLeft
      expect(result[1].timeLeft).toBeUndefined();
      expect(result[1].isExpired).toBe(false);
    });
  
    it('should handle empty bookings array', async () => {
      const result = await enrichBookingsWithDetails(
        [],
        mockMovies,
        mockCinemas,
        mockSettings
      );
  
      expect(result).toEqual([]);
      expect(mockedGetMovieSession).not.toHaveBeenCalled();
    });
  
    it('should preserve original booking data when enriching', async () => {
      const originalBooking: MyBookingSeats = {
        id: 'original-id',
        userId: 99,
        movieSessionId: 5,
        sessionId: 10,
        bookedAt: '2023-12-01T15:00:00Z',
        seats: [{ rowNumber: 3, seatNumber: 7 }],
        isPaid: false,
      };
  
      const mockSessionInfo = {
        id: 5,
        movieId: 1,
        cinemaId: 1,
        hallId: 1,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        format: '2D',
        basePrice: 500,
      };
  
      mockedGetMovieSession.mockResolvedValue(mockSessionInfo as any);
  
      const result = await enrichBookingsWithDetails(
        [originalBooking],
        mockMovies,
        mockCinemas,
        mockSettings
      );
  
      expect(result[0].id).toBe('original-id');
      expect(result[0].userId).toBe(99);
      expect(result[0].movieSessionId).toBe(5);
      expect(result[0].sessionId).toBe(10);
      expect(result[0].bookedAt).toBe('2023-12-01T15:00:00Z');
      expect(result[0].seats).toEqual([{ rowNumber: 3, seatNumber: 7 }]);
      expect(result[0].isPaid).toBe(false);
    });
  });
import { getCinemaSessions, getCinemas, getMovies } from '@/lib/api/endpoints';
import Link from 'next/link';

import { Cinema, CinemaSession } from '@/types/cinema';
import { Movie } from '@/types/movie';

import CinemaPage from '@/components/CinemaPage/CinemaPage';
import { groupSessionsByDate } from '@/lib/utils/bookingHelper';

interface CinemaDetailsPageProps {
  params: {
    cinemaId: string;
  };
}

export default async function CinemaDetailsPage({
  params,
}: CinemaDetailsPageProps) {
  const cinemaId = params.cinemaId;

  let cinema: Cinema | undefined;
  let sessions: CinemaSession[] = [];
  let error: Error | null = null;
  let movies: Movie[] = [];
  let allCinemas: Cinema[] = [];

  try {
    [sessions, allCinemas, movies] = await Promise.all([
      getCinemaSessions(cinemaId),
      getCinemas(),
      getMovies(),
    ]);
    cinema = allCinemas.find((c) => c.id.toString() === cinemaId);
  } catch (err) {
    error = err as Error;
  }

  if (error || !cinema) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full mt-[60px] min-lg:mt-0">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error ? `Ошибка: ${error.message}` : 'Кинотеатр не найден'}
          </h1>
          <Link
            href="/cinema/cinemas"
            className="text-blue-600 hover:underline"
          >
            Вернуться к списку кинотеатров
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcomingSessions = sessions.filter(
    (session) => new Date(session.startTime) > now
  );

  const groupedSessions =
    upcomingSessions && upcomingSessions.length > 0
      ? groupSessionsByDate(upcomingSessions)
      : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full mt-[60px] min-lg:mt-0">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/cinema/cinemas"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Назад к кинотеатрам
        </Link>

        <CinemaPage
          cinema={cinema}
          upcomingSessions={upcomingSessions}
          groupedSessions={groupedSessions}
          movies={movies}
        />
      </div>
    </div>
  );
}

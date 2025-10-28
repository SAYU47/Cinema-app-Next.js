import { getCinemas, getMovieSession, getMovies } from '@/lib/api/endpoints';
import BookingClient from '@/components/BookingClient/BookingClient';
import Link from 'next/link';

interface BookingPageProps {
  params: {
    sessionId: string;
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { sessionId } = params;
  let movie;
  let cinema;
  try {
    const session = await getMovieSession(sessionId);
    const movies = await getMovies();
    const allCinemas = await getCinemas();
    cinema = allCinemas.find((c) => c.id === session.cinemaId);
    movie = movies.find((m) => m.id === session.movieId);
    return (
      <BookingClient
        cinema={cinema}
        movie={movie}
        session={session}
        sessionId={sessionId}
      />
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full mt-[60px] min-lg:mt-0">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Ошибка загрузки данных сеанса
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Вернуться к фильмам
          </Link>
        </div>
      </div>
    );
  }
}

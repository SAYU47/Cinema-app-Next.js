// app/cinema/movies/[movieId]/page.tsx
import { getCinemas, getMovies, getSessionsById } from '@/lib/api/endpoints';
import { SesionsByIdResponse } from '@/types/endpoints';
import { Cinema } from '@/types/cinema';
import { Movie } from '@/types/movie';
import MovieDetailsClient from '@/components/MovieDetailsClient/MovieDetailsClient';

interface MovieDetailsPageProps {
  params: {
    movieId: string;
  };
}

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const movieId = params.movieId;

  let movie: Movie | undefined;
  let sessions: SesionsByIdResponse[] = [];
  let error: Error | null = null;
  let cinemas: Cinema[] = [];

  try {
    [sessions, cinemas] = await Promise.all([
      getSessionsById(movieId),
      getCinemas(),
    ]);

    const movies = await getMovies();
    movie = movies.find((m) => m.id === Number(movieId));
  } catch (err) {
    error = err as Error;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error ? `Ошибка: ${error.message}` : 'Фильм не найден'}
          </h1>
          <a href="/cinema/movies" className="text-blue-600 hover:underline">
            Вернуться к списку фильмов
          </a>
        </div>
      </div>
    );
  }

  return (
    <MovieDetailsClient movie={movie} sessions={sessions} cinemas={cinemas} />
  );
}

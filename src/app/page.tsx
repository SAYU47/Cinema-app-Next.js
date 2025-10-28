import { getMovies } from '@/lib/api/endpoints';
import MovieCard from '@/components/MovieCard/MovieCard';

export default async function Home() {
  let movies;
  let error = null;

  try {
    movies = await getMovies();
  } catch (err) {
    error = err as Error;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">
            <p>Ошибка при загрузке фильмов: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Все фильмы</h1>
          <p className="text-xl text-gray-600">
            Выберите фильм для бронирования билетов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {!movies ||
          (movies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Фильмы не найдены</p>
            </div>
          ))}
      </div>
    </div>
  );
}

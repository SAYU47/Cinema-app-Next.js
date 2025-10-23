import { getCinemaSessions, getCinemas, getMovies } from '@/lib/api/endpoints';
import Link from 'next/link';
import Image from 'next/image';
import { getMoviePosterUrl } from '@/lib/utils/movieUtils';
import { Cinema, CinemaSession } from '@/types/cinema';
import { Movie } from '@/types/movie';
import { SesionsByIdResponse } from '@/types/endpoints';

interface CinemaDetailsPageProps {
  params: {
    cinemaId: string;
  };
}

const groupSessionsByDate = (sessions: SesionsByIdResponse[]) => {
  const grouped: { [key: string]: SesionsByIdResponse[] } = {};
  
  sessions.forEach(session => {
    const date = new Date(session.startTime);
    const dateKey = date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(session);
  });
  
  return grouped;
};

const groupSessionsByMovie = (sessions: SesionsByIdResponse[]) => {
  const grouped: { [key: string]: SesionsByIdResponse[] } = {};
  
  sessions.forEach(session => {
    const movieId = session.movieId;
    
    if (!grouped[movieId]) {
      grouped[movieId] = [];
    }
    
    grouped[movieId].push(session);
  });
  
  return grouped;
};

export default async function CinemaDetailsPage({ params }: CinemaDetailsPageProps) {
  const cinemaId = params.cinemaId;

  let cinema;
  let sessions: CinemaSession[] = [];
  let error = null;
  let movies: Movie[] = [];
  let allCinemas: Cinema[] = [];

  try {
    sessions = await getCinemaSessions(cinemaId); 
    allCinemas = await getCinemas();
    cinema = allCinemas.find(c => c.id.toString() === cinemaId);
    movies = await getMovies();
  } catch (err) {
    error = err as Error;
  }
  
  if (error || !cinema) {
   
    return (
      <div className="min-h-screen bg-gray-50 p-8 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error ? `Ошибка: ${error.message}` : 'Кинотеатр не найден'}
          </h1>
          <Link href="/cinema/cinemas" className="text-blue-600 hover:underline">
            Вернуться к списку кинотеатров
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcomingSessions = sessions.filter(session => 
    new Date(session.startTime) > now
  );

  const groupedSessions = upcomingSessions && upcomingSessions.length > 0 
    ? groupSessionsByDate(upcomingSessions)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/cinema/cinemas" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Назад к кинотеатрам
        </Link>


        <div className="bg-white rounded-xl shadow-lg p-2 mb-2">
          <div className="flex flex-col gap-8 items-center">
 
            <div className="flex-shrink-0">
              
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {cinema.name}
              </h1>

              <div className="space-y-4 mb-6">
        
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ближайшие сеансы</h2>
            <span className="text-sm text-gray-500">
              Всего сеансов: {upcomingSessions.length}
            </span>
          </div>

          {groupedSessions ? (
            <div className="space-y-8">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <div key={date} className="border-b border-gray-200 pb-6 last:border-b-0">
          
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {date}
                  </h3>
                  
    
                  <div className="border-t border-gray-300 mb-4"></div>
                  

                  {Object.entries(groupSessionsByMovie(dateSessions)).map(([movieId, movieSessions]) => {
                    const movie = movies.find(m => m.id.toString() === movieId);
                    
                    return (
                      <div key={movieId} className="mb-4 last:mb-0 flex ">
                        <div className="flex items-center gap-4 mb-4 w-80">
                          {movie && (
                            <>
                              <div className="flex-shrink-0 relative w-16 h-24">
                                <Image 
                                  src={getMoviePosterUrl(movie.posterImage)}
                                  alt={movie.title}
                                  fill
                                  className="object-cover rounded-lg shadow-sm"
                                  sizes="64px"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-700 mb-1">
                                  {movie.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{movie.lengthMinutes} мин</span>
                                  <span>⭐ {movie.rating}</span>
                                  <span>{movie.year}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
               
                        <div className="flex flex-wrap gap-3 ml-10 items-center ">
                          {movieSessions.map((session) => (
                            <Link
                              key={session.id}
                              href={`/cinema/booking/${session.id}`}
                              className="inline-flex flex-col items-center justify-center h-fit p-2   bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 min-w-[100px] "
                            >
                              <span className="text-lg font-bold text-blue-700 group-hover:text-blue-800">
                                {new Date(session.startTime).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">Ближайшие сеансы не найдены</p>
              <p className="text-gray-400 text-sm">Возможно, сеансы появятся позже</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
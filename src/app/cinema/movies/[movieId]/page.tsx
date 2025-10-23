import { getCinemas, getMovies, getSessionsById } from '@/lib/api/endpoints';
import {  SesionsByIdResponse } from '@/types/endpoints' 

import Link from 'next/link';
import Image from 'next/image';
import { getMoviePosterUrl } from '@/lib/utils/movieUtils';
import { Cinema } from '@/types/cinema';

interface MovieDetailsPageProps {
  params: {
    movieId: string;
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

const groupSessionsByCinema = (sessions: SesionsByIdResponse[]) => {
  const grouped: { [key: string]: SesionsByIdResponse[] } = {};
  
  sessions.forEach(session => {
    const cinemaId = session.cinemaId;
    
    if (!grouped[cinemaId]) {
      grouped[cinemaId] = [];
    }
    
    grouped[cinemaId].push(session);
  });
  
  return grouped;
};

const filterPastSessions = (sessions: SesionsByIdResponse[]) => {
  const now = new Date();
  return sessions.filter(session => {
    const sessionTime = new Date(session.startTime);
    return sessionTime > now;
  });
};

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movieId = params.movieId;

  let movie
  let sessions: SesionsByIdResponse[] = [];
  let error = null;
  let cinemas: Cinema[] = []
  try {
    sessions = await getSessionsById(movieId); 
    const movies = await getMovies()
    movie = movies.find((movie) => movie.id === Number(movieId))
    cinemas = await getCinemas()
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
          <Link href="/cinema/movies" className="text-blue-600 hover:underline">
            Вернуться к списку фильмов
          </Link>
        </div>
      </div>
    );
  }

  const posterUrl = getMoviePosterUrl(movie.posterImage);

  const upcomingSessions = filterPastSessions(sessions);
  
  const groupedSessions = upcomingSessions && upcomingSessions.length > 0 
    ? groupSessionsByDate(upcomingSessions)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/cinema/movies" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Назад к фильмам
        </Link>

    
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 relative w-64 h-96">
              <Image 
                src={posterUrl}
                alt={movie?.title || ''}
                width={300}
                height={400}  
                className="object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Детали фильма */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {movie.title}
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-600">Рейтинг:</span>
                  <span className="ml-2 font-semibold">⭐ {movie.rating}/10</span>
                </div>
                <div>
                  <span className="text-gray-600">Год:</span>
                  <span className="ml-2 font-semibold">{movie.year}</span>
                </div>
                <div>
                  <span className="text-gray-600">Длительность:</span>
                  <span className="ml-2 font-semibold">{movie.lengthMinutes} мин</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                <p className="text-gray-700 leading-relaxed">{movie.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Сеансы с новой структурой */}    
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
           
                  {Object.entries(groupSessionsByCinema(dateSessions)).map(([cinemaId, cinemaSessions]) => (
                    <div key={cinemaId} className="mb-6 last:mb-0">
            
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">
                
                        {cinemas?.find((cinema)=> cinema.id === Number(cinemaId))?.name }
                      </h4>
                      
                     
                      <div className="flex flex-wrap gap-3">
                        {cinemaSessions.map((session) => (
                          <Link
                            key={session.id}
                            href={`/cinema/booking/${session.id}`}
                            className="inline-flex flex-col items-center justify-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 min-w-[100px] group"
                          >
                            <span className="text-lg font-bold  group-hover:text-blue-800">
                              {new Date(session.startTime).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
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
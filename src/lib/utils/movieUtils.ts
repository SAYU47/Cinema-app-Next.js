export const getMoviePosterUrl = (posterImage: string): string => {
    return `http://localhost:3022${posterImage}`;
  };
  
  // Дополнительные утилиты для работы с фильмами
  export const formatMovieDuration = (minutes: number): string => {
    return `${minutes} мин`;
  };
  
  export const formatMovieRating = (rating: number): string => {
    return `⭐ ${rating}`;
  };
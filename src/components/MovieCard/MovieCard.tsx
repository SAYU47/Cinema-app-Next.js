import Link from "next/link";
import { Movie } from "@/types/movie";
import Image from "next/image";
import { getMoviePosterUrl } from "@/lib/utils/movieUtils";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getMoviePosterUrl(movie.posterImage);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
      <div className="relative">
        <div className="display-block">
          <Image
            src={posterUrl}
            alt={movie.title}
            width={300}
            height={400}
            quality={100}
            className="object-cover static"
            priority={false}
          />
        </div>
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm font-semibold">
          ⭐ {movie.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs">
          {movie.lengthMinutes} мин
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>{movie.year}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {movie.description}
        </p>

        <Link
          href={`/cinema/movies/${movie.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium "
        >
          Сеансы
        </Link>
      </div>
    </div>
  );
}

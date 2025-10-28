'use client';
import { Cinema } from '@/types/cinema';
import { Movie } from '@/types/movie';
import { SessionInfo } from '@/types/booking';

interface BookingHeaderProps {
  session: SessionInfo;
  movie?: Movie;
  cinema?: Cinema;
}

export default function BookingHeader({
  session,
  movie,
  cinema,
}: BookingHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Выбрать места</h1>

      <p className="text-gray-600">
        <b>Фильм:</b> {movie?.title}
      </p>
      <p className="text-gray-600">
        <b>Кинотеатр:</b> {cinema?.name}
      </p>
      <p className="text-gray-600">
        <b>Время:</b> {new Date(session.startTime).toLocaleString('ru-RU')}
      </p>
    </div>
  );
}

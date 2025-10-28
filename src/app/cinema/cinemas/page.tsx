import { getCinemas } from '@/lib/api/endpoints';
import Link from 'next/link';

export default async function CinemasPage() {
  let cinemas;
  let error = null;

  try {
    cinemas = await getCinemas();
  } catch (err) {
    error = err as Error;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">
            <p>Ошибка при загрузке кинотеатров: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Кинотеатры</h1>
        </div>

        <div className="bg-white rounded-lg ">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Кинотеатр
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Адрес
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {cinemas?.map((cinema) => (
                  <tr key={cinema.id} className=" hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {cinema.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {cinema.address}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/cinema/cinemas/${cinema.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                      >
                        Сеансы
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!cinemas || cinemas.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500">Кинотеатры не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

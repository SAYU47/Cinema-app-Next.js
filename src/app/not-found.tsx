import Link from "next/link";

export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 w-full">
        <h2 className="text-2xl font-bold">404 - Страница не найдена</h2>
        <p>Извините, запрашиваемая страница не существует.</p>
        <Link href="/" className="mt-4 text-blue-500 hover:underline">
          Вернуться на главную
        </Link>
      </div>
    )
  }
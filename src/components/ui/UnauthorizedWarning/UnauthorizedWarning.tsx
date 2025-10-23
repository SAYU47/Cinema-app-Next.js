import Link from "next/link";

export default function UnauthorizedWarning() {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">
          ⚠️ Для бронирования мест нужна <Link href={'/auth/login'} className=" hover:underline"><b>Авторизация</b></Link>
        </p>  
      </div>
    );
  }
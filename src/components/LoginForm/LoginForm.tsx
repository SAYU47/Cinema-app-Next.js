"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input/Input";
import { loginSchema, LoginFormData } from "../../lib/validation-schema";
import { useState } from "react";
import CustomButton from "../ui/CustomButton/CustomButton";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Временная заглушка для демонстрации
      if (data.username === "demo" && data.password === "demo123") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", data.username);
        router.push("/my-tickets");
      } else {
        setServerError(
          "Неверный логин или пароль. Проверьте введенные данные и попробуйте снова"
        );
      }
    } catch (err) {
      setServerError("Произошла ошибка при авторизации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full ">
      {/* Карточка */}
      <div className="bg-white/10  bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            🎬
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Вход в систему</h1>
          <p className="text-gray-300">Авторизация по username и password</p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Поле username */}
          <Input
            label="Логин"
            {...register("username")}
            error={errors.username}
            fullWidth
            placeholder="Введите ваш логин"
            className="bg-white/5 border-white/10 text-white placeholder-gray-400
                       focus:border-purple-500 focus:ring-purple-500"
          />

          {/* Поле password */}
          <Input
            label="Пароль"
            type="password"
            {...register("password")}
            error={errors.password}
            fullWidth
            placeholder="Введите ваш пароль"
            className="bg-white/5 border-white/10 text-white placeholder-gray-400
                       focus:border-purple-500 focus:ring-purple-500"
          />

          {/* Кнопка отправки */}
          <CustomButton type="submit" isLoading={isLoading}>
            Вход
          </CustomButton>

          {/* Ошибка сервера */}
          {serverError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-red-400">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{serverError}</span>
              </div>
            </div>
          )}
        </form>

        {/* Демо данные */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400 text-sm text-center">
            Для тестирования используйте:
            <br />
            <strong>username:</strong> demo
            <br />
            <strong>password:</strong> demo123
          </p>
        </div>

        {/* Ссылка на регистрацию */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Нет аккаунта?{" "}
            <Link
              href="/auth/register"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-semibold"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

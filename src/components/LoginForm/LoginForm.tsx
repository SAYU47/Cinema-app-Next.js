"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input/Input";
import { loginSchema, LoginFormData } from "@/lib/validation-schema";
import CustomButton from "@/components/ui/CustomButton/CustomButton";
import { useLoginMutation } from "@/hooks/apiHooks";
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Используем мутацию из React Query
  const loginMutation = useLoginMutation();

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
    try {
      // Выполняем мутацию
      const result = await loginMutation.mutateAsync(data);
      console.log(result)
      // Используем метод login из контекста для обновления глобального состояния
      login(data.username, result.token);
      
      // Перенаправляем на страницу билетов после успешного входа
      router.push("/my-tickets");
      
    } catch (err) {
      // Ошибка обрабатывается автоматически в onError мутации
      console.error('Login error:', err);
    }
  };

  // Получаем состояние загрузки и ошибку из мутации
  const isLoading = loginMutation.isPending;
  const serverError = loginMutation.error?.message;

  return (
    <div className="w-full">
      {/* Карточка */}
      <div className="bg-white/10 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
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
          <CustomButton 
            type="submit" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
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

          {/* Успешный вход */}
          {loginMutation.isSuccess && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-green-400">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Вход успешен! Перенаправляем...</span>
              </div>
            </div>
          )}
        </form>

        {/* Демо данные (можно убрать после подключения реального API) */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400 text-sm text-center mb-2">
            Для тестирования используйте:
          </p>
          <div className="text-gray-400 text-sm space-y-1 text-center">
            <div><strong>username:</strong> demo</div>
            <div><strong>password:</strong> demo123</div>
          </div>
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
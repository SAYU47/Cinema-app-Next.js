"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input/Input";
import { registerSchema, RegisterFormData } from "@/lib/validation-schema";
import CustomButton from "@/components/ui/CustomButton/CustomButton";
import { useLoginMutation, useRegisterMutation } from "@/hooks/apiHooks";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();


  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      const result = await loginMutation.mutateAsync(data);
      login(data.username, result.token);
      router.push("/my-tickets");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const isLoading = registerMutation.isPending;
  const serverError = registerMutation.error?.message;

  return (
    <div className="w-full">
      <div className="bg-white/10 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            🎭
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Регистрация</h1>
          <p className="text-gray-300">Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Логин"
            {...register("username")}
            error={errors.username}
            fullWidth
            placeholder="Придумайте логин"
            className="bg-white/5 border-white/10 text-white placeholder-gray-400
                     focus:border-purple-500 focus:ring-purple-500"
          />

          <Input
            label="Пароль"
            type="password"
            {...register("password")}
            error={errors.password}
            fullWidth
            placeholder="Придумайте пароль"
            className="bg-white/5 border-white/10 text-white placeholder-gray-400
                     focus:border-purple-500 focus:ring-purple-500"
          />

          <Input
            label="Повторите пароль"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
            fullWidth
            placeholder="Повторите ваш пароль"
            className="bg-white/5 border-white/10 text-white placeholder-gray-400
                     focus:border-purple-500 focus:ring-purple-500"
          />

          <CustomButton
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </CustomButton>

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

          {registerMutation.isSuccess && (
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
                <span className="text-sm">
                  Регистрация успешна! Перенаправляем...
                </span>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Уже есть аккаунт?{" "}
            <Link
              href="/auth/login"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-semibold"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

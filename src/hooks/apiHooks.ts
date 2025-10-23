import { useMutation, useQuery } from '@tanstack/react-query';
import { registerUser, loginUser, getMovies } from '@/lib/api/endpoints';
import { RegisterFormData } from '@/lib/validation-schema';
import { RegisterResponse, LoginResponse, MovieResponse, ApiError} from '@/types/endpoints'


export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, ApiError, RegisterFormData>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Регистрация успешна:', data);
 
    },
    onError: (error) => {
      console.error('Ошибка регистрации:', error.message);
    },
  });
};


export const useLoginMutation = () => {
  return useMutation<LoginResponse, ApiError, { username: string; password: string }>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('Вход успешен:', data);
   
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
    },
    onError: (error) => {
      console.error('Ошибка входа:', error.message);
    },
  });
};

export const useMovies = () => {
  return useQuery<MovieResponse[], ApiError> ({
    queryKey: ['movies'],
    queryFn: getMovies,
  });
};

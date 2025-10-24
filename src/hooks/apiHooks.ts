import { useMutation, useQuery } from '@tanstack/react-query';
import { registerUser, loginUser, getMovies } from '@/lib/api/endpoints';
import { RegisterFormData } from '@/lib/validation-schema';
import { RegisterResponse, LoginResponse, ApiError} from '@/types/endpoints'
import { Movie } from '@/types/movie'
import { toast } from 'sonner';


export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, ApiError, RegisterFormData>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success('Регистрация успешна');
 
    },
    onError: (error) => {
      toast.error(`Ошибка Регистрации: ${error.message}`);
    },
  });
};


export const useLoginMutation = () => {
  return useMutation<LoginResponse, ApiError, { username: string; password: string }>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success('Вход выполнен');
   
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
    },
    onError: (error) => {
      toast.error(`Ошибка входа: ${error.message}`);
    },
  });
};

export const useMovies = () => {
  return useQuery<Movie[], ApiError> ({
    queryKey: ['movies'],
    queryFn: getMovies,
  });
};

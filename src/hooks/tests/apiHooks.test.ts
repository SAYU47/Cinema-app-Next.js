import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useLoginMutation, useRegisterMutation } from '../apiHooks';
import { registerUser, loginUser } from '@/lib/api/endpoints';
import { RegisterFormData } from '@/lib/validation-schema';
import React from 'react';

jest.mock('../../lib/api/endpoints', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };

  return Wrapper;
};

describe('useRegisterMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('должен успешно зарегистрировать пользователя', async () => {
    const mockData: RegisterFormData = {
      username: 'testuser',
      password: 'testpass',
      confirmPassword: 'testpass',
    };
    const mockResponse = {
      id: '1',
      username: 'testuser',
      message: 'Регистрация успешна',
    };

    (registerUser as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  it('должен вернуть ошибку при неудачной регистрации', async () => {
    const mockData: RegisterFormData = {
      username: 'testuser',
      password: 'testpass',
      confirmPassword: 'testpass',
    };
    const mockError = new Error('Ошибка сервера');
    (registerUser as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Ошибка сервера');
  });
});

describe('useLoginMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('должен успешно выполнить вход и сохранить токен', async () => {
    const mockData = { username: 'testuser', password: 'testpass' };
    const mockResponse = {
      id: '1',
      username: 'testuser',
      token: 'fake-token',
      message: 'Вход успешен',
    };
    (loginUser as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'authToken',
      'fake-token'
    );
  });

  it('должен вернуть ошибку при неудачном входе', async () => {
    const mockData = { username: 'wronguser', password: 'wrongpass' };
    const mockError = new Error('Неправильный логин или пароль');
    (loginUser as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Неправильный логин или пароль');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});

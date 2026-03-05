// src/shared/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

// Схема валидации (Zod) - защищаем приложение от кривых данных с бэка
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  reward: z.number(),
  isCompleted: z.boolean(),
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Tasks', 'User'], // Теги для автоматического обновления кэша!
  endpoints: (builder) => ({
    getTasks: builder.query<z.infer<typeof TaskSchema>[], void>({
      query: () => '/tasks',
      providesTags: ['Tasks'], // Этот запрос "подписывается" на тег
    }),
    completeTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'POST' }),
      invalidatesTags: ['Tasks', 'User'], // Магия! Обновит список задач и баланс юзера везде
    }),
  }),
});
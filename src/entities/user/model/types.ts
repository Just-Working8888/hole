// src/entities/user/model/types.ts

export interface User {
  id: string;
  username: string;
  balance: number;
  level: number;
}

// Используем Mapped Types для создания разрешений (Permissions)
// Все поля User становятся булевыми флагами
export type UserPermissions = {
  [K in keyof User]: boolean;
};

// Пример: { id: true, username: true, balance: true, level: true }
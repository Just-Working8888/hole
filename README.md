# HOL () — Telegram Mini App / Web3 Wallet 💎

Современный интерфейс крипто-кошелька для блокчейна **TON**, созданный в формате **Telegram Mini App (TMA)**. Проект сфокусирован на премиальном дизайне (Glassmorphism), высокой производительности и строгой архитектуре.

## 🌟 Особенности (Features)

- **Архитектура FSD (Feature-Sliced Design):** Строгое разделение логики на слои (`app`, `widgets`, `features`, `entities`, `shared`) для масштабируемости кодовой базы.
- **Интеграция с TON:** Получение данных аккаунта и истории транзакций через **TonAPI v2**.
- **Премиальный UI/UX:**
  - Эффекты Glassmorphism (матовое стекло, размытие).
  - Плавные анимации и skeleton-загрузки.
  - Современная типографика (шрифт _Space Grotesk_).
  - Мобильная навигация (`BottomNav`) с поддержкой `safe-area-inset` для iOS.
- **Smart Data Mapping:** Умный парсинг сырых транзакций в чистый UI (определение направления перевода +/-, подвязка иконок Jetton-ов, форматирование дат).
- **Type Safety:** Строгая типизация всех ответов от API без использования `any` (Zod + TypeScript).
- **State Management:** Эффективное кеширование и управление состоянием через **Redux Toolkit (RTK Query)**.

## 🛠 Технологический стек

- **Фреймворк:** Next.js 15 (App Router)
- **Библиотека:** React 19
- **Язык:** TypeScript
- **Стилизация:** Vanilla SCSS Modules + CSS Variables (Без Tailwind)
- **Стейт/Запросы:** Redux Toolkit + RTK Query
- **Анимации:** CSS Transitions & Keyframes
- **API:** [TonAPI v2](https://tonapi.io/)

## 📂 Структура проекта (FSD)

```text
src/
├── app/                  # Инициализация, роутинг (Next.js App Router), провайдеры
├── widgets/              # Композиционные блоки: WalletCard, BottomNav
├── features/             # Пользовательские сценарии: история транзакций, Auth, отправка/получение
├── entities/             # Бизнес-сущности: Wallet, Transaction (типы, мапперы, UI-компоненты карточек)
└── shared/               # Переиспользуемый код: UI-kit (Button, Modal, Skeleton), API конф.
```

## 🚀 Быстрый старт

1. Склонируйте репозиторий:

   ```bash
   git clone https://github.com/yourusername/hol-wallet.git
   cd hol-wallet
   ```

2. Установите зависимости:

   ```bash
   npm install
   # или yarn install / pnpm install
   ```

3. Запустите dev-сервер:

   ```bash
   npm run dev
   ```

4. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## ⚙️ Команды разработчика

- `npm run dev` — запуск локального сервера
- `npm run build` — сборка проекта для продакшена
- `npm start` — запуск собранного проекта

## 📸 Галерея

_(Здесь можно добавить скриншоты приложения: Главный экран, История транзакций, Модалка получения средств)_

---

**Разработано с ❤️ для экосистемы TON.**

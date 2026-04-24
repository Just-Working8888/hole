# HOL — TON Wallet Mini App

> Telegram Mini App (TMA) / PWA кошелёк для сети TON.
> Задеплоен на: https://hole-nu.vercel.app

---

## Стек технологий

| Категория | Библиотека |
|-----------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + SCSS Modules |
| State | Redux Toolkit 2 + RTK Query |
| Blockchain | TonConnect UI React 2 |
| Cell building | @ton/core |
| Charts | recharts |
| Validation | Zod |
| QR-коды | react-qr-code |
| Тесты | Jest + ts-jest |
| Deploy | Vercel |

---

## Архитектура: Feature-Sliced Design (FSD)

```
src/
├── app/                        # Next.js маршруты + провайдеры
│   ├── page.tsx                # Главная: WalletCard + токены + история
│   ├── history/page.tsx        # Полная история транзакций
│   ├── jettons/page.tsx        # Рынок джеттонов
│   ├── jettons/[address]/      # Детальная страница токена + график
│   ├── settings/page.tsx       # Настройки (язык, валюта, контакты, выход)
│   ├── layout.tsx              # Корневой лэйаут + ErrorBoundary + BottomNav
│   └── providers.tsx           # Redux + TonConnectUI провайдеры
│
├── widgets/
│   ├── wallet-card/            # WalletCard — баланс, кнопки действий
│   └── bottom-nav/             # Нижняя навигация (4 вкладки)
│
├── features/
│   ├── auth-by-address/        # TonConnect подключение кошелька
│   ├── jetton-balances/        # Список токенов пользователя
│   ├── jettons-market/         # Рынок с инфинити-скроллом и фильтрами
│   ├── send-transaction/       # Отправка TON и джеттонов
│   │   ├── ui/SendModal.tsx    # Модалка с токен-селектором
│   │   └── lib/buildJettonTransferPayload.ts
│   ├── receive-transaction/    # QR-код для получения
│   ├── transaction-history/    # Список + фильтры + модалка деталей
│   │   └── ui/TransactionDetailModal/
│   ├── address-book/           # Книга адресов
│   │   ├── ui/ContactPicker/   # Dropdown в SendModal
│   │   └── ui/ContactsManager/ # CRUD в Настройках
│   └── jetton-chart/           # График цены (recharts)
│
├── entities/
│   ├── user/                   # Auth state (Redux slice + localStorage)
│   ├── contact/                # Книга адресов (Redux slice + localStorage)
│   ├── settings/               # Язык + валюта (Redux slice + localStorage)
│   ├── wallet/                 # Баланс, TonPriceDisplay (USD/EUR/RUB)
│   ├── transaction/            # Типы, mapper, TransactionCard
│   └── jetton/                 # Типы, JettonCard, схемы Zod
│
└── shared/
    ├── api/                    # RTK Query слайсы
    │   ├── tonApi.ts           # TonAPI v2
    │   ├── coinGeckoApi.ts     # CoinGecko (USD/EUR/RUB)
    │   └── dyorApi.ts          # DYOR (рынок джеттонов)
    ├── ui/                     # Button, Modal, Skeleton, Toast, ErrorBoundary
    ├── lib/                    # format-balance, env
    ├── model/                  # useAppDispatch, useAppSelector
    └── store/                  # Redux store
```

---

## Переменные окружения

Создать `.env.local` в корне проекта:

```env
NEXT_PUBLIC_TON_API_URL=https://tonapi.io/v2
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

Прокси для DYOR API настроен в `next.config.ts`:
```
/api/dyor/* → https://jetton-index.tonscan.org/public-dyor/*
```

---

## API интеграции

### TonAPI v2 (`/shared/api/tonApi.ts`)

| Хук | Endpoint | Описание |
|-----|----------|----------|
| `useGetAccountQuery(address)` | `GET /accounts/{address}` | Баланс и данные аккаунта |
| `useGetTransactionsQuery({address, beforeLt})` | `GET /accounts/{address}/events` | История (курсорная пагинация) |
| `useGetJettonBalancesQuery(address)` | `GET /accounts/{address}/jettons` | Токены пользователя |
| `useGetJettonQuery(address)` | `GET /jettons/{address}` | Метаданные джеттона |
| `useGetJettonWalletAddressQuery({accountId, jettonAddress})` | `GET /accounts/{id}/jettons/{addr}/wallet` | Адрес jetton-кошелька отправителя |
| `useGetTokenPriceChartQuery({address, period})` | `GET /rates/chart` | OHLCV данные для графика |

### CoinGecko (`/shared/api/coinGeckoApi.ts`)
- `useGetTonPriceQuery()` — цена TON в USD, EUR, RUB + изменение за 24ч
- Кэш: 60 секунд

### DYOR API (`/shared/api/dyorApi.ts`)
- `useGetJettonsQuery({category, limit, offset})` — рынок джеттонов
- Категории: `jettons` | `taponomics` | `stablecoins`

---

## Redux Store

```typescript
store = {
  user:        { address: string | null, isAuth: boolean },
  contact:     { contacts: Contact[] },
  settings:    { language: 'ru' | 'en', currency: 'USD' | 'EUR' | 'RUB' },
  tonApi:      // RTK Query cache
  dyorApi:     // RTK Query cache
  coinGeckoApi: // RTK Query cache
}
```

### Persistence (localStorage)

| Ключ | Данные |
|------|--------|
| `wallet_address` | Адрес подключённого кошелька |
| `wallet_contacts` | JSON массив контактов |
| `app_settings` | `{ language, currency }` |

> Все слайсы используют SSR-safe паттерн:
> `if (typeof window === 'undefined') return defaults;`

---

## Ключевые типы

### TransactionViewModel
```typescript
interface TransactionViewModel {
  id: string;
  eventId: string;               // для ссылки tonscan.org/tx/{id}
  typeTitle: string;
  description: string;
  displayValue: string;          // "+1.5 TON", "-0.2 TON"
  direction: 'income' | 'expense' | 'neutral';
  isSuccess: boolean;
  isScam: boolean;               // показывает ⚠️ Scam бейдж
  iconUrl: string | null;
  fallbackEmoji: string;
  date: string;
  time: string;
  comment?: string;
  senderAddress?: string;
  recipientAddress?: string;
}
```

### Contact
```typescript
interface Contact {
  id: string;
  name: string;
  address: string;
}
```

### SettingsState
```typescript
interface SettingsState {
  language: 'ru' | 'en';
  currency: 'USD' | 'EUR' | 'RUB';
}
```

---

## Функции утилиты (`/shared/lib/format-balance.ts`)

```typescript
fromNano(nano: string | number): number
// 1_000_000_000 → 1.0 (TON из наноTON)

formatJettonBalance(balance: string, decimals: number): string
// '1500000' с decimals=6 → '1.50'
// Большие числа: '2000000000' → '2.00M'
// Малые числа: '1' с decimals=9 → '<0.001'
```

---

## Отправка джеттонов

Логика в `SendModal.tsx` при выборе не-TON токена:

1. Fetch адреса jetton-кошелька отправителя: `GET /accounts/{wallet}/jettons/{jetton}/wallet`
2. Построить BOC-пейлоад через `buildJettonTransferPayload()` (`@ton/core`)
3. Отправить через TonConnect: `address = jettonWalletAddress`, `amount = 0.1 TON` (комиссия), `payload = base64 BOC`

```typescript
// src/features/send-transaction/lib/buildJettonTransferPayload.ts
buildJettonTransferPayload({
  recipientAddress,   // кто получит токены
  senderAddress,      // для возврата лишнего TON
  jettonAmount,       // BigInt в базовых единицах токена
  forwardAmount?,     // нанотоны для forward_payload (default: 1)
}): string            // base64 BOC
```

---

## Компоненты UI

### Shared UI
| Компонент | Описание |
|-----------|----------|
| `<Modal>` | Glassmorphism модалка (Header/Body/Footer) с анимацией |
| `<Button>` | Кнопка с вариантами стилей |
| `<Skeleton>` | Анимированный placeholder загрузки |
| `<Toast>` | Всплывающее уведомление (авто-скрытие 2с) |
| `<ErrorBoundary>` | Перехватчик React ошибок |

### Entity UI
| Компонент | Описание |
|-----------|----------|
| `<TransactionCard>` | Карточка транзакции + бейджи (Scam, Failed, direction) |
| `<TransactionDetailModal>` | Детали транзакции: хэш, адреса, комментарий, Tonscan ссылка |
| `<JettonCard>` | Карточка токена: цена, изменение за 24ч, спарклайн |
| `<BalanceDisplay>` | Форматированный TON баланс |
| `<TonPriceDisplay>` | USD/EUR/RUB эквивалент + изменение за 24ч |

### Feature UI
| Компонент | Описание |
|-----------|----------|
| `<SendModal>` | Отправка TON и джеттонов + ContactPicker |
| `<ContactPicker>` | Dropdown выбора контакта в SendModal |
| `<ContactsManager>` | CRUD-интерфейс для книги адресов |
| `<JettonPriceChart>` | recharts AreaChart + период 1Д/7Д/30Д |
| `<TransactionList>` | История с фильтрами, инфинити-скролл |

---

## Страницы

| Маршрут | Компонент | Описание |
|---------|-----------|----------|
| `/` | `app/page.tsx` | Главная: WalletCard + токены + история |
| `/history` | `app/history/page.tsx` | Полная история транзакций |
| `/jettons` | `app/jettons/page.tsx` | Рынок токенов с поиском и сортировкой |
| `/jettons/[address]` | `app/jettons/[address]/page.tsx` | Детали токена + график цены |
| `/settings` | `app/settings/page.tsx` | Настройки (язык, валюта, контакты, выход) |

---

## Запуск проекта

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev        # http://localhost:3000

# Сборка и продакшн
npm run build
npm run start

# Проверки
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # Jest (24 теста)
npm run test:watch # Jest в watch-режиме
```

---

## Тесты

```
src/entities/transaction/lib/map-transaction.test.ts   — 9 тестов
src/shared/lib/format-balance.test.ts                  — 6 тестов
src/entities/contact/model/slice.test.ts               — 5 тестов
```

Запуск: `npm test`

---

## TonConnect

Манифест: `/public/tonconnect-manifest.json`

Настройки в `providers.tsx`:
```typescript
<TonConnectUIProvider
  manifestUrl="https://hole-nu.vercel.app/tonconnect-manifest.json"
  actionsConfiguration={{ twaReturnUrl: 'https://hole-nu.vercel.app' }}
  uiPreferences={{ theme: THEME.DARK }}
>
```

---

## Что сделано / дорожная карта

### Реализовано
- [x] Подключение кошелька (TonConnect)
- [x] Отображение баланса TON (USD/EUR/RUB)
- [x] Портфель токенов (джеттоны)
- [x] Отправка TON
- [x] **Отправка джеттонов** (с токен-селектором)
- [x] Получение (QR-код)
- [x] История транзакций (пагинация + фильтры)
- [x] **Детали транзакции** (модалка с хэшом, адресами, Tonscan)
- [x] **Скам-бейдж** на транзакциях и токенах
- [x] Рынок джеттонов (инфинити-скролл, поиск, сортировка)
- [x] **График цены токена** (recharts, 1Д/7Д/30Д)
- [x] **Книга адресов** (CRUD + интеграция в SendModal)
- [x] **Настройки** (язык RU/EN, валюта, выход)
- [x] Error Boundary, Skeleton, Toast
- [x] Тесты (Jest, 24 теста)

### Планируется
- [ ] Swap/Exchange через STON.fi или DeDust
- [ ] QR-сканер для ввода адреса в SendModal
- [ ] Push-уведомления о входящих транзакциях (WebSocket TonAPI)
- [ ] Виртуальный скролл для длинных списков
- [ ] PWA / офлайн-режим
- [ ] Расширенные тесты (компонентные, e2e)

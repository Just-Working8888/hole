import { z } from 'zod';
import { fromNano } from '@/shared/lib/format-balance';

export const AccountSchema = z.object({
    address: z.string(),
    balance: z.union([z.string(), z.number()]), // Приходит "1500000000"
    status: z.string(),
}).transform((data) => ({
    ...data,
    // Вот тут магия: во всем приложении баланс уже будет числом 1.5
    balance: fromNano(data.balance),
    isActive: data.status === 'active',
}));
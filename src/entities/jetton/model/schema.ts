import { z } from 'zod';

export const JettonSchema = z.object({
    id: z.number(),
    weight: z.number().optional().nullable(),
    img: z.string().url(),
    name: z.string(),
    symbol: z.string(),
    jetton: z.string(), // адрес контракта
    type: z.enum(['jettons', 'taponomics', 'stablecoins', 'stable']),
    status: z.enum(['JVS_NONE', 'JVS_APPROVED', 'JVS_VERIFIED']).optional().nullable(),
    decimals: z.number(),

    // цены — приходят как строки, трансформируем в числа (если придут невалидные - будет NaN, Zod.coerce.number() или transform(Number))
    price: z.string().transform(Number),
    priceUsd: z.string().transform(Number),
    priceChange24h: z.string().transform(Number),
    priceChange1w: z.string().transform(Number),
    priceChange1m: z.string().transform(Number),
    volume24h: z.string().transform(Number),
    marketCap: z.string().transform(Number),

    holders: z.number().optional().nullable(),
    traders24h: z.number().optional().nullable(),

    chartDark: z.string().url().optional().nullable(),
    chartLight: z.string().url().optional().nullable(),
});

export const JettonsResponseSchema = z.array(JettonSchema);

export type Jetton = z.infer<typeof JettonSchema>;

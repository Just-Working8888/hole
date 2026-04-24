'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useGetTokenPriceChartQuery } from '@/shared/api/tonApi';
import { Skeleton } from '@/shared/ui/Skeleton';
import styles from './JettonPriceChart.module.scss';

// Recharts использует window, нужен dynamic import без SSR
const AreaChart = dynamic(() => import('recharts').then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((m) => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false });

interface JettonPriceChartProps {
    jettonAddress: string;
    period: '1d' | '7d' | '30d';
    fallbackImageUrl?: string | null;
}

const formatDate = (timestamp: number, period: '1d' | '7d' | '30d') => {
    const date = new Date(timestamp);
    if (period === '1d') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
};

export const JettonPriceChart = ({ jettonAddress, period, fallbackImageUrl }: JettonPriceChartProps) => {
    const { data: points = [], isLoading, isError } = useGetTokenPriceChartQuery(
        { address: jettonAddress, period },
        { skip: !jettonAddress }
    );

    if (isLoading) {
        return <Skeleton style={{ width: '100%', height: 140, borderRadius: '0.75rem' }} />;
    }

    if (isError || points.length === 0) {
        if (fallbackImageUrl) {
            return (
                <div className={styles.fallback}>
                    <Image src={fallbackImageUrl} alt="chart" fill className={styles.fallbackImg} unoptimized />
                </div>
            );
        }
        return <div className={styles.noData}>Данные графика недоступны</div>;
    }

    const minPrice = Math.min(...points.map((p) => p.price));
    const maxPrice = Math.max(...points.map((p) => p.price));
    const priceUp = points[points.length - 1]?.price >= points[0]?.price;
    const lineColor = priceUp ? '#4ade80' : '#f87171';

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={points} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(v) => formatDate(v, period)}
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={[minPrice * 0.995, maxPrice * 1.005]}
                        tickFormatter={formatPrice}
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
                        tickLine={false}
                        axisLine={false}
                        width={52}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(20,20,25,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#fff',
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [`$${formatPrice(Number(value))}`, 'Цена']}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        labelFormatter={(label: any) => new Date(Number(label)).toLocaleString()}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={lineColor}
                        strokeWidth={1.5}
                        fill="url(#chartGrad)"
                        dot={false}
                        activeDot={{ r: 3, strokeWidth: 0, fill: lineColor }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

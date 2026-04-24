'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './BalanceDisplay.module.scss';

function useCountUp(target: number, duration = 1100) {
    const [current, setCurrent] = useState(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const startTime = performance.now();
        const startValue = 0;

        const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCurrent(startValue + (target - startValue) * eased);
            if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [target, duration]);

    return current;
}

export const BalanceDisplay = ({ amount, symbol }: { amount: number; symbol: string }) => {
    const animatedAmount = useCountUp(amount);

    return (
        <div className={styles.balanceContainer}>
            <div className={styles.mainBalance}>
                <span className={styles.amount}>
                    {animatedAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </span>
                <span className={styles.symbol}>{symbol}</span>
            </div>
        </div>
    );
};

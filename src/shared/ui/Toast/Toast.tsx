'use client';

import { useEffect, useState } from 'react';
import styles from './Toast.module.scss';

interface ToastProps {
    message: string;
    visible: boolean;
}

export const Toast = ({ message, visible }: ToastProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (visible) setMounted(true);
        else {
            const t = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(t);
        }
    }, [visible]);

    if (!mounted && !visible) return null;

    return (
        <div className={`${styles.toast} ${visible ? styles.visible : styles.hiding}`}>
            {message}
        </div>
    );
};

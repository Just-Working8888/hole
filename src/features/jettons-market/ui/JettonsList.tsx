'use client';

import { useState, useRef, useCallback } from 'react';
import { useGetJettonsQuery } from '@/shared/api/dyorApi';
import type { JettonCategory } from '@/shared/api/dyorApi';
import { JettonCard } from '@/entities/jetton';
import { Skeleton } from '@/shared/ui/Skeleton';
import styles from './JettonsList.module.scss';

export const JettonsList = () => {
    const [category, setCategory] = useState<JettonCategory>('jettons');
    const [offset, setOffset] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'priceDesc' | 'priceAsc' | 'volumeDesc' | 'nameAsc'>('volumeDesc');
    const limit = 20;

    const { data: jettons = [], isLoading, isFetching, isError } = useGetJettonsQuery({
        category,
        limit,
        offset, // Handled automatically by RTK Query merge & serializeQueryArgs
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetching || isLoading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && jettons.length >= offset + limit) {
                    setOffset((prev) => prev + limit);
                }
            });

            if (node) observer.current.observe(node);
        },
        [isFetching, isLoading, jettons.length, offset, limit]
    );

    const handleCategoryChange = (newCategory: JettonCategory) => {
        setCategory(newCategory);
        setOffset(0); // This resets offset, API slice resets cache internally
    };

    // Filter and sort the loaded jettons
    const processedJettons = jettons
        .filter((j) => {
            if (!searchQuery) return true;
            const lowerQuery = searchQuery.toLowerCase();
            return j.name.toLowerCase().includes(lowerQuery) || j.symbol.toLowerCase().includes(lowerQuery);
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'priceDesc':
                    return b.price - a.price;
                case 'priceAsc':
                    return a.price - b.price;
                case 'volumeDesc':
                    return b.volume24h - a.volume24h;
                case 'nameAsc':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

    return (
        <div className={styles.container}>
            {/* Tabs */}
            <div className={styles.tabsArea}>
                {(['jettons', 'taponomics', 'stablecoins'] as JettonCategory[]).map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${category === tab ? styles.active : ''}`}
                        onClick={() => handleCategoryChange(tab)}
                    >
                        {tab === 'jettons' ? 'Экосистема' : tab === 'taponomics' ? 'Тапалки' : 'Стейблкоины'}
                    </button>
                ))}
            </div>

            <div className={styles.controlsArea}>
                <input
                    type="text"
                    placeholder="Поиск по названию или символу..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'priceDesc' | 'priceAsc' | 'volumeDesc' | 'nameAsc')}
                    className={styles.sortSelect}
                >
                    <option value="volumeDesc">По объему (убыв.)</option>
                    <option value="priceDesc">По цене (убыв.)</option>
                    <option value="priceAsc">По цене (возр.)</option>
                    <option value="nameAsc">По алфавиту</option>
                </select>
            </div>

            {/* Error State */}
            {isError && (
                <div className={styles.error}>Ошибка загрузки рынка. Попробуйте позже.</div>
            )}

            {/* List */}
            <div className={styles.list}>
                {processedJettons.map((jetton, index) => {
                    const isLast = index === processedJettons.length - 1;
                    return (
                        <div key={jetton.id} ref={isLast ? lastElementRef : null}>
                            <JettonCard jetton={jetton} />
                        </div>
                    );
                })}

                {/* Skeletons on loading */}
                {isFetching && (
                    <>
                        {[...Array(offset === 0 ? 6 : 2)].map((_, i) => (
                            <div key={`skeleton-${i}`} className={styles.skeletonCard}>
                                <Skeleton style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                <div className={styles.skeletonBody}>
                                    <Skeleton style={{ width: '80px', height: '16px' }} />
                                    <Skeleton style={{ width: '120px', height: '12px', marginTop: '4px' }} />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {!isFetching && jettons.length >= offset + limit && (
                <div className={styles.loadingMoreIndicator}>Прокрутите вниз для загрузки...</div>
            )}
        </div>
    );
};

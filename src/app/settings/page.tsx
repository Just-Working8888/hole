'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { setLanguage, setCurrency } from '@/entities/settings';
import type { Language, Currency } from '@/entities/settings';
import { logout } from '@/entities/user/model/slice';
import { ContactsManager } from '@/features/address-book';
import styles from './page.module.scss';

const LANGUAGES: { id: Language; label: string }[] = [
    { id: 'ru', label: 'RU' },
    { id: 'en', label: 'EN' },
];

const CURRENCIES: { id: Currency; label: string }[] = [
    { id: 'USD', label: '$ USD' },
    { id: 'EUR', label: '€ EUR' },
    { id: 'RUB', label: '₽ RUB' },
];

export default function SettingsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const language = useAppSelector((state) => state.settings.language);
    const currency = useAppSelector((state) => state.settings.currency);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    return (
        <main className={styles.page}>
            <div className={styles.pageHeader}>
                <h1>Настройки</h1>
            </div>

            <div className={styles.settingsList}>
                {/* Основные */}
                <div className={styles.settingsGroup}>
                    <h2 className={styles.groupTitle}>Основные</h2>

                    <div className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>🌐</span>
                            <p className={styles.settingName}>Язык</p>
                        </div>
                        <div className={styles.toggleGroup}>
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.id}
                                    className={`${styles.toggleBtn} ${language === lang.id ? styles.toggleActive : ''}`}
                                    onClick={() => dispatch(setLanguage(lang.id))}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>💰</span>
                            <p className={styles.settingName}>Валюта</p>
                        </div>
                        <div className={styles.toggleGroup}>
                            {CURRENCIES.map((cur) => (
                                <button
                                    key={cur.id}
                                    className={`${styles.toggleBtn} ${currency === cur.id ? styles.toggleActive : ''}`}
                                    onClick={() => dispatch(setCurrency(cur.id))}
                                >
                                    {cur.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Контакты */}
                <div className={styles.settingsGroup}>
                    <h2 className={styles.groupTitle}>Книга адресов</h2>
                    <div className={styles.contactsWrapper}>
                        <ContactsManager />
                    </div>
                </div>

                {/* О приложении */}
                <div className={styles.settingsGroup}>
                    <h2 className={styles.groupTitle}>О приложении</h2>
                    <div className={`${styles.settingItem} ${styles.noHover}`}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>ℹ️</span>
                            <div>
                                <p className={styles.settingName}>Версия</p>
                                <p className={styles.settingDesc}>1.0.0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Аккаунт */}
                <div className={styles.settingsGroup}>
                    <h2 className={styles.groupTitle}>Аккаунт</h2>
                    <button className={`${styles.settingItem} ${styles.dangerItem}`} onClick={handleLogout}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>🚪</span>
                            <p className={styles.settingName}>Выйти из кошелька</p>
                        </div>
                    </button>
                </div>
            </div>
        </main>
    );
}

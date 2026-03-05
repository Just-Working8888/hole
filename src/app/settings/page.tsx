'use client';

import styles from './page.module.scss';

export default function SettingsPage() {
    return (
        <main className={styles.page}>
            <div className={styles.pageHeader}>
                <h1>Настройки</h1>
            </div>

            <div className={styles.settingsList}>
                <div className={styles.settingsGroup}>
                    <h2 className={styles.groupTitle}>Основные</h2>

                    <div className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>🌐</span>
                            <div>
                                <p className={styles.settingName}>Язык</p>
                                <p className={styles.settingDesc}>Русский</p>
                            </div>
                        </div>
                        <span className={styles.chevron}>›</span>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>💰</span>
                            <div>
                                <p className={styles.settingName}>Валюта</p>
                                <p className={styles.settingDesc}>USD</p>
                            </div>
                        </div>
                        <span className={styles.chevron}>›</span>
                    </div>
                </div>

                <div className={styles.settingsGroup}>
                    <h2 className={styles.groupTitle}>Безопасность</h2>

                    <div className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>🔐</span>
                            <div>
                                <p className={styles.settingName}>Резервная копия</p>
                                <p className={styles.settingDesc}>Защитите свой кошелёк</p>
                            </div>
                        </div>
                        <span className={styles.chevron}>›</span>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>🛡️</span>
                            <div>
                                <p className={styles.settingName}>Биометрия</p>
                                <p className={styles.settingDesc}>Face ID / Touch ID</p>
                            </div>
                        </div>
                        <span className={styles.chevron}>›</span>
                    </div>
                </div>

                <div className={styles.settingsGroup}>
                    <h2 className={styles.groupTitle}>О приложении</h2>

                    <div className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <span className={styles.settingIcon}>ℹ️</span>
                            <div>
                                <p className={styles.settingName}>Версия</p>
                                <p className={styles.settingDesc}>1.0.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

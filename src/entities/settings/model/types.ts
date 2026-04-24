export type Language = 'ru' | 'en';
export type Currency = 'USD' | 'EUR' | 'RUB';

export interface SettingsState {
    language: Language;
    currency: Currency;
}

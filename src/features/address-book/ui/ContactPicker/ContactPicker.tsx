'use client';

import { useState } from 'react';
import { useAppSelector } from '@/shared/model/hooks';
import styles from './ContactPicker.module.scss';

interface ContactPickerProps {
    onSelect: (address: string) => void;
}

export const ContactPicker = ({ onSelect }: ContactPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const contacts = useAppSelector((state) => state.contact.contacts);

    if (contacts.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            <button
                type="button"
                className={styles.triggerBtn}
                onClick={() => setIsOpen((v) => !v)}
                title="Выбрать из контактов"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {contacts.map((contact) => (
                        <button
                            key={contact.id}
                            type="button"
                            className={styles.contactRow}
                            onClick={() => {
                                onSelect(contact.address);
                                setIsOpen(false);
                            }}
                        >
                            <span className={styles.avatar}>{contact.name.charAt(0).toUpperCase()}</span>
                            <div className={styles.info}>
                                <span className={styles.name}>{contact.name}</span>
                                <span className={styles.address}>
                                    {contact.address.slice(0, 8)}...{contact.address.slice(-4)}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { addContact, deleteContact, updateContact } from '@/entities/contact';
import type { Contact } from '@/entities/contact';
import styles from './ContactsManager.module.scss';

const isValidTonAddress = (addr: string): boolean =>
    /^[EUk][Qf][A-Za-z0-9+/_-]{46}$/.test(addr.trim());

export const ContactsManager = () => {
    const dispatch = useAppDispatch();
    const contacts = useAppSelector((state) => state.contact.contacts);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const reset = () => {
        setShowForm(false);
        setEditingId(null);
        setName('');
        setAddress('');
    };

    const handleEdit = (contact: Contact) => {
        setEditingId(contact.id);
        setName(contact.name);
        setAddress(contact.address);
        setShowForm(true);
    };

    const handleSubmit = () => {
        if (!name.trim() || !isValidTonAddress(address)) return;
        if (editingId) {
            dispatch(updateContact({ id: editingId, name: name.trim(), address: address.trim() }));
        } else {
            dispatch(addContact({ name: name.trim(), address: address.trim() }));
        }
        reset();
    };

    const addressError = address && !isValidTonAddress(address) ? 'Некорректный TON адрес' : null;

    return (
        <div className={styles.container}>
            {contacts.length === 0 && !showForm && (
                <p className={styles.empty}>Нет сохранённых контактов</p>
            )}

            {contacts.map((contact) => (
                <div key={contact.id} className={styles.contactRow}>
                    <span className={styles.avatar}>{contact.name.charAt(0).toUpperCase()}</span>
                    <div className={styles.info}>
                        <span className={styles.name}>{contact.name}</span>
                        <span className={styles.address}>
                            {contact.address.slice(0, 10)}...{contact.address.slice(-6)}
                        </span>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => handleEdit(contact)} title="Редактировать">
                            ✏️
                        </button>
                        <button className={styles.deleteBtn} onClick={() => dispatch(deleteContact(contact.id))} title="Удалить">
                            🗑️
                        </button>
                    </div>
                </div>
            ))}

            {showForm && (
                <div className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Имя контакта"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={32}
                    />
                    <input
                        className={`${styles.input} ${addressError ? styles.inputError : ''}`}
                        type="text"
                        placeholder="UQ... адрес"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        autoComplete="off"
                    />
                    {addressError && <span className={styles.fieldError}>{addressError}</span>}
                    <div className={styles.formActions}>
                        <button className={styles.cancelBtn} onClick={reset}>Отмена</button>
                        <button
                            className={styles.saveBtn}
                            onClick={handleSubmit}
                            disabled={!name.trim() || !!addressError || !address}
                        >
                            {editingId ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </div>
            )}

            {!showForm && (
                <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                    + Добавить контакт
                </button>
            )}
        </div>
    );
};

import { useState } from 'react';
import { useAppDispatch } from '@/shared/model/hooks'; // Типизированный диспатч
import { setAddress } from '@/entities/user'; // Экшн из слайса, который мы написали
import { Button } from '@/shared/ui/Button/index';
import styles from './AuthForm.module.scss'; // Импорт SCSS модулей

export const AuthForm = () => {
    const [value, setValue] = useState('');
    const dispatch = useAppDispatch();

    const handleLogin = () => {
        if (value.length > 10) { // Базовая проверка на длину адреса TON
            dispatch(setAddress(value));
        }
    };

    return (
        <div className={styles.authForm}>
            <h2>Вход в Web3 Hub</h2>
            <p>Введите ваш адрес кошелька TON, чтобы продолжить</p>

            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="EQCD39VS..."
            />

            <Button onClick={handleLogin} disabled={value.length < 10}>
                <Button.Text>Подключить кошелёк</Button.Text>
            </Button>
        </div>
    );
};

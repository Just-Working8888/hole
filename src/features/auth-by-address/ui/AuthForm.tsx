import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/model/hooks';
import { setAddress } from '@/entities/user';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import styles from './AuthForm.module.scss';

export const AuthForm = () => {
    const dispatch = useAppDispatch();
    const userFriendlyAddress = useTonAddress();

    useEffect(() => {
        if (userFriendlyAddress) {
            dispatch(setAddress(userFriendlyAddress));
        }
    }, [userFriendlyAddress, dispatch]);

    return (
        <div className={styles.authForm}>
            <h2>Вход в Web3 Hub</h2>
            <p>Подключите ваш кошелек TON через TonConnect</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <TonConnectButton />
            </div>
        </div>
    );
};

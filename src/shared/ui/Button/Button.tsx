import { FC, ButtonHTMLAttributes, ReactNode } from "react";

import styles from './Button.module.scss';

// 1. Описываем пропсы для основного компонента
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

// 2. Создаем основной компонент
const ButtonRoot: FC<ButtonProps> = ({ children, variant = 'primary', ...rest }) => {
    return (
        <button className={`${styles.button} ${styles[variant]}`} {...rest}>
            {children}
        </button>
    );
};

// 3. Создаем "под-компоненты" (Compound parts)
const ButtonText: FC<{ children: ReactNode }> = ({ children }) => (
    <span className={styles.text}>{children}</span>
);

const ButtonIcon: FC<{ name: string }> = ({ name }) => (
    <i className={`${styles.icon} icon-${name}`} />
);

// 4. Магия Compound Components: соединяем их в один объект
export const Button = Object.assign(ButtonRoot, {
    Text: ButtonText,
    Icon: ButtonIcon,
});
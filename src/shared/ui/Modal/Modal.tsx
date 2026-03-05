import { FC, ReactNode, useEffect, useState } from "react";
import styles from './Modal.module.scss';
import { Button } from "../Button";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const ModalRoot: FC<ModalProps> = ({ children, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        // Trigger enter animation on next frame
        requestAnimationFrame(() => setIsVisible(true));
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 250); // Wait for exit animation
    };

    return (
        <div
            className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ''}`}
            onClick={handleClose}
        >
            <div
                className={`${styles.modalContent} ${isVisible ? styles.modalVisible : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <Button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </Button>
                {children}
            </div>
        </div>
    );
};

const ModalHeader: FC<{ title: string; children?: ReactNode }> = ({ title, children }) => (
    <div className={styles.header}>
        <h3>{title}</h3>
        {children}
    </div>
);

const ModalBody: FC<{ children: ReactNode }> = ({ children }) => (
    <div className={styles.body}>
        {children}
    </div>
);

const ModalFooter: FC<{ children: ReactNode }> = ({ children }) => (
    <div className={styles.footer}>
        {children}
    </div>
);

export const Modal = Object.assign(ModalRoot, {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
});

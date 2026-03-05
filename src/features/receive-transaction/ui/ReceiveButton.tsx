// src/features/receive-transaction/ui/ReceiveButton.tsx
import { useState } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/Modal/Modal'; // Предположим, он уже есть в shared
import { QRCodeDisplay } from './QRCodeDisplay';
import styles from './ReceiveButton.module.scss'; // SCSS

export const ReceiveButton = ({ walletAddress }: { walletAddress: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)} variant="secondary">
                <Button.Icon name="qr-code" />
                <Button.Text>Receive</Button.Text>
            </Button>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <Modal.Header title="Ваш адрес TON" />
                    <Modal.Body>
                        <QRCodeDisplay address={walletAddress} />
                        <p className={styles.addressText}>{walletAddress}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => navigator.clipboard.writeText(walletAddress)}>
                            Копировать адрес
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};
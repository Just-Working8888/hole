import React from "react";
import QRCode from "react-qr-code";
import styles from './QRCodeDisplay.module.scss'; // SCSS

interface QRCodeDisplayProps {
    address: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ address }) => {
    return (
        <div className={styles.qrContainer}>
            <QRCode value={address} size={200} />
        </div>
    );
};

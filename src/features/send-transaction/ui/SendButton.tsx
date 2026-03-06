// src/features/send-transaction/ui/SendButton.tsx

import { Button } from "@/shared/ui/Button/Button";
import { useTonConnectUI } from "@tonconnect/ui-react";

export const SendButton = () => {
    const [tonConnectUI] = useTonConnectUI();

    const handleSend = async () => {
        try {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                messages: [
                    {
                        address: "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ", // Replace with actual address
                        amount: "10000000", // 0.01 TON
                    }
                ]
            };

            await tonConnectUI.sendTransaction(transaction);
            console.log("Transaction successfully sent!");
        } catch (e) {
            console.error("Error sending transaction", e);
        }
    };

    return (
        <Button onClick={handleSend}>
            <Button.Icon name="send" />
            <Button.Text>Send</Button.Text>
        </Button>
    );
};
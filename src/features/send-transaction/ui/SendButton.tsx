// src/features/send-transaction/ui/SendButton.tsx

import { Button } from "@/shared/ui/Button/Button";

export const SendButton = () => {
    const handleSend = () => {
        console.log("Логика отправки транзакции через TonConnect...");
        // Тут будет вызов хука useTonConnect()
    };

    return (
        <Button onClick={handleSend}>
            <Button.Icon name="send" />
            <Button.Text>Send</Button.Text>
        </Button>
    );
};
import { beginCell, Address, toNano } from '@ton/core';

interface JettonTransferParams {
    recipientAddress: string;
    senderAddress: string;
    jettonAmount: bigint;
    forwardAmount?: bigint;
}

/**
 * Строит BOC-пейлоад для jetton transfer (op=0xf8a7ea5).
 * Возвращает base64-строку для передачи в TonConnect.
 */
export const buildJettonTransferPayload = ({
    recipientAddress,
    senderAddress,
    jettonAmount,
    forwardAmount = toNano('0.000000001'),
}: JettonTransferParams): string => {
    const cell = beginCell()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins(jettonAmount)
        .storeAddress(Address.parse(recipientAddress))
        .storeAddress(Address.parse(senderAddress))
        .storeBit(false)
        .storeCoins(forwardAmount)
        .storeBit(false)
        .endCell();

    return cell.toBoc().toString('base64');
};

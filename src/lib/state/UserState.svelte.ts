import { account } from '$lib/smartAccountClient';

/**
 * A tiny piece of reactive state tracking the connected smart account. The kit
 * emits `walletConnected`/`walletDisconnected` events, so we don't have to
 * thread the contract address through every component ourselves.
 */
class Wallet {
    contractAddress: string | null = $state(null);

    constructor() {
        account.events.on(
            'walletConnected',
            ({ contractId }) => (this.contractAddress = contractId),
        );
        account.events.on('walletDisconnected', () => (this.contractAddress = null));
    }
}

export const wallet = new Wallet();

import { Client, networks } from 'hello_world';
import { PUBLIC_STELLAR_RPC_URL } from '$app/env/public';

export default new Client({
    ...networks.testnet,
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
});

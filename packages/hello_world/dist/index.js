import { Buffer } from 'buffer';
import { Client as ContractClient, Spec as ContractSpec } from '@stellar/stellar-sdk/contract';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CD4FJDLBYZO5VZZWBUEN5YZIIOGTGOJ5DCTGZZQLYZG7A5XT7BKIUO6U',
    },
};
export const Errors = {};
export class Client extends ContractClient {
    options;
    constructor(options) {
        super(
            new ContractSpec([
                'AAAAAAAAAAAAAAAFaGVsbG8AAAAAAAABAAAAAAAAAAJ0bwAAAAAAEAAAAAEAAAPqAAAAEA==',
            ]),
            options,
        );
        this.options = options;
    }
    fromJSON = {
        hello: this.txFromJSON,
    };
}

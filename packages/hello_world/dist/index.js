import { Buffer } from 'buffer';
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CCXZXGRQ6KC3LSA5MDVXMEBUTWGR7UL3DUFXK3FE5RXS2CCQO5QZDT6A',
    },
};
export const Errors = {};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec([
            'AAAAAAAAAAAAAAAFaGVsbG8AAAAAAAABAAAAAAAAAAJ0bwAAAAAAEAAAAAEAAAPqAAAAEA==',
        ]), options);
        this.options = options;
    }
    fromJSON = {
        hello: (this.txFromJSON),
    };
}

// Unit tests for the helpers in `smartAccountClient.ts`. Pure functions like
// these are easy to test without a browser, a passkey, or the network. Run
// them with `pnpm test:unit`.
import { describe, it, expect } from 'vitest';
import { userDismissedPasskey } from '#lib/smartAccountClient.ts';

describe('userDismissedPasskey', () => {
    it('recognizes a dismissed passkey prompt', () => {
        const cause = new DOMException('', 'NotAllowedError');
        expect(userDismissedPasskey(cause)).toBe(true);
    });

    it('looks into a wrapped error to find its cause', () => {
        const cause = new DOMException('', 'AbortError');
        expect(userDismissedPasskey(new Error('wrapped', { cause }))).toBe(true);
    });

    it('does not hide real failures', () => {
        const cause = new Error('relayer is down');
        expect(userDismissedPasskey(cause)).toBe(false);
        expect(userDismissedPasskey(undefined)).toBe(false);
    });
});

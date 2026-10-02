// Unit tests run with Vitest (`pnpm test:unit`). Any `*.test.ts` file under
// `src/` is picked up automatically, so you can keep tests next to the code
// they cover. See `src/lib/smartAccountClient.test.ts` for a real example.
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
    it('adds 1 + 2 to equal 3', () => {
        expect(1 + 2).toBe(3);
    });
});

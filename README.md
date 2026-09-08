# SvelteKit Passkeys Template <!-- omit from toc -->

A starting point for building a passkey-powered Stellar dapp with
[SvelteKit](https://svelte.dev/docs/kit). Users sign up and sign transactions
with a device passkey (Touch ID, Face ID, or a hardware key), and never touch a
seed phrase or a browser extension.

## Table of Contents <!-- omit from toc -->

- [Passkeys](#passkeys)
- [Anatomy of the Repository](#anatomy-of-the-repository)
  - [Smart Contract](#smart-contract)
  - [Frontend](#frontend)
  - [Relayer Proxy](#relayer-proxy)
- [Running Locally](#running-locally)
- [Building](#building)
- [Testing](#testing)
- [More Info](#more-info)

## Passkeys

This template uses
[smart-account-kit](https://github.com/stellar/smart-account-kit) to interact
with users and authenticate with their passkeys. Wallets are OpenZeppelin smart
account contracts, and this makes it possible for users to get on-chain without
_any_ of the usual obstacles that can stand in their way.

Users sign transactions with a device passkey via WebAuthn. The private key
never leaves the authenticator, and the smart account contract verifies the
`secp256r1` signature on-chain.

Smart Account Kit handles the WebAuthn ceremony, deploys an OpenZeppelin Smart
Account per user on first signup, and stores the credential metadata in
IndexedDB so the session survives page reloads.

> Seriously. You have **GOT** to start thinking about passkeys.

## Anatomy of the Repository

### Smart Contract

The [Stellar smart
contract](https://developers.stellar.org/docs/build#smart-contracts) that ships
with this template is located in the `/contracts/hello_world` directory. It does
almost nothing on purpose. Replace it with your own.

The contract is also used to generate "bindings" that can be imported and used
in the frontend code. The bindings are written to the `/packages/hello_world`
directory as a pnpm workspace package. They're auto-generated each time the
`initialize.js` script is run (`pnpm run setup`), so the generated bindings are
always up-to-date with the deployed smart contract. The compiled output
(`packages/*/dist`) is _not_ committed; `pnpm install` builds it via the
package's `prepare` script.

### Frontend

The frontend files are found in the `/src` directory. There are server-only API
routes located in the `/src/routes/api` directory. Components and utilities are
included in the `/src/lib` directory.

- `src/lib/smartAccountClient.ts` wires up Smart Account Kit and exposes the
  `account`, plus a `getNativeBalance` helper.
- `src/lib/state/UserState.svelte.ts` tracks the connected contract address as
  reactive state, fed by the kit's own events.
- `src/lib/components/ConnectButtons/` holds the signup, login, and logout
  buttons. This is the part you'll most likely want to build on.
- `src/routes/api/send/+server.ts` proxies transaction submissions to the
  relayer so the API key never reaches the browser.

### Relayer Proxy

OpenZeppelin's hosted relayer doesn't accept calls from browser origins with the
API key embedded client-side. To keep the key out of the frontend, we run the
`/api/send` route as a same-origin backend route. The smart account client
`POST`s its transaction to `/api/send`, the server forwards it to
`https://channels.openzeppelin.com/testnet`, and the result comes back.

That route only checks the request's origin. Before you ship anything real, add
guardrails around _which_ transactions you're willing to sponsor and _who_ can
send them.

## Running Locally

```bash
pnpm install                  # install dependencies
cp .env.example .env          # fill in values (see comments in the file)
pnpm run setup                # build + deploy the contract, generate bindings
pnpm run dev                  # start the development server
```

You'll need:

- The [Stellar CLI](https://developers.stellar.org/docs/tools/cli), for
  `pnpm run setup`.
- A Testnet OpenZeppelin Channels API key
  ([generate one here](https://channels.openzeppelin.com/testnet/gen)).
- A modern browser with a registered passkey authenticator.

## Building

```bash
pnpm run build     # production build
pnpm run preview   # preview the production build
```

The template ships with `@sveltejs/adapter-auto`. Swap in a
[specific adapter](https://svelte.dev/docs/kit/adapters) for your target
environment when you know where you're deploying.

## Testing

```bash
pnpm run test        # Playwright integration tests, then Vitest unit tests
pnpm run check       # svelte-check
pnpm run lint        # prettier + eslint
cargo test           # the Rust contract's test suite
```

## More Info

- Developer Documentation:
  <https://developers.stellar.org/docs/build/apps/smart-wallets>
- Smart Account Kit: <https://github.com/stellar/smart-account-kit>
- OpenZeppelin Stellar Contracts:
  <https://github.com/OpenZeppelin/stellar-contracts>
- OpenZeppelin Relayer Channels:
  <https://docs.openzeppelin.com/relayer/1.5.x/guides/stellar-channels-guide>
- [Join us on Discord](https://discord.gg/stellardev), and ask questions in the
  `#passkeys` channel

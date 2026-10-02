<!--
 @component
 This component holds the buttons and logic for our signup/login/logout
 functionality. It's imported and used in the
 `#lib/components/ui/Header.svelte` component, which in turn is placed on the
 page in the `/src/routes/+layout.svelte` file.

 Each button lives in its own file alongside this one. They all talk to the
 `account` exported from `#lib/smartAccountClient.js`, and read the connected
 contract address from the `wallet` state in `#lib/state/UserState.svelte.js`.
-->

<script lang="ts">
    import { onMount } from 'svelte';

    import { wallet } from '#lib/state/UserState.svelte.js';
    import { account } from '#lib/smartAccountClient.js';

    import Signup from './Signup.svelte';
    import Login from './Login.svelte';
    import Logout from './Logout.svelte';

    onMount(async () => {
        try {
            // The kit keeps its own session, so this restores a returning user
            // without prompting them for their passkey again.
            const restored = await account.connectWallet();

            if (restored) {
                console.log('[connected] contractAddress', wallet.contractAddress);
            }
        } catch (err: unknown) {
            console.warn('[connect] silent reconnect failed:', err);
        }
    });
</script>

<div class="flex space-x-1 md:space-x-2">
    {#if !wallet.contractAddress}
        <Signup />
        <Login />
    {:else}
        <Logout />
    {/if}
</div>

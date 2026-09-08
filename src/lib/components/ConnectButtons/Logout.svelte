<!--
 @component
 Log out of the current session. This only forgets the session locally; the
 passkey (and the smart account it controls) is untouched, so the user can log
 back in at any time.
-->

<script lang="ts">
    import LogOut from '@lucide/svelte/icons/log-out';

    import { account } from '$lib/smartAccountClient';
    import { toaster } from '$lib/toaster';

    async function logout() {
        console.log('logging out');
        try {
            await account.disconnect();
        } catch (err: unknown) {
            console.error('[logout]', err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging out. Please try again later.',
            });
        }
    }
</script>

<button class="btn preset-tonal-error" onclick={logout}>
    <span><LogOut /></span>
    <span>Logout</span>
</button>

<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import { error } from '@sveltejs/kit';

    async function signup() {
        console.log('signing up');
        try {
            // Implement the signup logic here
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong signing up. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function login() {
        console.log('logging in');
        try {
            // Implement the login logic here
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong logging in. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function logout() {
        console.log('logging out');
        try {
            // Implement the logout logic here
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }
</script>

<div class="flex space-x-1 md:space-x-2">
    <button class="btn variant-filled-primary" onclick={signup}>Signup</button>
    <button class="btn variant-soft-primary" onclick={login}>Login</button>
    <button class="btn variant-soft-error" onclick={logout}>Logout</button>
</div>

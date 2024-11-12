<script module>
    /**
     * Change these menu items to fit whatever your use-case is.
     */
    export const menuItems = [
        {
            name: 'Apple',
            href: '#',
            icon: Apple,
        },
        {
            name: 'Book',
            href: '#',
            icon: Book,
        },
        {
            name: 'Castle',
            href: '#',
            icon: Castle,
        },
    ];
</script>

<script lang="ts">
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    const drawerStore = getDrawerStore();

    import Menu from 'lucide-svelte/icons/menu';
    import Apple from 'lucide-svelte/icons/apple';
    import Book from 'lucide-svelte/icons/book';
    import Castle from 'lucide-svelte/icons/castle';

    import ConnectButtons from '$lib/components/ConnectButtons.svelte';
</script>

<header class="flex-none shadow-xl z-5">
    <div class="flex flex-col bg-surface-100-800-token space-y-4 p-3 md:p-4">
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 md:gap-8">
            <div class="lg:!hidden self-center">
                <button class="btn-icon btn-icon-sm" onclick={() => drawerStore.open()}>
                    <Menu />
                </button>
            </div>
            <div class="flex-none flex items-center">
                <a href="/" title="Dapp homepage">
                    <span class="text-lg md:text-xl"> Dapp Title </span>
                </a>
            </div>
            <div class="hidden lg:block flex lg:space-x-4">
                {#each menuItems as item}
                    <a href={item.href} class="btn hover:variant-soft-primary">
                        <span><item.icon /></span>
                        <span>{item.name}</span>
                    </a>
                {/each}
            </div>
            <div>
                <ConnectButtons />
            </div>
        </div>
    </div>
</header>

<!--
 @component
 This `Header` component will be placed at the top of each page, as part of our
 template's barebones structure. It's imported and placed in the
 `/src/routes/+layout.svelte` file. This component displays in the header:

 - The "hamburger" button to expand the nav menu, only on small screens
 - The site title
 - Some menu buttons
 - The `#lib/components/ConnectButtons/ConnectButtons.svelte` component
-->

<script module lang="ts">
    // We're using `<script module>` here because the menu items are not in need
    // of reactivity, and this will allow us to export and then import the same
    // items into the sidebar (for smaller screens) without having to redefine
    // the same items.

    export interface IMenuItem {
        name: string;
        href: '/';
        icon: LucideIcon;
    }

    /**
     * Change these menu items to fit whatever your use-case is. The `href`
     * union type above keeps `resolve()` happy: add your routes to it as you
     * create them.
     */
    export const menuItems: IMenuItem[] = [
        {
            name: 'Apple',
            href: '/',
            icon: Apple,
        },
        {
            name: 'Book',
            href: '/',
            icon: Book,
        },
        {
            name: 'Castle',
            href: '/',
            icon: Castle,
        },
    ];

    export const dappTitle = 'Dapp Title';
</script>

<script lang="ts">
    // We import the Icons in this manner to give us faster build and load
    // times. So says the [Lucide Svelte
    // docs](https://lucide.dev/guide/packages/lucide-svelte#example), at least.
    import Apple from '@lucide/svelte/icons/apple';
    import Book from '@lucide/svelte/icons/book';
    import Castle from '@lucide/svelte/icons/castle';
    import type { LucideIcon } from '@lucide/svelte';
    import { resolve } from '$app/paths';

    import NavbarButton from '#lib/components/ui/NavbarButton.svelte';
    import ConnectButtons from '#lib/components/ConnectButtons/ConnectButtons.svelte';
    import SidebarDrawer from '#lib/components/ui/SidebarDrawer.svelte';
</script>

<header class="flex-none shadow-xl">
    <div class="flex flex-col bg-surface-100-900 space-y-4 p-3 md:p-4">
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 md:gap-8">
            <!-- The "hamburger" button will not appear on large screens -->
            <div class="md:hidden! self-center">
                <SidebarDrawer />
            </div>
            <div class="flex-none flex items-center">
                <a href={resolve('/')} title="Dapp homepage">
                    <span class="text-lg md:text-xl">{dappTitle}</span>
                </a>
            </div>
            <!-- The "topnav" buttons will not appear on small screens -->
            <div class="hidden md:block flex space-x-1 md:space-x-4">
                {#each menuItems as item (item.name)}
                    <NavbarButton {item} />
                {/each}
            </div>
            <!-- The login/logout/signup buttons will always appear in the header -->
            <div>
                <ConnectButtons />
            </div>
        </div>
    </div>
</header>

<!--
 @component
 The `SidebarDrawer` component is the responsive menu that can appear on the
 side of the page for smaller screens, when the "hamburger button" is
 clicked/tapped.
-->

<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
    import Menu from '@lucide/svelte/icons/menu';
    import XIcon from '@lucide/svelte/icons/x';
    import { resolve } from '$app/paths';

    // We import the `menuItems` array that is exported from the `<script
    // module>` part of the Header component. This way, we can have the same
    // menu items on large and small screens without the need to re-define them.
    import { dappTitle, menuItems } from '$lib/components/ui/Header.svelte';

    const animBackdrop =
        'transition transition-discrete opacity-0 starting:data-[state=open]:opacity-0 data-[state=open]:opacity-100';
    const animModal =
        'transition transition-discrete opacity-0 -translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0';
</script>

<Dialog>
    <Dialog.Trigger class="btn-icon preset-tonal"><Menu /></Dialog.Trigger>
    <Portal>
        <Dialog.Backdrop
            class="fixed inset-0 z-50 bg-surface-50-950/50 transition transition-discrete {animBackdrop}"
        />
        <Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
            <Dialog.Content
                class="h-screen card bg-surface-100-900 w-sm p-4 space-y-4 shadow-xl {animModal}"
            >
                <header class="flex justify-between items-center">
                    <Dialog.Title class="text-2xl font-bold">{dappTitle}</Dialog.Title>
                    <Dialog.CloseTrigger class="btn-icon preset-tonal">
                        <XIcon />
                    </Dialog.CloseTrigger>
                </header>
                <nav class="flex flex-col gap-2">
                    {#each menuItems as item (item.name)}
                        {@const Icon = item.icon}
                        <Dialog.CloseTrigger>
                            <a href={resolve(item.href)} class="btn preset-tonal w-full">
                                <span><Icon /></span>
                                <span>{item.name}</span>
                            </a>
                        </Dialog.CloseTrigger>
                    {/each}
                </nav>
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>

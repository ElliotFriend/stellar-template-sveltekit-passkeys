<!--
 @component
 A single button in the header's "topnav". It highlights itself when the
 current page matches its `href`.
-->

<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import type { IMenuItem } from '#lib/components/ui/Header.svelte';

    let { item }: { item: IMenuItem } = $props();
    const Icon = $derived(item.icon);
</script>

<a
    href={resolve(item.href)}
    class={[
        'btn hover:preset-tonal-primary',
        page.url.pathname === item.href && 'preset-tonal-primary',
    ]}
>
    <span><Icon /></span>
    <span>{item.name}</span>
</a>

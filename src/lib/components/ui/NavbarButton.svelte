<script lang="ts">
    import type { Component } from "svelte";
    interface Props {
        href: string;
        name: string;
        icon: Component<{}>;
    }
    let item: Props = $props();
</script>

<a href={item.href}>
    <span><item.icon /></span>
    <span>{item.name}</span>
</a>

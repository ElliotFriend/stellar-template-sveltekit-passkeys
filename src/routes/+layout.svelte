<script lang="ts">
    import '../app.css';
    import { Toaster } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';

    import Header from '$lib/components/ui/Header.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';

    let { children } = $props();
</script>

<Toaster {toaster}></Toaster>

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        {@render children()}
    </PageContent>
    <Footer />
</div>

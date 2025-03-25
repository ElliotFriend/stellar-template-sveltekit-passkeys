<script lang="ts">
    import '../app.css';
    import { ToastProvider } from '@skeletonlabs/skeleton-svelte';

    import Header from '$lib/components/ui/Header.svelte';
    import SidebarDrawer from '$lib/components/ui/SidebarDrawer.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';

    let { children } = $props();
</script>

<ToastProvider>
    <div class="w-full h-screen flex flex-col overflow-hidden">
        <Header />
        <PageContent>
            {@render children()}
        </PageContent>
        <Footer />
    </div>
</ToastProvider>

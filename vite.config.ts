import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        fs: {
            // the generated contract bindings live in a workspace package
            allow: ['./packages'],
        },
    },
    plugins: [tailwindcss(), sveltekit()],
});

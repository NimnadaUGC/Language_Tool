import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    // FM Abhaya's audited mapping table lives beside this application and is
    // imported read-only as a build-time source asset by the legacy encoder.
    server: { fs: { allow: ['..'] } },
    test: { environment: 'jsdom', setupFiles: './src/test.setup.ts' },
    plugins: [
        react(),
        VitePWA({
            registerType: 'prompt',
            manifest: {
                name: 'CSB Multilingual',
                short_name: 'CSB Multi',
                description: 'Write Sinhala, Tamil, and Hindi from your own keyboard.',
                theme_color: '#0f172a',
                background_color: '#f8fafc',
                display: 'standalone',
                icons: [{ src: '/assets/singlish_trans.png', sizes: '1300x720', type: 'image/png', purpose: 'any' }],
            },
            workbox: { globPatterns: ['**/*.{js,css,html,png,svg,woff2}'] },
        }),
    ],
});

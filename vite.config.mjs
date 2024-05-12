import { defineConfig, loadEnv } from 'vite';
export default ({ mode }) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd()))
    return defineConfig({
        root: 'src/',
        publicDir: '../public/',
        base: './',
        server:
        {
            host: true,
            open: true
        },
        build:
        {
            outDir: '../dist',
            emptyOutDir: true,
            sourcemap: true
        },

    });
}
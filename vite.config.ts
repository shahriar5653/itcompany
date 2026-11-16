import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';

const classicRuntimeScripts = [
  'script.js',
  'admin.js',
  'admin-client.js',
  'portal.js',
  'login.js',
  'register.js',
  'reset-password.js',
  'legal-templates.js',
  'legal-page.js',
  'blog-public.js',
];

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'copy-classic-runtime-scripts',
        apply: 'build',
        generateBundle() {
          for (const fileName of classicRuntimeScripts) {
            this.emitFile({
              type: 'asset',
              fileName,
              source: fs.readFileSync(path.resolve(__dirname, fileName)),
            });
          }
        },
      },
      {
        name: 'admin-route-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const pathname = req.url ? req.url.split('?')[0] : '';
            if (pathname === '/admin' || pathname === '/admin/') {
              res.statusCode = 302;
              res.setHeader('Location', '/admin.html');
              res.end();
              return;
            }
            if (pathname === '/admin/login' || pathname === '/admin/login/') {
              res.statusCode = 302;
              res.setHeader('Location', '/login.html?redirect=admin');
              res.end();
              return;
            }
            if (pathname === '/login' || pathname === '/login/') {
              res.statusCode = 302;
              res.setHeader('Location', '/login.html');
              res.end();
              return;
            }
            if (pathname === '/register' || pathname === '/register/') {
              res.statusCode = 302;
              res.setHeader('Location', '/register.html');
              res.end();
              return;
            }
            if (pathname === '/blog') {
              res.statusCode = 302;
              res.setHeader('Location', `/blog.html${req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`);
              res.end();
              return;
            }
            if (pathname.startsWith('/blog/')) {
              const slug = pathname.slice('/blog/'.length);
              const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
              res.statusCode = 302;
              res.setHeader('Location', `/blog-post.html?slug=${encodeURIComponent(decodeURIComponent(slug))}${query ? `&${query.slice(1)}` : ''}`);
              res.end();
              return;
            }
            if (pathname === '/reset-password' || pathname === '/reset-password/') {
              res.statusCode = 302;
              res.setHeader('Location', '/reset-password.html');
              res.end();
              return;
            }
            if (pathname === '/portal' || pathname === '/portal/') {
              res.statusCode = 302;
              res.setHeader('Location', '/portal.html');
              res.end();
              return;
            }
            if (pathname === '/admin-client' || pathname === '/admin-client/') {
              res.statusCode = 302;
              res.setHeader('Location', '/admin-client.html');
              res.end();
              return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': 'http://localhost:4000',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
          login: path.resolve(__dirname, 'login.html'),
          services: path.resolve(__dirname, 'services.html'),
          caseStudies: path.resolve(__dirname, 'case-studies.html'),
          portal: path.resolve(__dirname, 'portal.html'),
          register: path.resolve(__dirname, 'register.html'),
          resetPassword: path.resolve(__dirname, 'reset-password.html'),
          adminClient: path.resolve(__dirname, 'admin-client.html'),
          privacy: path.resolve(__dirname, 'privacy.html'),
          impressum: path.resolve(__dirname, 'impressum.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          accessibility: path.resolve(__dirname, 'accessibility.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          blogPost: path.resolve(__dirname, 'blog-post.html'),
        },
      },
    },
  };
});

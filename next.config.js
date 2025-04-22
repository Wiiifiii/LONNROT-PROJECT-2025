// next.config.js
import path from 'path';
import { createRequire } from 'module';
const requireModule = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Add path aliases for `@` and `@ui`
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
      '@ui': path.resolve(process.cwd(), 'src/app/components'),
    };

    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      canvas: false,
      inherits: requireModule.resolve('inherits'),
      'readable-stream': requireModule.resolve('readable-stream'),
    };

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

export default nextConfig;

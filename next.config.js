// next.config.js
import path from 'path';
import { createRequire } from 'module';
const requireModule = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Next.js Image to load from your Supabase bucket
  images: {
    domains: [
      'ngevmoprmgngavyjujav.supabase.co',
      // add any other external image domains you use
    ],
  },

  webpack(config) {
    // Add your existing path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
      '@ui': path.resolve(process.cwd(), 'src/app/components'),
    };

    // Preserve any fallbacks you need
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      canvas: false,
      inherits: requireModule.resolve('inherits'),
      'readable-stream': requireModule.resolve('readable-stream'),
    };

    return config;
  },

  // Move to the new key name
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;

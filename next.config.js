// next.config.js (CommonJS)
const path = require('path');
const { createRequire } = require('module');
const requireModule = createRequire(__filename);

function getSupabaseImageDomain() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) return null;
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Next.js Image to load from your Supabase bucket
  images: {
    domains: (() => {
      const domain = getSupabaseImageDomain();
      if (domain) return [domain];
      // Fallback to the previous project domain if env isn't set
      return ['ngevmoprmgngavyjujav.supabase.co'];
    })(),
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

module.exports = nextConfig;

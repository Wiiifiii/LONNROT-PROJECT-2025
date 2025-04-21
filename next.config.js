/* eslint-disable @typescript-eslint/no-require-imports */
const { createRequire } = require('module');
const requireModule = createRequire(__filename);
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config) {
    // Add path aliases for `@` and `@ui` as you had in your `tsconfig.json`
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'), // maps `@` to `src/`
      '@ui': path.resolve(__dirname, 'src/app/components'), // maps `@ui` to `src/app/components/`
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

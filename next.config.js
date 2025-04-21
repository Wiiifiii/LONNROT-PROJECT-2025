/* eslint-disable @typescript-eslint/no-require-imports */
const { createRequire } = require('module');
const requireModule = createRequire(__filename);

/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config) {
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

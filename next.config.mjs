import { createRequire } from 'module';
/** @type {import('next').NextConfig} */
const require = createRequire(import.meta.url);

const nextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      canvas: false,
      inherits: require.resolve('inherits'),
      'readable-stream': require.resolve('readable-stream'),
    };
    return config;
  },
};

export default nextConfig;

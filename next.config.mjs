/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      // Disable canvas polyfill
      canvas: false,
      // Provide a fallback for 'inherits' used by unzipper/readable-stream
      inherits: require.resolve('inherits'),
    };
    return config;
  },
};

export default nextConfig;

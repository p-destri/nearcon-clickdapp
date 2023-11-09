/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: { styledComponents: true },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)", // Matches all pages
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          }
        ]
      }
    ]
  },
  redirects: async () => {
    return [
    ];
  },
  rewrites: async () => [
  ],
};

module.exports = nextConfig;

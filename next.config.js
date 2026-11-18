/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/grupo', destination: '/', permanent: true },
      { source: '/empresas/demeter-god', destination: '/empresas#demeter-god', permanent: true },
      { source: '/empresas/demeter-soluciones-estrategicas', destination: '/empresas#demeter-soluciones-estrategicas', permanent: true },
      { source: '/empresas/demeter-water-consulting', destination: '/empresas#demeter-water-consulting', permanent: true },
    ]
  },
}

module.exports = nextConfig
